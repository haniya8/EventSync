# HR Management System – Database Systems Teaching App

This project is a **full-stack HR Management System** designed as teaching material for a database systems course. It demonstrates how a web application interacts with a relational database (OracleDB) using a Node.js backend and a React frontend.

---

## Acknowledgement

This project is from the following repository: [https://github.com/ShehzadAslamOza/lab7-dbms-app/tree/main](https://github.com/ShehzadAslamOza/lab7-dbms-app/tree/main)

---

## Project Structure

```
DB-HRApp-Main/
│
├── backend/      # Node.js/Express API server (connects to OracleDB)
├── frontend/     # React web application (user interface)
├── db-init.sql   # SQL script for database setup and sample queries
└── README.md     # Project documentation
```

### Folder Responsibilities

- **backend/**  
  Contains the Node.js/Express server, which exposes RESTful APIs for managing employees, departments, jobs, locations, and authentication.  
  - `models/` – Database access logic for each entity (employees, departments, etc.)
  - `controllers/` – Business logic for handling API requests
  - `routes/` – API endpoint definitions
  - `config/` – Database connection configuration
  - `middlewares/` – Middleware (e.g., authentication)
  - `postman/` – Postman collection for API testing

- **frontend/**  
  Contains the React application, which provides the user interface for HR management.  
  - `src/components/` – React components for login, dashboard, employees, departments, etc.



---

## Prerequisites

- **Node.js** (v14+ recommended)
- **npm** (comes with Node.js)
- **OracleDB** (local or remote instance)
- **OracleDB Node.js driver** (installed via npm)
- **(Optional) Oracle SQL Developer** for running SQL scripts

---

## Setup & Running the Application

### 1. Clone the Repository

```sh
git clone https://github.com/DeebajHaider/DB-HRApp-Main.git
cd DB-HRApp-Main
```

### 2. Configure Backend Environment

- Go to the `backend/` folder.
- Change the .env.example file into a `.env` file with your OracleDB credentials:

  ```
  DB_USER=your_db_username
  DB_PASSWORD=your_db_password
  DB_CONNECT_STRING=your_db_connect_string
  ```

### 3. Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd ../frontend
npm install
```

### 4. Run the Application

#### Start the Backend Server

```sh
cd backend
npm run start
```

#### Start the Frontend App

```sh
cd ../frontend
npm start
```

- The frontend will typically run at [http://localhost:3000](http://localhost:3000)
- The backend API will run at [http://localhost:3001](http://localhost:3001)

---

## Features

- **Employee Management:** View, add, edit, and delete employees.
- **Department Management:** View, add, and edit departments.
- **Job & Location Listings:** View available jobs and locations.
- **Authentication:** Simple login system (expandable for real-world use).
- **OracleDB Integration:** All data is stored and managed in OracleDB.

---

## Educational Value

- Demonstrates full-stack CRUD operations.
- Shows how to connect a Node.js server to OracleDB.
- Illustrates RESTful API design and consumption from a React frontend.
- Provides practical SQL examples for database manipulation.

---

## Notes

- This app is intended for educational purposes and may use simplified authentication and error handling.
- For production use, always secure credentials and follow best practices for security and validation.

---

## License

This project is for educational use in database systems courses.