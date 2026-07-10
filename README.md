# IUT Student Communication Portal (CampusConnect)

Welcome to the **IUT Student Communication Portal**, a comprehensive platform specifically designed to streamline and enhance communication among the students, faculties, and administration of the Islamic University of Technology (IUT). 

This system serves as a centralized hub for all university-related communications, ensuring that important announcements, academic discussions, and social interactions within the campus community are organized, accessible, and secure.

## 🚀 Key Features

### 📢 Centralized Announcements
- **Official Broadcasts**: Dedicated spaces for university administration and departments to post official notices, event schedules, and academic updates.
- **Push Notifications**: Real-time alerts for urgent announcements and upcoming deadlines to ensure no student misses out on critical information.

### 💬 Interactive Student Forums & Discussions
- **Departmental Groups**: Isolated channels for specific departments (e.g., CSE, EEE, MCE) to discuss coursework, projects, and departmental news.
- **Club & Society Hubs**: Dedicated sections for IUT's diverse clubs (e.g., IUTCS, IUTDS) to manage their internal communications, coordinate events, and recruit members.
- **Q&A Sections**: Peer-to-peer help forums where students can ask questions related to academics or campus life and receive answers from seniors and alumni.

### 🔒 Secure & Verified Access
- **IUT Exclusive**: Strictly enforced authentication requiring valid IUT credentials, ensuring the platform remains a safe, closed network for current students and staff.
- **Role-Based Access Control (RBAC)**: Distinct privileges for Administrators, Faculty, Club Presidents, and general Students to manage content appropriately.

### 👥 User Profiles & Networking
- **Academic Profiles**: Customizable student profiles displaying department, batch, and academic interests, making it easier to connect with like-minded peers.
- **Direct Messaging (DM)**: Secure one-on-one or group messaging for private collaborations and project discussions.

## 🛠️ Tech Stack

### Frontend (Client)
The user interface is built for speed and responsiveness, utilizing modern web technologies:
- **Framework**: [React.js](https://react.dev/) (Bootstrapped with [Vite](https://vitejs.dev/))
- **Styling**: [TailwindCSS](https://tailwindcss.com/) for a sleek, responsive, and maintainable design.
- **Routing**: [React Router DOM](https://reactrouter.com/) for seamless single-page navigation.
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: Axios

### Backend (Server)
A robust and scalable backend architecture designed to handle high concurrency:
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: Dual database strategy using **MongoDB (Mongoose)** for flexible document storage (e.g., chat logs, forum posts) and **MySQL (mysql2)** for structured relational data (e.g., user credentials, roles).
- **Authentication**: Secure token-based authentication using **JSON Web Tokens (JWT)** and password hashing via **bcrypt**.

## 📂 Project Structure

```text
├── Backend/                # Node.js/Express server, API routes, controllers, and models
├── Client-2 - Copy/        # React frontend application (Vite)
└── README.md               # Project documentation
```

## ⚙️ Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MySQL](https://www.mysql.com/) Server running locally or remotely
- [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)

### Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory with your environment configurations:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=iut_comm_db
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5000`.*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd "Client-2 - Copy"
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be available at the URL provided in the terminal (usually `http://localhost:5173`).*

## 🤝 Contributing
Contributions are welcome! If you are an IUT student or alumni and wish to improve this platform:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📜 License
This project is licensed under the ISC License.
