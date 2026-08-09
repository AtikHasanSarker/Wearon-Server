Wearon Backend API Documentation
# Wearon Backend API

RESTful backend API for the Wearon e-commerce application.

## Tech Stack

- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- CORS
- dotenv

---

# Base URL

### Development

http://localhost:5000

All API endpoints are prefixed with:

/api

---

# Authentication

Wearon uses JWT Bearer Authentication.

After successful login, the API returns a JWT token.

For protected endpoints, send the token using the Authorization header:

Authorization: Bearer <JWT_TOKEN>

---

# Standard API Response

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
Error Response
{
  "success": false,
  "message": "Something went wrong"
}
1. Authentication APIs
1.1 Register User

Creates a new user account.

Endpoint

POST /api/auth/register

Authentication

Public

Request Body
{
  "name": "Atik Hasan",
  "email": "atik@example.com",
  "password": "12345678"
}
Success Response

201 Created

{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Atik Hasan",
      "email": "atik@example.com",
      "role": "USER"
    }
  }
}
Possible Status Codes
Status	Description
201	User registered successfully
400	Missing or invalid fields
409	Email already exists
500	Internal server error
1.2 Login

Authenticates a user and returns a JWT token.

Endpoint

POST /api/auth/login

Authentication

Public

Request Body
{
  "email": "atik@example.com",
  "password": "12345678"
}
Success Response

200 OK

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Atik Hasan",
      "email": "atik@example.com",
      "role": "USER"
    },
    "token": "JWT_TOKEN"
  }
}
Possible Status Codes
Status	Description
200	Login successful
400	Missing fields
401	Invalid email or password
500	Internal server error
1.3 Get Current User

Returns the currently authenticated user's information.

Endpoint

GET /api/auth/me

Authentication

Required

Authorization: Bearer <JWT_TOKEN>
Request Body

None

Success Response

200 OK

{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Atik Hasan",
      "email": "atik@example.com",
      "role": "USER",
      "createdAt": "2026-08-10T00:00:00.000Z",
      "updatedAt": "2026-08-10T00:00:00.000Z"
    }
  }
}
Possible Status Codes
Status	Description
200	User retrieved
401	Missing or invalid token
404	User not found
500	Internal server error
2. Category APIs
2.1 Create Category

Creates a new product category.

Endpoint

POST /api/categories

Authentication

Required

Request Body
{
  "name": "T-Shirts",
  "description": "Men's and women's t-shirts"
}
Success Response

201 Created

{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": "uuid",
      "name": "T-Shirts",
      "description": "Men's and women's t-shirts",
      "isDeleted": false
    }
  }
}
Status Codes
Status	Description
201	Category created
400	Invalid request
401	Authentication required
500	Internal server error
2.2 Get All Categories

Returns all active categories.

Endpoint

GET /api/categories

Authentication

Public

Request Body

None

Success Response

200 OK

{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "T-Shirts",
        "description": "Men's and women's t-shirts"
      }
    ]
  }
}
2.3 Get Category By ID
Endpoint

GET /api/categories/:id

Authentication

Public

Success Response

200 OK

{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category": {
      "id": "uuid",
      "name": "T-Shirts",
      "description": "Men's and women's t-shirts"
    }
  }
}
Status Codes
Status	Description
200	Category found
404	Category not found
500	Internal server error
2.4 Update Category
Endpoint

PATCH /api/categories/:id

Authentication

Required

Request Body
{
  "name": "Premium T-Shirts",
  "description": "Premium quality t-shirts"
}
Success Response

200 OK

{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {}
  }
}
Status Codes
Status	Description
200	Category updated
401	Authentication required
404	Category not found
500	Internal server error
2.5 Delete Category

Performs a soft delete.

Endpoint

DELETE /api/categories/:id

Authentication

Required

Success Response

200 OK

{
  "success": true,
  "message": "Category deleted successfully",
  "data": {}
}
Status Codes
Status	Description
200	Category deleted
401	Authentication required
404	Category not found
500	Internal server error
3. Product APIs
3.1 Create Product

Creates a new product.

The userId is automatically taken from the authenticated JWT user.

Endpoint

POST /api/products

Authentication

Required

Request Body
{
  "name": "Premium T-Shirt",
  "description": "100% cotton premium t-shirt",
  "price": 1200,
  "stock": 50,
  "categoryId": "CATEGORY_ID"
}

Optional:

{
  "status": "ACTIVE"
}
Success Response

201 Created

{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {}
  }
}
Status Codes
Status	Description
201	Product created
400	Invalid product data
401	Authentication required
404	Category not found
500	Internal server error
3.2 Get All Products

Returns all active products.

Endpoint

