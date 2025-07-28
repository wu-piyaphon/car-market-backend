import { extractS3KeyFromUrl } from '@/common/utils/s3.utils';
import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET');
  }

  async uploadFile(file: Express.Multer.File, dir: string): Promise<string> {
    const datePrefix = new Date().toISOString().split('T')[0];

    const key = `${dir}/${datePrefix}/${uuidv4()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
  }

  async deleteFile(urls: string[] | string) {
    const urlsArray = Array.isArray(urls) ? urls : [urls];

    const keys = urlsArray.map((url) => ({ Key: extractS3KeyFromUrl(url) }));
    await this.s3.send(
      new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: keys },
      }),
    );
  }
}
