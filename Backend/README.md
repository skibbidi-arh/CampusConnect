# Express + Prisma API

A simple REST API built with Express.js and Prisma ORM using pure JavaScript (no TypeScript).

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Database
Update the `.env` file with your database connection URL:
\`\`\`
DATABASE_URL="postgresql://user:password@localhost:5432/express_prisma_db"
\`\`\`

### 3. Set Up Prisma
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

### 4. Run the Server
\`\`\`bash
npm run dev
\`\`\`

The server will run on `http://localhost:3000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Project Structure
\`\`\`
src/
├── config/
│   └── prisma.js        # Prisma client configuration
├── controllers/
│   ├── userController.js
│   └── postController.js
├── routes/
│   ├── index.js
│   ├── userRoutes.js
│   └── postRoutes.js
├── middleware/
│   └── errorHandler.js
└── utils/
    └── logger.js
prisma/
└── schema.prisma        # Prisma schema definition
server.js              # Express server entry point
.env                   # Environment variables
\`\`\`

## Commands
- `npm run dev` - Run development server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