GET /api/products

Authentication

Public

Success Response

200 OK

{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": []
  }
}
3.3 Get Product By ID
Endpoint

GET /api/products/:id

Authentication

Public

Success Response

200 OK

{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product": {}
  }
}
Status Codes
Status	Description
200	Product found
404	Product not found
500	Internal server error
3.4 Update Product
Endpoint

PATCH /api/products/:id

Authentication

Required

Request Body

All fields are optional.

{
  "name": "Premium Cotton T-Shirt",
  "description": "Updated description",
  "price": 1400,
  "stock": 40,
  "status": "ACTIVE",
  "categoryId": "CATEGORY_ID"
}

userId cannot be changed.

Success Response

200 OK

{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": {}
  }
}
3.5 Delete Product

Performs a soft delete.

Endpoint

DELETE /api/products/:id

Authentication

Required

Success Response

200 OK

{
  "success": true,
  "message": "Product deleted successfully",
  "data": {}
}
4. Review APIs
4.1 Create Review

A user can review a product only once.

Endpoint

POST /api/reviews

Authentication

Required

Request Body
{
  "rating": 5,
  "comment": "Very good product.",
  "productId": "PRODUCT_ID"
}
Success Response

201 Created

{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "review": {}
  }
}
Status Codes
Status	Description
201	Review created
400	Invalid rating
401	Authentication required
404	Product not found
409	User already reviewed this product
500	Internal server error
4.2 Get All Reviews
Endpoint

GET /api/reviews

Authentication

Public

Success Response

200 OK

{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": []
  }
}
4.3 Get Review By ID
Endpoint

GET /api/reviews/:id

Authentication

Public

Success Response

200 OK

{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {
    "review": {}
  }
}
4.4 Update Review

Only the user who created the review can update it.

Endpoint

PATCH /api/reviews/:id

Authentication

Required

Request Body
{
  "rating": 4,
  "comment": "Updated review."
}
Success Response

200 OK

{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": {}
  }
}
4.5 Delete Review

Performs a soft delete.

Endpoint

DELETE /api/reviews/:id

Authentication

Required

Success Response

200 OK

{
  "success": true,
  "message": "Review deleted successfully",
  "data": {}
}
5. Order APIs
5.1 Create Order

Creates an order for the authenticated user.

userId and totalPrice are generated by the backend.

Endpoint

POST /api/orders

Authentication

Required

Request Body
{
  "quantity": 2,
  "productId": "PRODUCT_ID"
}
Business Logic

The backend:

Checks the product.
Checks available stock.
Calculates total price.
Creates the order.
Reduces product stock.
Uses a Prisma transaction.
Formula
totalPrice = product.price × quantity
Success Response

201 Created

{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "uuid",
      "quantity": 2,
      "totalPrice": 2400,
      "status": "PENDING"
    }
  }
}
Status Codes
Status	Description
201	Order created
400	Invalid quantity / insufficient stock
401	Authentication required
404	Product not found
500	Internal server error
5.2 Get My Orders

Returns orders belonging to the authenticated user.

Endpoint

GET /api/orders

Authentication

Required

Success Response

200 OK

{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": []
  }
}
5.3 Get Order By ID
Endpoint

GET /api/orders/:id

Authentication

Required

Success Response

200 OK

{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "order": {}
  }
}
5.4 Update Order Status

Only the order status can be updated.

Endpoint

PATCH /api/orders/:id

Authentication

Required

Request Body
{
  "status": "CONFIRMED"
}

Allowed statuses:

PENDING
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
Success Response

200 OK

{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "order": {}
  }
}
5.5 Delete Order

Performs a soft delete.

Endpoint

DELETE /api/orders/:id

Authentication

Required

Success Response

200 OK

{
  "success": true,
  "message": "Order deleted successfully",
  "data": {}
}
Database Enums
UserRole
USER
ADMIN
ProductStatus
ACTIVE
INACTIVE
OUT_OF_STOCK
OrderStatus
PENDING
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
Soft Delete

The following models support soft delete:

User
Category
Product
Review
Order

Records are not permanently removed from the database.

Instead:

isDeleted = true

is used.

HTTP Status Codes
Code	Meaning
200	Request successful
201	Resource created
400	Bad request
401	Authentication required / invalid credentials
403	Forbidden
404	Resource not found
409	Conflict
500	Internal server error
Security
Passwords are hashed using bcrypt.
Passwords are never returned in API responses.
JWT is used for authentication.
JWT secret is stored in environment variables.
Database credentials are stored in environment variables.
.env must not be committed to GitHub.
Environment Variables
DATABASE_URL="your_postgresql_database_url"

JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"

PORT=5000