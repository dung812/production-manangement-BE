# NestJS Product API

A modern, scalable NestJS API for product management with TypeScript, PostgreSQL, and comprehensive documentation.

## ✨ Features

- **Modern Architecture**: Built with NestJS framework following best practices
- **TypeScript**: Full TypeScript support with strict type checking
- **Database**: PostgreSQL with TypeORM for robust data management
- **API Documentation**: Swagger/OpenAPI integration
- **Validation**: Comprehensive input validation with class-validator
- **Error Handling**: Global exception filters and proper error responses
- **Security**: Helmet integration for security headers
- **Rate Limiting**: Built-in throttling protection
- **Docker Support**: Complete Docker and docker-compose setup
- **Testing**: Jest testing framework with unit tests
- **Code Quality**: ESLint and Prettier for consistent code formatting

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nest-product-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your database connection in `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/nest_product_api
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`
API Documentation: `http://localhost:3000/documentation`

## 🐳 Docker Setup

### Development with Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Production Build

```bash
# Build production image
docker build -t nest-product-api:prod --target production .

# Run production container
docker run -p 3000:3000 --env-file .env nest-product-api:prod
```

## 📚 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products with pagination and filters |
| GET | `/api/v1/products/:id` | Get a specific product |
| POST | `/api/v1/products` | Create a new product |
| PUT | `/api/v1/products/:id` | Update a product |
| DELETE | `/api/v1/products/:id` | Delete a product |

### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `search`: Search in name or code
- `productType`: Filter by product type (finished, semi_finished, raw_material)
- `isActive`: Filter by active status (true/false)
- `sortBy`: Sort field (name, code, createdAt, updatedAt)
- `sortOrder`: Sort order (ASC, DESC)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🛠️ Development Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debug mode

# Building
npm run build              # Build for production
npm run start:prod         # Run production build

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Database
npm run seed               # Run database seeder
npm run migration:generate # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
```

## 📁 Project Structure

```
src/
├── common/                 # Shared utilities and configurations
│   ├── configs/           # Configuration files
│   ├── dto/               # Common DTOs
│   ├── entities/          # Base entities
│   ├── filters/           # Exception filters
│   └── interceptors/      # Global interceptors
├── modules/               # Feature modules
│   └── product/          # Product module
│       ├── dto/          # Product DTOs
│       ├── product.controller.ts
│       ├── product.entity.ts
│       ├── product.module.ts
│       ├── product.service.ts
│       └── product.service.spec.ts
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## 🔧 Configuration

The application uses a hierarchical configuration system:

1. `.env.local` (highest priority)
2. `.env`
3. Environment variables
4. Default values

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `APP_PORT` | Application port | 3000 |
| `API_PREFIX` | API prefix | api/v1 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `DATABASE_SYNCHRONIZE` | Auto-sync database schema | true |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [Awesome NestJS Boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate) - Inspiration and best practices
