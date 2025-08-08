export interface JwtPayload {
  id: string;
  email: string;
  type?: 'refresh';
}
