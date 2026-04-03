# Finance Data Processing and Access Control Backend

A comprehensive backend system for managing financial records with role-based access control, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (VIEWER, ANALYST, ADMIN)
- **User Management**: Complete CRUD operations for user management (Admin only)
- **Financial Records Management**: Create, read, update, and delete financial transactions
- **Dashboard Analytics**: Summary statistics, trends analysis, and category breakdowns
- **Access Control**: Role-based permissions enforced at middleware and service layers
- **Data Validation**: Comprehensive input validation using Zod
- **Error Handling**: Centralized error handling with detailed error responses
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Testing**: Automated unit tests with Jest
- **Security**: Password hashing, JWT tokens, rate limiting, security headers

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **API Docs**: Swagger UI Express

## 🏗️ Project Structure

```
Backend/
├── src/
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── tests/                # Test files
├── docs/                 # Documentation
└── package.json
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- PowerShell 7 (for running scripts on Windows)

### Installation Steps

1. **Install PowerShell 7** (if on Windows and not installed):
   ```bash
   # Run this in your current terminal
   winget install Microsoft.Powershell
   ```
   After installation, restart your terminal.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/finance_db
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed initial data
   npm run prisma:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 🔐 Test Credentials

After seeding the database, you can use these credentials:

| Role    | Email                 | Password      |
|---------|-----------------------|---------------|
| ADMIN   | admin@finance.com     | Admin@123     |
| ANALYST | analyst@finance.com   | Analyst@123   |
| VIEWER  | viewer@finance.com    | Viewer@123    |

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:3000/api-docs

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile (Protected)

### User Management (Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Update user status

### Financial Records
- `POST /api/records` - Create record (Analyst, Admin)
- `GET /api/records` - List records with filtering (All roles)
- `GET /api/records/:id` - Get record by ID (All roles)
- `PUT /api/records/:id` - Update record (Analyst, Admin)
- `DELETE /api/records/:id` - Delete record (Admin only)

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary (All roles)
- `GET /api/dashboard/trends` - Get trends data (Analyst, Admin)

## 🔒 Access Control Matrix

| Role    | View Records | Create Records | Update Records | Delete Records | Manage Users | View Dashboard |
|---------|-------------|---------------|---------------|---------------|--------------|----------------|
| VIEWER  | ✓ (own)     | ✗             | ✗             | ✗             | ✗            | ✓ (own)        |
| ANALYST | ✓ (own)     | ✓             | ✓ (own)       | ✗             | ✗            | ✓ (own)        |
| ADMIN   | ✓ (all)     | ✓             | ✓ (all)       | ✓             | ✓            | ✓ (all)        |

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

View test coverage:
```bash
npm test -- --coverage
```

## 🏃 Running in Production

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📊 Database Schema

### Users Table
- `id` (UUID) - Primary key
- `email` (String, unique) - User email
- `password_hash` (String) - Hashed password
- `full_name` (String) - User's full name
- `role` (Enum) - VIEWER, ANALYST, or ADMIN
- `status` (Enum) - ACTIVE or INACTIVE
- `created_at`, `updated_at` (DateTime)

### Financial Records Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `amount` (Decimal) - Transaction amount
- `type` (Enum) - INCOME or EXPENSE
- `category` (String) - Transaction category
- `date` (DateTime) - Transaction date
- `description` (Text, optional) - Transaction description
- `created_at`, `updated_at`, `deleted_at` (DateTime)

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with 10 rounds
- **JWT Authentication**: Stateless token-based auth
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Rate Limiting**: Configurable rate limits per endpoint
- **Security Headers**: Helmet.js for HTTP security headers
- **CORS**: Configurable cross-origin resource sharing
- **Soft Deletes**: Financial records use soft deletes for audit trail

## 🎨 Design Decisions

1. **Layered Architecture**: Routes → Controllers → Services → Database for clear separation of concerns
2. **Role-Based Access Control**: Middleware-based authorization with granular permissions
3. **Soft Deletes**: Financial records are soft-deleted to maintain data integrity and audit trail
4. **Single Currency**: All amounts in USD (can be extended for multi-currency)
5. **UTC Timestamps**: All dates stored in UTC for consistency
6. **Pagination**: Default 20 items per page, max 100
7. **Token Expiry**: JWT tokens valid for 24 hours
8. **Default Role**: New users assigned VIEWER role by default

## 📝 Environment Variables

```env
# Server
NODE_ENV=development|production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# Bcrypt
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Check if the database exists

### Migration Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name your_migration_name
```

### PowerShell Issues on Windows
If you encounter PowerShell errors:
1. Install PowerShell 7: `winget install Microsoft.Powershell`
2. Restart your terminal

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 🤝 Contributing

For production use, consider:
- Adding comprehensive logging (Winston, Pino)
- Implementing caching (Redis)
- Adding monitoring (PM2, New Relic)
- Setting up CI/CD pipeline
- Adding database backups
- Implementing audit logging
- Adding email notifications
- Multi-factor authentication

## 📄 License

ISC

## ✅ Implementation Checklist

- [x] User and role management
- [x] JWT authentication
- [x] Financial records CRUD
- [x] Role-based access control
- [x] Dashboard analytics
- [x] Input validation
- [x] Error handling
- [x] Database schema with indexes
- [x] Soft deletes
- [x] API documentation (Swagger)
- [x] Unit tests
- [x] Security headers
- [x] Rate limiting
- [x] Comprehensive README

---

Built for production-ready backend foundations.
