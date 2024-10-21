# crud-api
This is Node.js application implementing a basic CRUD API for managing users.

**Features:**
- **CRUD Operations and endpoints:**
    - **GET /api/users:** Get all users.
    - **GET /api/users/{userId}:** Find a specific user by ID.
    - **POST /api/users:** Creates a new user.
    - **PUT /api/users/:userId:** Updates an existing user.
    - **DELETE /api/users/:userId:** Deletes a user.
- **User Model:**
    - `id` (UUID, generated on server).
    - `username` (string, required).
    - `age` (number, required).
    - `hobbies` (array of strings, required).

**Installation:**
1. Clone this repository:
   ```
   git clone https://github.com/Takayuki-sempai/crud-api.git
2. Open the project directory:
   ```
   cd crud-api
3. Checkout development branch:
   ```
   git checkout develop
4. Install dependencies:
   ```
   npm install

**Environment Variables:**
- The application reads the port number from a .env file.
- Create a .env file in the project root directory with the following content:
  ```
  PORT=3000  # Replace with your desired port number
   
**Running the Application:**
1. Development Mode (Recommended for Development)
    - Starts the application with automatic code reloading on changes using nodemon
   ```
   npm run start:dev
2. Production Mode (For Deployment)
    - Compiles the TypeScript code into JavaScript and runs the bundled application. This is recommended for deployment to production environments.
   ```
   npm run start:prod

**Using the Application:**
- Use Postman or a similar application to send requests to the listed endpoints.
