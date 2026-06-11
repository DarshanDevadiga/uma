# Udupi Management Association (UMA) Full-Stack Web Application

A premium, production-ready full-stack website designed with a modern, dark luxury, glassmorphic layout inspired by leading portals (Apple, Stripe, Tesla, Linear, Vercel).

---

## Technical Stack Overview

* **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, GSAP, Recharts, React Three Fiber (Three.js), Lucide Icons, Axios.
* **Backend**: Node.js, Express.js (MVC architecture), JWT stateless authentication, Multer file upload handlers, Nodemailer email client, MySQL connection pool.
* **Database**: MySQL (compatible with local XAMPP/WAMP servers).
* **Package Manager**: `pnpm`.

---

## Folder Structure

```
uma/
├── backend/
│   ├── config/          # DB connection pool (db.js), Mail transporter (mailer.js)
│   ├── controllers/     # MVC Business Logic (auth, memberships, events, awards, bearers, committees, dashboard, etc.)
│   ├── middleware/      # JWT verifying guards (authMiddleware.js), Multer uploads (uploadMiddleware.js)
│   ├── routes/          # Express API route maps
│   ├── uploads/         # Segmented subdirectories for file uploads
│   ├── schema.sql       # SQL database initialization structures
│   ├── setup-db.js      # Automated MySQL setup and admin hashing script
│   ├── package.json
│   └── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── assets/      # Global styles, static graphics
│   │   ├── components/  # 3D Globe, Particle bg, Lightbox, Navbar, Footer, GlassCard
│   │   ├── context/     # Auth state context
│   │   ├── layouts/     # Main public layout, Admin panel dashboard layout
│   │   ├── pages/       # Public pages (Home, About, Bearers, Committees, Activities, etc.) & Admin dashboard/modules
│   │   ├── services/    # Axios client helper
│   │   ├── App.jsx      # Global Router and switch panels
│   │   └── index.css    # Tailwind base styles, scrollbars, and custom card glow classes
│   ├── package.json
│   └── vite.config.js
└── README.md            # Setup guidelines
```

---

## Installation & Setup Guide

Ensure you have **Node.js** (v18+) and **pnpm** installed on your system.

### Step 1: XAMPP MySQL Setup
1. Launch the **XAMPP Control Panel**.
2. Click **Start** next to the **MySQL** service (by default, it runs on port `3306`).
3. Make sure the database credentials match your `backend/.env` file. (By default, XAMPP uses host `localhost`, user `root`, and a blank password).

### Step 2: Configure Environment Variables
Locate the `backend/.env` file and review the details:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=uma_db

JWT_SECRET=uma_super_secure_dark_luxury_jwt_secret_key_2026_uma
JWT_EXPIRES_IN=7d

# SMTP Settings for nodemail (Nodemailer logs locally to console if default remains)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=no-reply@udupimanagement.org
```

### Step 3: Run Database Initializer
In your command terminal, navigate to the `backend/` directory and execute the automated setup script. This script connects to MySQL, creates `uma_db`, builds all tables and seed data, and dynamically hashes the password for the admin user:
```bash
cd backend
node setup-db.js
```
* **Default Admin Credentials**:
  * Username: `Admin`
  * Password: `UMAAdmin@26`

### Step 4: Run the Backend API Server
Start the development server using:
```bash
pnpm run dev
```
The backend will boot up at `http://localhost:5000`.

### Step 5: Start the Frontend React App
Open a separate terminal window, navigate to the `frontend/` directory, and start the Vite development server:
```bash
cd frontend
pnpm run dev
```
The React app will boot up at `http://localhost:5173` (or the next available port). Open this URL in your browser to view the application!

---

## Validation & Admin Capabilities

1. **Public View**: Access the Homepage containing the rotating 3D globe and interactive particles. Navigate through directory councils, activities timelines, and public application portals.
2. **Forms Submission**: Fill out the **Membership Registration** or **Award Nomination** forms (including uploading a test PDF file). The backend will automatically upload the asset into `backend/uploads/` and save records in MySQL.
3. **Admin Panel**: Navigate to `/admin/login`, log in with username `Admin` and password `UMAAdmin@26`, and explore:
   - High-fidelity Recharts dashboards visualizing monthly application volumes.
   - Core CRUD controllers to approve membership requests, edit events, sort office bearers, and review contact messages.
