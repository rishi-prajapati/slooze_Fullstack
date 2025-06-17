🍽️ Food Ordering Web Application

A full-stack food ordering application built entirely with Next.js, using API routes as the backend.This app implements:

✅ Role-Based Access Control (RBAC)

🌍 Region-Based Data Restrictions

🚀 Features

🔍 View Restaurants & Menus — (Admin, Manager, Team Member)

🛒 Create Orders — (Admin, Manager, Team Member)

💳 Checkout & Pay — (Admin, Manager)

❌ Cancel Orders — (Admin, Manager)

🧾 Update Payment Method — (Admin only)

🌐 Region-Based Data Access — (Managers & Team Members limited to their assigned country)

⚙️ Environment Variables

Create a file named .env.local in the root directory (where package.json is located) and add the following:

# MongoDB Atlas connection string
MONGODB_URI=your-mongodb-uri

# Make any user ADMIN via database directly

# NextAuth.js secrets
NEXTAUTH_SECRET=a1b2c3...your-secret
NEXTAUTH_URL=http://localhost:3000

# JWT secrets (if using custom logic)
JWT_SECRET=a1b2c3...your-jwt-secret
JWT_REFRESH_SECRET=a1b2c3...your-jwt-refresh-secret

📌 Note: .env.local is automatically loaded in development, and .env.production is used in production.

📅 Installation & Setup

# Clone the repository
git clone https://github.com/rishi-prajapati/slooze_fullstack.git
cd slooze_fullstack

# Install dependencies
npm install

✅ Make sure your MongoDB Atlas cluster is accessible and your credentials are correctly set in .env.local.

🚗 Running the Application

npm run dev

➡️ App will be running on: http://localhost:3000➡️ API routes are exposed under: /api/*

🔐 Authentication & Authorization

NextAuth.js for session management

Custom JWT logic for securing APIs

Roles:

👑 Admin

🧑‍💼 Manager

👨‍🍳 Team Member

Middleware enforces:

✅ RBAC (Role-Based Access Control)

🌍 Region Filtering (e.g., India vs. America)

📚 API Endpoints

Method

Endpoint

Access Roles

Description

GET

/api/restaurants

All Roles

List restaurants (region-filtered)

GET

/api/restaurants/:id/menu

All Roles

Get menu items for a restaurant

POST

/api/orders

All Roles

Create a new order

POST

/api/orders/:id/checkout

Admin, Manager

Checkout and pay for an order

PATCH

/api/orders/:id/cancel

Admin, Manager

Cancel an existing order

PATCH

/api/users/:id/payment

Admin

Update payment method for a user

POST

/api/auth/login

Public

User login (returns session)

POST

/api/auth/logout

Authenticated Users

User logout

🌐 Demo & Deployment

🔗 Live Demo: https://your-app-demo.vercel.app

🎥 Demo Video: https://youtu.be/your-demo-video

🛠 Deploying to Vercel

Push your code to GitHub/GitLab

Import the project in Vercel

Add environment variables in Vercel Settings

Click Deploy

🧪 Postman collection is available in the repository for API testing. Simply import it into Postman.

🤝 Contributing

Fork the repo

Create a feature branch

git checkout -b feature/your-feature

Commit your changes

git commit -m "feat: add your feature"

Push to your branch

git push origin feature/your-feature

Open a Pull Request

For major changes, please open an issue first to discuss.

📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

