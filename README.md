# Car Market - Backend API

[![My Skills](https://skillicons.dev/icons?i=nestjs,postgres,docker,postman,jest,aws)](https://skillicons.dev)

## Overview

A robust RESTful API backend for a comprehensive car marketplace platform. Built with modern technologies and best practices, this system handles car listings, user authentication, selling requests, and car price estimation services.

![Car Listing Page](https://car-market-storage-bucket.s3.ap-southeast-7.amazonaws.com/port/Screenshot+2568-11-06+at+23.39.40.png)

*Browse and filter available cars with search by model, sub model, license plate, and more. Features paginated results with thumbnail images and detailed specifications.*

![Car Detail Page](https://car-market-storage-bucket.s3.ap-southeast-7.amazonaws.com/port/Screenshot+2568-11-06+at+23.50.12.png)

*View comprehensive car details including multiple images, full specifications (engine type, capacity, transmission), pricing, license plate information, and sales type.*

![Car Estimate Request Page](https://car-market-storage-bucket.s3.ap-southeast-7.amazonaws.com/port/Screenshot+2568-11-06+at+23.57.02.png)

*Receive car valuation requests with brand, model, year, contact details, and multiple image uploads. Includes optional installment information tracking and status management for admin follow-up.*

## 🌟 Key Features

### Authentication & Authorization

- **JWT-based Authentication**: Secure user login/logout with refresh tokens
- **Password Encryption**: bcrypt for secure password hashing

### Content Management System

- **Comprehensive Car Listings**: Full CRUD operations for vehicle content
- **Advanced Search & Filtering**: Multi-parameter car search capabilities
- **Image Management**: AWS S3 integration for car and related options photos
- **SEO-friendly URLs**: Slug-based car detail pages

### Request Management

- **Selling Requests**: Handle car consignment and direct sales
- **Estimate Requests**: Car valuation and price estimation service including image attachments

### Technical Excellence

- **Clean Architecture**: Modular design with separation of concerns
- **Type Safety**: Full TypeScript implementation
- **Validation**: Comprehensive input validation with class-validator
- **Database Relations**: Well-structured PostgreSQL schema with TypeORM
- **Error Handling**: Centralized exception handling

## ⚙️ Technology Stack

### Backend Framework

- **NestJS**: Progressive Node.js framework for scalable applications
- **TypeScript**: Type-safe JavaScript development
- **Express**: Underlying HTTP server framework

### Database & ORM

- **PostgreSQL**: Robust relational database
- **TypeORM**: Feature-rich ORM with Active Record pattern

### Cloud & Infrastructure

- **AWS S3**: Secure file storage and management
- **Docker**: Containerized deployment
- **Docker Compose**: Multi-container orchestration

### Security & Validation

- **JWT**: JSON Web Tokens for authentication
- **Passport**: Authentication middleware
- **class-validator**: Decorator-based validation
- **bcrypt**: Password hashing

### Development Tools

- **Jest**: Comprehensive testing framework
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

## 📁 Project Structure

```
src/
├── auth/                 # Authentication & authorization
├── car-brands/          # Car brand management
├── car-categories/      # Car category management
├── car-types/           # Car type management
├── cars/                # Car listings CRUD
├── common/              # Shared utilities & services
│   ├── aws-s3.service.ts    # AWS S3 integration
│   ├── decorators/          # Custom decorators
│   ├── enums/              # Application enums
│   ├── interfaces/         # TypeScript interfaces
│   └── pipes/              # Validation pipes
├── config/              # Configuration management
├── estimate-requests/   # Car valuation requests
├── selling-requests/    # Car selling requests
└── users/               # User management
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v22+)
- **Yarn** package manager
- **Docker & Docker Compose**
- **PostgreSQL** (if running locally)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/wu-piyaphon/car-market-backend.git
   cd car-market-backend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

4. **Start with Docker (Recommended)**
   ```bash
   yarn dev
   ```
   This command starts both the PostgreSQL database and the application in development mode.

### Available Scripts

```bash
# Development
yarn dev              # Start with Docker Compose
yarn start:dev        # Start in watch mode
yarn start:debug      # Start in debug mode

# Production
yarn build            # Build the application
yarn start:prod       # Start production server

# Testing
yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:cov         # Run tests with coverage
yarn test:e2e         # Run end-to-end tests

# Code Quality
yarn lint             # Run ESLint
yarn format           # Format code with Prettier
```

## ✏️ API Endpoints

### Authentication

- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user profile

### Car Management

- `GET /cars` - List cars with pagination and filters
- `GET /cars/:id` - Get car by ID
- `GET /cars/slug/:slug` - Get car by slug
- `POST /cars` - Create new car listing (Auth required)
- `PUT /cars/:id` - Update car (Auth required)
- `PATCH /cars/:id/activate` - Activate car listing (Auth required)
- `PATCH /cars/:id/disable` - Disable car listing (Auth required)
- `DELETE /cars/:id` - Delete car (Auth required)

### Option Management

- `GET /car-brands` - List all car brands
- `GET /car-categories` - List car categories
- `GET /car-types` - List car types

### Requests

- `POST /selling-requests` - Submit selling request
- `GET /selling-requests` - List selling requests (Auth required)
- `PUT /selling-requests/:id` - Update selling request (Auth required)

- `POST /estimate-requests` - Submit estimate request
- `GET /estimate-requests` - List estimate requests (Auth required)
- `PUT /estimate-requests/:id` - Update estimate request (Auth required)

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Unit tests
yarn test

# Test coverage
yarn test:cov
```

## ✨ Architecture Highlights

### Clean Architecture Principles

- **Modular Design**: Each feature is encapsulated in its own module
- **Dependency Injection**: Leveraging NestJS's powerful DI container
- **Single Responsibility**: Each service handles one specific domain
- **Interface Segregation**: Well-defined DTOs and interfaces

### Database Design

- **Normalized Schema**: Efficient relational database structure
- **Entity Relationships**: Properly mapped associations
- **Migration System**: Version-controlled schema changes

### Security Measures

- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: TypeORM query builder protection
- **CORS Configuration**: Secure cross-origin resource sharing
- **Authentication Guards**: Route-level protection
