# Auth API Contract

## Endpoints
### POST `/api/v1/auth/login`
- **Request**: `LoginRequest` (from shared-types)
- **Response**: `AuthResponse`
- **Description**: Authenticates user and returns JWT.

### POST `/api/v1/auth/refresh`
- **Request**: `{ refreshToken: string }`
- **Response**: `AuthResponse`
