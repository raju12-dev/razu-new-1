# HyperLocal Delivery MVP

A lean Minimum Viable Product for a hyperlocal delivery startup using the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Customer App**: Browse products, add to cart, checkout (Cash on Delivery), and track order status.
- **Admin Dashboard**: Manage product inventory (Add/Edit/Delete) and update order statuses.
- **Authentication**: Simple JWT email/password auth for quick onboarding.

## Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (running locally on port 27017 or a MongoDB Atlas URI)

## Step-by-Step Run Instructions

### 1. Start MongoDB
Ensure your local MongoDB instance is running, or that `backend/.env` points to a valid `MONGODB_URI`.
The default local URI is `mongodb://127.0.0.1:27017/hyperlocal_mvp`.

### 2. Run the Backend Server
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
npm run dev
# Alternatively, use 'node index.js' if nodemon isn't running
```
The API server will run on http://localhost:5000.

### 3. Run the Frontend App
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
The React app will typically run on http://localhost:5173.

## Usage Guide
1. Open the frontend URL in your browser.
2. Click **Sign up** to create an account.
3. *Note*: To access the Admin Dashboard, the first account needs `isAdmin: true` in the database. 
   - You can manually set this via a MongoDB client (like MongoDB Compass) for your user document: `{"isAdmin": true}`.
4. As an Admin, add a few placeholder products.
5. Log out, sign in as a standard user (or use the same one), add items to your cart, and place a COD order.
6. Verify the order appears in "My Orders", and administrators can update its status in the "Admin Dashboard".
