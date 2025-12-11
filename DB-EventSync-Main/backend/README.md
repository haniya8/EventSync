# Backend

This is the backend for the project. It is built with Node.js and Express and connects to an OracleDB database. This guide provides instructions on how to set up and run the backend application locally.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **OracleDB**: Ensure you have an OracleDB instance running and accessible.

## Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/ShehzadAslamOza/lab7-dbms-app.git
cd https://github.com/ShehzadAslamOza/lab7-dbms-app.git/backend
```

### 2. Install Dependencies

Navigate to the `backend` directory and install the required npm packages:

```bash
npm install
```

### 3. Create and Configure the `.env` File

1. **Create the `.env` File**:

   In the `backend` directory, create a new file named `.env`.

2. **Copy Contents from `.env.example`**:

   If a `.env.example` file is provided in the `backend` directory, copy its contents into the newly created `.env` file. This file serves as a template for the environment variables.

   ```bash
   cp .env.example .env
   ```

3. **Update `.env` File**:

   Open the `.env` file and replace the placeholder values with your actual configuration settings:

   ```dotenv
   DB_USER="c##user"
   DB_PASSWORD="password"
   DB_CONNECTION_STRING="localhost:1521/orcl"
   JWT_SECRET="secret"
   PORT="3000"
   ```

   - **`DB_USER`**: The username to connect to the OracleDB.
   - **`DB_PASSWORD`**: The password for the OracleDB user.
   - **`JWT_SECRET`**: A secret key used for signing JWT tokens.
   - **`DB_CONNECTION_STRING`**: The connection string for the OracleDB.
   - **`PORT`**: The port on which the backend server will run.

### 4. Run the Backend Server

With the dependencies installed and the `.env` file configured, you can start the backend server using:

```bash
npm start
```

The server will start on the port specified in the `.env` file (default is 5000). You should see output indicating the server is running.

### 5. Test the API Endpoints

You can test the API endpoints using tools like Postman or cURL. To see all available endpoints:

1. **Open Postman**.
2. **Import the Collection**:

   - Click on the **Import** button in Postman.
   - Select **File** and choose the collection file from the `backend/postman` directory.

   This will import the API collection into Postman, allowing you to view and test all the endpoints.

The backend will be accessible at `http://localhost:5000` (or the port specified in your `.env` file).

## Troubleshooting

- **Database Connection Issues**: Verify that the OracleDB is running and accessible from your machine. Check the database credentials in the `.env` file.
- **Missing `.env` File**: Ensure the `.env` file is present in the `backend` directory and properly configured.
