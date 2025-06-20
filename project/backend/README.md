# Garage Management Backend API - Modular Architecture

A comprehensive REST API for garage management system built with Express.js, TypeScript, and PostgreSQL using a modular architecture where each business domain has its own module with dedicated controllers, services, and repositories.

## Architecture Overview

This backend follows a **modular monolith** architecture pattern, implementing SOLID principles and clean architecture concepts:

```
src/
├── modules/                    # Business domain modules
│   ├── auth/                  # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   ├── client/                # Client management module
│   │   ├── client.controller.ts
│   │   ├── client.service.ts
│   │   ├── client.repository.ts
│   │   └── client.routes.ts
│   ├── vehicule/              # Vehicle management module
│   ├── prestation/            # Services catalog module
│   ├── devis/                 # Quotes module
│   ├── odr/                   # Work orders module
│   ├── facture/               # Invoicing module
│   ├── dashboard/             # Dashboard metrics module
│   └── parametres/            # System settings module
├── shared/                    # Shared components
│   └── repositories/
│       └── base.repository.ts # Base repository pattern
├── middleware/                # Express middleware
├── config/                    # Configuration
├── utils/                     # Utilities
├── types/                     # TypeScript definitions
└── server.ts                  # Application entry point
```

## Key Design Patterns

### 1. Module Pattern
Each business domain is encapsulated in its own module with:
- **Controller**: Handles HTTP requests/responses
- **Service**: Contains business logic
- **Repository**: Data access layer
- **Routes**: Route definitions

### 2. Repository Pattern
- Base repository with common CRUD operations
- Domain-specific repositories extending base functionality
- Database abstraction layer

### 3. Service Layer Pattern
- Business logic separation from controllers
- Domain-specific business rules
- Cross-cutting concerns handling

### 4. Dependency Injection
- Loose coupling between layers
- Easy testing and mocking
- Flexible component replacement

## Module Structure

### Client Module (`/modules/client/`)
Handles client management operations:
- CRUD operations for clients
- Search and pagination
- Client statistics
- Business validation (email uniqueness, etc.)

### Vehicle Module (`/modules/vehicule/`)
Manages vehicle registration and tracking:
- Vehicle CRUD operations
- Client-vehicle relationships
- Immatriculation validation

### Prestation Module (`/modules/prestation/`)
Service catalog management:
- Service definitions for carrosserie and mécanique
- Pricing management
- Service categorization

### Devis Module (`/modules/devis/`)
Quote management system:
- Quote creation with line items
- Status tracking (EN_ATTENTE, ACCEPTE, REFUSE, EXPIRE)
- Automatic calculations (HT, TVA, TTC)

### ODR Module (`/modules/odr/`)
Work order management:
- Order creation and tracking
- Status management (EN_COURS, TERMINE, ANNULE)
- Service type categorization

### Facture Module (`/modules/facture/`)
Invoice management:
- Invoice generation
- Payment tracking
- Multiple payment methods support

### Dashboard Module (`/modules/dashboard/`)
Business intelligence and metrics:
- Real-time KPIs
- Alert system for overdue invoices
- Activity feed

### Parametres Module (`/modules/parametres/`)
System configuration:
- Agent activation settings
- API key management
- Payment method configuration

## Benefits of Modular Architecture

### 1. **Separation of Concerns**
Each module handles a specific business domain, making the codebase easier to understand and maintain.

### 2. **Scalability**
- Modules can be developed independently
- Easy to add new features within existing modules
- Potential for future microservices migration

### 3. **Maintainability**
- Clear boundaries between business domains
- Easier debugging and testing
- Reduced coupling between components

### 4. **Team Collaboration**
- Different teams can work on different modules
- Clear ownership of business domains
- Reduced merge conflicts

### 5. **Testing**
- Unit testing at module level
- Easy mocking of dependencies
- Integration testing per module

## API Endpoints by Module

### Authentication Module
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### Client Module
```
GET    /api/clients
GET    /api/clients/search
GET    /api/clients/stats
GET    /api/clients/:id
POST   /api/clients
PUT    /api/clients/:id
DELETE /api/clients/:id
```

### Vehicle Module
```
GET    /api/vehicules
GET    /api/vehicules/search
GET    /api/vehicules/:id
POST   /api/vehicules
PUT    /api/vehicules/:id
DELETE /api/vehicules/:id
```

### Dashboard Module
```
GET /api/dashboard/metrics
GET /api/dashboard/alerts
GET /api/dashboard/activity
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

4. Start the development server:
```bash
npm run dev
```

## Adding New Modules

To add a new business domain module:

1. Create module directory: `src/modules/new-module/`
2. Create controller: `new-module.controller.ts`
3. Create service: `new-module.service.ts`
4. Create repository: `new-module.repository.ts` (if needed)
5. Create routes: `new-module.routes.ts`
6. Register routes in `server.ts`

### Example Module Structure:
```typescript
// new-module.controller.ts
export class NewModuleController {
  private newModuleService: NewModuleService;
  
  constructor() {
    this.newModuleService = new NewModuleService();
  }
  
  // Controller methods...
}

// new-module.service.ts
export class NewModuleService {
  private newModuleRepository: NewModuleRepository;
  
  constructor() {
    this.newModuleRepository = new NewModuleRepository();
  }
  
  // Business logic methods...
}

// new-module.repository.ts
export class NewModuleRepository extends BaseRepository<NewModuleEntity> {
  constructor() {
    super('newModule');
  }
  
  // Data access methods...
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Module-level permissions
- **Input Validation**: Joi schema validation per module
- **Rate Limiting**: Request throttling
- **CORS Configuration**: Cross-origin resource sharing
- **Helmet Security**: Security headers

## Testing Strategy

### Unit Testing
- Test each module independently
- Mock dependencies between modules
- Focus on business logic in services

### Integration Testing
- Test module interactions
- Database integration tests
- API endpoint testing

### Example Test Structure:
```
tests/
├── unit/
│   ├── modules/
│   │   ├── client/
│   │   │   ├── client.service.test.ts
│   │   │   └── client.repository.test.ts
│   │   └── vehicule/
│   └── shared/
└── integration/
    ├── client.integration.test.ts
    └── vehicule.integration.test.ts
```

## Performance Considerations

- **Database Indexing**: Proper indexes on frequently queried fields
- **Pagination**: All list endpoints support pagination
- **Caching**: Redis integration for frequently accessed data
- **Connection Pooling**: Prisma connection management

## Deployment

The modular architecture supports various deployment strategies:

1. **Monolith Deployment**: Deploy entire application as single unit
2. **Modular Deployment**: Deploy modules independently (future microservices)
3. **Container Deployment**: Docker support for each module

## Contributing

1. Follow the modular architecture patterns
2. Each module should be self-contained
3. Use dependency injection for loose coupling
4. Write tests for new modules
5. Update documentation for new endpoints

## License

MIT License