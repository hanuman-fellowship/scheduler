# Authentication & Authorization Specifications

Based on the legacy Authsome system, keeping it simple for fastest development:

## Authentication Flow

### User Login
1. User submits username/password to `POST /api/auth/login`
2. Server validates credentials against `users` table (hashed password)
3. If valid, server generates JWT token containing:
   ```json
   {
     "userId": 1,
     "username": "jdoe",
     "roles": ["operations", "manager"],
     "managedAreas": [1, 2, 3], // if manager role
     "exp": 1640995200 // 24 hour expiration
   }
   ```
4. Client stores token in localStorage/sessionStorage
5. Client includes token in Authorization header for all API calls

### Token Refresh
- Keep it simple: no refresh tokens initially
- Tokens expire after 24 hours, user must re-login
- Can add refresh token later if needed

### Logout
- Client calls `POST /api/auth/logout` (optional - just clears server-side blacklist)
- Client removes token from storage

## Authorization Roles

### Operations Role
**Full system access:**
- Manage all users, schedules, areas, people
- Publish schedules to schedule groups
- View/manage all schedule requests
- Access all system features

### Manager Role  
**Area-specific management:**
- Manage assigned areas (via `managers` table)
- Create/edit schedule requests for their areas
- Submit requests to operations
- Manage people within their areas
- View schedules and assignments

### Personnel Role
**Basic user access:**
- View published schedules
- View their own assignments
- Change their own password
- Basic read-only access

## API Authorization Rules

### Endpoint Access Control

**Public (no auth required):**
- `POST /api/auth/login`

**Any authenticated user:**
- `POST /api/auth/logout`
- `POST /api/auth/change-password`
- `GET /api/settings`
- `PUT /api/settings`

**Operations only:**
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/schedules/publish`
- `DELETE /api/schedules/:id` (any schedule)
- `GET /api/schedule-requests` (all requests)
- `POST /api/schedule-requests/:id/accept`

**Manager + Operations:**
- `POST /api/schedule-requests`
- `PUT /api/schedule-requests/:id/submit`
- `DELETE /api/schedule-requests/:id` (own requests only for managers)
- `POST /api/areas` (for their areas)
- `PUT /api/areas/:id` (for their areas)
- `POST /api/people`
- `PUT /api/people/:id`
- Area-specific operations

**All roles (with data filtering):**
- `GET /api/schedules` - Personnel see published only, Managers see published + their requests
- `GET /api/areas` - Managers see their areas, Personnel see all
- `GET /api/people` - All see current people in schedule
- Schedule viewing and basic operations

## Authorization Middleware

### Express Middleware Pattern
```javascript
// Auth middleware - verify JWT token
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({error: 'No token'});
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({error: 'Invalid token'});
  }
}

// Role-based middleware
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user.roles.some(role => roles.includes(role))) {
      return res.status(403).json({error: 'Insufficient permissions'});
    }
    next();
  };
}

// Manager area access middleware
function requireAreaAccess(req, res, next) {
  const areaId = req.params.areaId || req.body.areaId;
  if (req.user.roles.includes('operations')) {
    return next(); // Operations can access any area
  }
  if (req.user.managedAreas?.includes(parseInt(areaId))) {
    return next(); // Manager can access their areas
  }
  res.status(403).json({error: 'Area access denied'});
}
```

### Usage Examples
```javascript
// Operations only
app.get('/api/users', authenticate, requireRole(['operations']), getUsersHandler);

// Manager or Operations
app.post('/api/areas', authenticate, requireRole(['manager', 'operations']), requireAreaAccess, createAreaHandler);

// Any authenticated user
app.get('/api/schedules', authenticate, getSchedulesHandler);
```

## Data Filtering by Role

### Schedule Access
- **Operations**: All schedules
- **Manager**: Published schedules + their own requests  
- **Personnel**: Published schedules only

### Area Access
- **Operations**: All areas
- **Manager**: Areas they manage (via `managers` table)
- **Personnel**: All areas (read-only)

### User Management
- **Operations**: All users
- **Manager/Personnel**: Own user record only

## Password Security

### Password Hashing
- Use bcrypt with salt rounds 10-12
- Migrate from legacy Authsome hash if needed
- Store only hashed passwords, never plaintext

### Password Requirements
- Minimum 4 characters (matching legacy system initially)
- Can add complexity requirements later

### Password Reset
- Simple email-based reset flow
- Generate temporary token, email reset link
- Token expires after 1 hour

## Security Headers

### CORS
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Security Headers
```javascript
app.use(helmet()); // Basic security headers
app.disable('x-powered-by'); // Don't advertise Express
```

### Rate Limiting
```javascript
// Basic rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
```

This keeps authentication simple but secure, matching the legacy system's role-based approach while using modern JWT tokens.