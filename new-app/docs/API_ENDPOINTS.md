# API Endpoint Specifications

Based on the legacy routes, here are the essential REST API endpoints for fastest development:

## Authentication

### POST /api/auth/login
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "roles": ["operations", "manager"]
  }
}
```

### POST /api/auth/logout
**Headers:** `Authorization: Bearer {token}`
**Response:** `204 No Content`

### POST /api/auth/change-password
**Request:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

## Users (Operations only)

### GET /api/users
**Response:**
```json
[
  {
    "id": 1,
    "username": "string",
    "email": "string",
    "roles": ["operations"]
  }
]
```

### POST /api/users
**Request:**
```json
{
  "username": "string",
  "email": "string",
  "roles": ["personnel", "manager"],
  "areaIds": [1, 2] // if manager role
}
```

### PUT /api/users/:id
### DELETE /api/users/:id

## Schedules

### GET /api/schedules
**Query params:** `?mine=true` (user's schedules only)
**Response:**
```json
{
  "mine": [
    {
      "id": 1,
      "name": "My Draft",
      "request": 0,
      "template": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "all": [...] // if operations role
}
```

### GET /api/schedules/:id
**Response:**
```json
{
  "id": 1,
  "name": "string",
  "request": 0,
  "template": false,
  "areas": [...],
  "days": [...],
  "people": [...]
}
```

### POST /api/schedules/copy
**Request:**
```json
{
  "sourceId": 1,
  "name": "New Schedule Name"
}
```

### POST /api/schedules/publish
**Request:**
```json
{
  "name": "Published Schedule Name",
  "start": "2024-01-01T00:00:00Z",
  "end": "2024-01-07T23:59:59Z"
}
```

### DELETE /api/schedules/:id

## Areas

### GET /api/areas
**Query:** `?scheduleId=1`
**Response:**
```json
[
  {
    "id": 1,
    "name": "Emergency Department",
    "shortName": "ED",
    "shifts": [...],
    "floatingShifts": [...]
  }
]
```

### POST /api/areas
### PUT /api/areas/:id
### DELETE /api/areas/:id

## People

### GET /api/people
**Query:** `?scheduleId=1`
**Response:**
```json
[
  {
    "id": 1,
    "first": "John",
    "last": "Doe",
    "name": "John D", // auto-generated display name
    "category": {
      "id": 1,
      "name": "Resident",
      "color": "#ff0000"
    }
  }
]
```

### POST /api/people
### PUT /api/people/:id
### POST /api/people/:id/retire
### POST /api/people/:id/restore

## Shifts

### GET /api/shifts
**Query:** `?scheduleId=1&areaId=2&dayId=3`

### POST /api/shifts
**Request:**
```json
{
  "areaId": 1,
  "dayId": 1,
  "start": "08:00:00",
  "end": "16:00:00",
  "numPeople": 2
}
```

### PUT /api/shifts/:id
### DELETE /api/shifts/:id

## Assignments

### POST /api/assignments
**Request:**
```json
{
  "shiftId": 1,
  "personId": 1, // or 0 for "other"
  "name": "External Person" // if personId = 0
}
```

### DELETE /api/assignments/:id

### POST /api/assignments/:id/star
### DELETE /api/assignments/:id/star

### POST /api/assignments/swap
**Request:**
```json
{
  "assignmentId": 1,
  "newPersonId": 2
}
```

## Floating Shifts

### POST /api/floating-shifts
**Request:**
```json
{
  "areaId": 1,
  "personId": 1,
  "hours": 8.5
}
```

### PUT /api/floating-shifts/:id
### DELETE /api/floating-shifts/:id

## Off Days

### POST /api/off-days/toggle
**Request:**
```json
{
  "personId": 1,
  "dayId": 1
}
```

## Changes (Undo/Redo)

### POST /api/changes/undo
### POST /api/changes/redo
### GET /api/changes/history

## Schedule Requests

### POST /api/schedule-requests
**Request:**
```json
{
  "areaId": 1,
  "name": "Week 1 Request",
  "basedOn": "template", // or "published", "submitted", "blank"
  "sourceId": 1 // template/schedule ID
}
```

### PUT /api/schedule-requests/:id/submit
### GET /api/schedule-requests
### DELETE /api/schedule-requests/:id

### POST /api/schedule-requests/:id/accept // Operations only

## Notes

### GET /api/notes/personnel/:personId
### POST /api/notes/personnel
### PUT /api/notes/personnel/:id

### GET /api/notes/operations/:personId  
### POST /api/notes/operations
### PUT /api/notes/operations/:id

### GET /api/notes/manager/:areaId
### PUT /api/notes/manager/:areaId

## Settings

### GET /api/settings
**Response:**
```json
{
  "autoSelect": "123",
  "showDates": "true"
}
```

### PUT /api/settings
**Request:**
```json
{
  "key": "autoSelect",
  "value": "456"
}
```

## Error Responses

All endpoints return consistent error format:
```json
{
  "error": {
    "message": "Validation failed",
    "field": "username", // if field-specific
    "code": "VALIDATION_ERROR"
  }
}
```

## Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (for deletes)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate username)
- `500` - Internal Server Error

## Authentication
- All endpoints except `/api/auth/login` require `Authorization: Bearer {token}` header
- JWT tokens contain user ID and roles for authorization
- Tokens expire after 24 hours (configurable)