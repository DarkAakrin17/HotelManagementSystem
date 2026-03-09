# LuxeStay - Room Booking Management System

A full-stack Room Booking Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This application provides a complete solution for browsing available rooms, booking stays, user authentication, and an admin dashboard for managing the hotel's inventory and reservations.

## 🌟 Features

### For Guests
*   **User Authentication:** Secure email/password registration and login using JWT (JSON Web Tokens).
*   **Browse Rooms:** View a list of available rooms with details including price, capacity, and amenities.
*   **Filter Rooms:** Easily filter rooms by type (Single, Double, Suite).
*   **Room Details:** Dedicated page for each room showing high-quality images and comprehensive descriptions.
*   **Date Selection & Booking:** Integrated date picker to select check-in and check-out dates, automatically calculating the total price before booking.
*   **My Bookings:** A personal dashboard to view all past and upcoming confirmed bookings, with the ability to cancel them.
*   **Responsive UI:** A premium, modern dark-themed interface with glassmorphism effects that looks great on all devices.

### For Administrators
*   **Role-based Access:** Specialized routes and UI elements accessible only to users with the 'admin' role.
*   **Admin Dashboard:** A centralized portal for hotel management.
*   **Manage Rooms (CRUD):** 
    *   **Create:** Add new rooms to the inventory with images, pricing, and amenities.
    *   **Read:** View all rooms in a tabular format.
    *   **Update:** Edit details of existing rooms.
    *   **Delete:** Remove rooms from the system.
*   **View All Bookings:** See a comprehensive list of all bookings made by any user across the system to manage occupancy.

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **React 18:** Functional components and hooks.
*   **Vite:** Blazing fast modern frontend build tool.
*   **React Router v6:** For single-page application navigation and protected routing.
*   **Context API:** For global state management (Authentication state).
*   **Axios:** HTTP client for communicating with the backend API.
*   **Vanilla CSS:** Custom styling utilizing CSS variables, Flexbox, CSS Grid, and modern design principles.
*   **react-datepicker:** For clean, intuitive date selection.
*   **react-hot-toast:** For elegant, non-blocking notification popups.
*   **react-icons:** For scalable vector icons.

### Backend (Server)
*   **Node.js & Express.js:** Fast and minimalist web framework for building the RESTful API.
*   **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM) library for flexible data storage.
*   **JSON Web Tokens (JWT):** For stateless, secure user authentication.
*   **bcryptjs:** For securely hashing user passwords before saving them directly to the database.
*   **CORS:** Cross-Origin Resource Sharing middleware to allow frontend requests.
*   **dotenv:** For managing environment variables securely.

---

## 📂 Project Structure

The project is organized into a monorepo-style structure with separate `client` and `server` directories.

```text
RoomManagement/
├── client/                     # Frontend React Application
│   ├── index.html              # Entry HTML file
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration (includes API proxy)
│   └── src/
│       ├── assets/             # Static assets like images
│       ├── components/         # Reusable UI components (Navbar, ProtectedRoute)
│       ├── context/            # React Context (AuthContext for global user state)
│       ├── pages/              # Main view components (Home, Login, RoomDetail, etc.)
│       ├── services/           # External service integration (api.js for Axios setup)
│       ├── index.css           # Global CSS variables and base styles
│       ├── App.jsx             # Root component handling Routes
│       └── main.jsx            # React rendering entry point
│
└── server/                     # Backend Express Application
    ├── package.json            # Backend dependencies
    ├── server.js               # Main entry point for the Express server
    ├── seed.js                 # Database seeding script for initial data
    ├── config/
    │   └── db.js               # MongoDB connection logic
    ├── middleware/
    │   └── auth.js             # JWT verification and Admin-only role guards
    ├── models/                 # Mongoose Data Schemas
    │   ├── Booking.js          
    │   ├── Room.js             
    │   └── User.js             
    └── routes/                 # Express API Route controllers
        ├── auth.js             # /api/auth routes
        ├── bookings.js         # /api/bookings routes
        └── rooms.js            # /api/rooms routes
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20+ recommended for Vite)
*   [MongoDB](https://www.mongodb.com/) (Atlas cluster or local installation)

### 1. Installation

Clone the repository or navigate to the project directory:
```bash
cd RoomManagement
```

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../client
nvm use 20  # Make sure you are using Node 20+
npm install
```

### 2. Environment Variables

In the `server/` directory, create a `.env` file or use the existing one and ensure it has the following variables:

```env
# server/.env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
*(Note: Port 5001 is used to avoid conflicts with macOS's default AirPlay Receiver on port 5000).*

### 3. Initialize Database (Optional but Recommended)

You can seed the database with an initial Admin user and some sample rooms to get started quickly.
From the `server/` directory, run:
```bash
node seed.js
```
*This will create an admin account with Email: `admin@example.com` and Password: `password123`.*

### 4. Running the Application

You need to run both the backend server and the frontend development server simultaneously.

**Start the Backend (Terminal 1):**
```bash
cd server
npm start
```

**Start the Frontend (Terminal 2):**
```bash
cd client
nvm use 20
npm run dev
```

The application will be available at **`http://localhost:5173`**. The Vite development server automatically proxies API requests (e.g., `/api/rooms`) to the backend running on `http://localhost:5001`.

---

## 📝 API Endpoints Overview

### Auth (`/api/auth`)
*   `POST /register` - Register a new user.
*   `POST /login` - Authenticate user and return JWT.
*   `GET /me` - Get current logged-in user details (requires token).

### Rooms (`/api/rooms`)
*   `GET /` - Get all rooms (supports `?type=` query filter).
*   `GET /:id` - Get a single room by ID.
*   `POST /` - Create a new room (requires token, **Admin only**).
*   `PUT /:id` - Update a room (requires token, **Admin only**).
*   `DELETE /:id` - Delete a room (requires token, **Admin only**).

### Bookings (`/api/bookings`)
*   `POST /` - Create a new booking for a room (requires token).
*   `GET /my-bookings` - Get all bookings for the logged-in user (requires token).
*   `GET /` - Get all bookings in the system (requires token, **Admin only**).
*   `DELETE /:id` - Cancel/Delete a booking (requires token).
