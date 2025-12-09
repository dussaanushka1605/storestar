📌 Store Spotlight – Full Stack Rating Platform
A role-based web application for managing stores, users, and ratings.

🚀 Overview

Store Spotlight is a full-stack web application that allows users to sign up, browse stores, and submit ratings (1–5).
The platform implements role-based access for Admins, Normal Users, and Store Owners.

Built using:
Frontend: React + TypeScript + Tailwind + Context API
Backend: Express + Prisma ORM
Database: SQLite (for local development)
Auth: JWT-based authentication with role validation

🎯 Features
🔐 Authentication
User Signup (Normal User)
Login for all roles
JWT Token stored in localStorage
Password update support for all users

🧑‍💼 User Roles & Functionalities
1. System Administrator
Add new stores, users, and admin users
Dashboard includes:
Total Users
Total Stores
Total Ratings
Manage all users:
View, filter, and sort by Name, Email, Address, Role
Manage stores:
View & filter list of stores with rating
View complete details of any user
Logout

2. Normal User
Sign up & login
View all store
Search by Name or Address
Submit ratings (1–5)
Edit submitted rating
View:
Store Name
Address
Overall Rating
Their own rating
Logout

3. Store Owner
Login
Update password
Dashboard includes:
List of users who rated their store
Average rating of their store

🗂 Database
Built using Prisma ORM + SQLite
This allows zero-setup development on Windows.
Prisma models include:
User
Store
Rating
dev.db contains all local database data.

🛠 Tech Stack
Frontend
React
TypeScript
TailwindCSS
Context API (AuthContext, DataContext)
Axios for API calls
Backend
Node.js + Express
Prisma ORM
JWT authentication
Zod-based validation
Database
SQLite (file:./dev.db)
Fully compatible with PostgreSQL if needed

🔌 API Endpoints
Auth
Method	Endpoint	Description
POST	/auth/signup	Register normal user
POST	/auth/login	Login for all users
User
Method	Endpoint	Description
PATCH	/users/:id/password	Update password
Admin
Method	Endpoint	Description
GET	/admin/users	List all users
POST	/admin/users	Add user
GET	/admin/stores	List stores
POST	/admin/stores	Add store
Store & Ratings
Method	Endpoint	Description
GET	/stores	List all stores
POST	/stores/:id/ratings	Submit rating
GET	/owner/stores	Owner dashboard
📦 Project Structure
storestar/
│── prisma/
│   ├── schema.prisma     # Database schema
│── server/
│   ├── src/
│   │   ├── auth.ts       # JWT helpers
│   │   ├── validators.ts # Validation logic
│   │   ├── index.ts      # Backend entry
│── src/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   ├── components/
│   ├── pages/
│── dev.db                # SQLite database
│── .env                  # Environment variables
│── README.md

▶️ How to Run Locally
1. Install dependencies
npm install

2. Setup environment
Create .env:

DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret"

3. Generate Prisma client
npm run prisma:generate

4. Run migrations
npm run prisma:migrate -- --name init

5. Start backend
npm run server:dev

Backend runs at: http://localhost:4000
6. Start frontend
npm run dev

🧪 Testing
Sign up as Normal User
Login and submit ratings
Login as Admin and manage users/stores
Login as Owner to view ratings for their store

📌 Deployment Notes
If PostgreSQL is required:
change datasource in prisma/schema.prisma
update .env
run new migration

🏁 Conclusion

Store Spotlight is a fully functioning full-stack application featuring:
Role-based access
Rating system
Admin dashboard
Store owner insights
Secure authentication
Real backend + real database
Ready for evaluation and deployment.
