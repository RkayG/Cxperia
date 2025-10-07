# API Documentation

## Overview

Cxperia provides a comprehensive REST API built with Next.js API routes. The API is organized into several modules covering authentication, experiences, tutorials, analytics, and more.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most API endpoints require authentication. Include the authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## API Modules

### 🔐 Authentication (`/api/auth/`)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/callback` - OAuth callback
- `DELETE /api/profile/delete` - Delete user account

### 🎨 Experiences (`/api/experiences/`)
- `GET /api/experiences` - List user experiences
- `POST /api/experiences` - Create new experience
- `GET /api/experiences/[id]` - Get experience details
- `PUT /api/experiences/[id]` - Update experience
- `DELETE /api/experiences/[id]` - Delete experience
- `POST /api/experiences/[id]/qr` - Generate QR code
- `PUT /api/experiences/[id]/theme` - Update theme/colors
- `PUT /api/experiences/[id]/features` - Enable/disable features

### 📚 Tutorials (`/api/tutorials/`)
- `GET /api/tutorials` - List tutorials
- `POST /api/tutorials` - Create tutorial
- `GET /api/tutorials/[id]` - Get tutorial details
- `PUT /api/tutorials/[id]` - Update tutorial
- `DELETE /api/tutorials/[id]` - Delete tutorial
- `POST /api/tutorials/[id]/unpublish` - Unpublish tutorial

### 🌐 Public API (`/api/public/`)
- `GET /api/public/experience/[slug]` - Get public experience
- `GET /api/public/experience/[slug]/tutorials` - Get experience tutorials
- `POST /api/public/experience/[slug]/scan` - Track scan event
- `GET /api/public/tutorials/[id]` - Get public tutorial
- `POST /api/public/tutorials/[id]/view` - Increment tutorial views

### 📊 Analytics (`/api/scan-analytics/`)
- `GET /api/scan-analytics/monthly` - Monthly scan analytics
- `GET /api/scan-analytics/summary` - Scan summary statistics

### 🏢 Admin (`/api/admin/`)
- `GET /api/admin/brands` - List all brands
- `GET /api/admin/experiences` - List all experiences
- `GET /api/admin/analytics` - Platform analytics

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **General endpoints**: 100 requests per minute
- **Authentication endpoints**: 10 requests per minute
- **File upload endpoints**: 20 requests per minute

## Pagination

List endpoints support pagination:

```http
GET /api/experiences?page=1&limit=10
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

```http
GET /api/tutorials?category=skincare&sort=created_at&order=desc
```

## File Uploads

File uploads are handled through Cloudinary integration:

```http
POST /api/upload/image
Content-Type: multipart/form-data

file: <image-file>
```

## Webhooks

Cxperia supports webhooks for real-time notifications:

- **Experience Created** - When a new experience is created
- **Tutorial Published** - When a tutorial is published
- **Scan Event** - When a QR code is scanned

## SDK and Libraries

Official client libraries are available:

- **JavaScript/TypeScript**: `@cxperia/sdk`
- **React**: `@cxperia/react`
- **Node.js**: `@cxperia/node`

## Examples

### Creating an Experience

```javascript
const response = await fetch('/api/experiences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Product Experience',
    description: 'Interactive product experience',
    product_id: 'product-123'
  })
});

const experience = await response.json();
```

### Generating QR Code

```javascript
const response = await fetch('/api/experiences/exp-123/qr', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const qrData = await response.json();
```

### Tracking Scan Event

```javascript
const response = await fetch('/api/public/experience/my-slug/scan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString()
  })
});
```

## Error Handling

Always handle API errors gracefully:

```javascript
try {
  const response = await fetch('/api/experiences');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error
}
```

## Testing

API endpoints can be tested using:

- **Postman Collection**: Available in `/docs/postman/`
- **cURL Examples**: Provided for each endpoint
- **SDK Tests**: Unit tests for client libraries

## Support

For API support:

- **Documentation**: This API reference
- **Issues**: [GitHub Issues](https://github.com/your-org/cxperia/issues)
- **Email**: api-support@cxperia.com
