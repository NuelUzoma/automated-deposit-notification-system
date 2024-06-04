# Automated Deposit Notification System

This project implements an automated deposit notification system. It verifies user authentication and performs automated deposit operations at regular intervals, sending email or mobile notifications upon failed transactions due to insufficient funds in their wallet balance.

## Table of Contents

- [Installation](#installation)
- [Packages Used](#packages-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Scheduling Automated Deposits](#scheduling-automated-deposits)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (>=14.0.0)
- npm (>=6.0.0)
- MySQL

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/automated-deposit-notification-system.git
    cd automated-deposit-notification-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables. Create a `.env` file in the root directory of the project and add the following:
    ```bash
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    SESSION_SECRET=your_session_secret
    MAIL_USER=your_email_address
    MAIL_PASSWORD=your_email_password
    MAIL_PORT=your_mail_port
    MAIL_HOST=your_mail_host
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_NUMBER=your_twilio_number
    ```

4. Run database migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```

## Packages Used

The project uses the following npm packages:

- `axios`: For making HTTP requests.

- `bcryptjs`: For hashing passwords.

- `connect-session-sequelize`: For storing sessions in a Sequelize compatible database.

- `cross-env`: For setting environment variables across platforms.

- `dotenv`: For loading environment variables from a `.env` file.

- `express`: For creating the server and handling routes.


- `express-session`: For managing user sessions.

- `helmet`: For setting various HTTP headers for security.

- `morgan`: For HTTP request logging.

- `mysql2`: For connecting to a MySQL database.

- `nodemailer`: For sending emails.

- `nodemon`: For automatically restarting the server during development.

- `passport`: For user authentication.

- `passport-local`: For local authentication strategy.

- `sequelize-cli`: For database migrations and management.

- `twilio`: For sending SMS notifications.

- `winston`: For logging.

## Getting Started

### Project Structure

automated-deposit-notification-system/

├── src/

| ├── authentication/

| | └── auth.js

│ ├── config/

│ │ └── mysql.config.js

│ ├── controllers/

| | └── autoDeposit.controller.js

│ │ └── user.controller.js

| | └── wallet.controller.js

│ ├── database/

│ |   ├── queries/

| |     └── user.js

| |     └── wallet.js

│ │ └── db.connect.js

│ ├── logging/

│ │ └── logger.js

│ ├── middlewares/

│ │ └── errorHandler.middleware.js

| | └── morgan.middleware.js

│ ├── models/

| | └── profile.model.js

│ │ └── user.model.js

| | └── wallet.model.js

│ ├── routes/

│ │ └── user.route.js

| | └── wallet.route.js

│ ├── services/

│ │ └── scheduleDeposits.service.js

│ └── index.js

├── .env

├── package.json

└── README.md

### Configuration

Ensure your `.env` file is correctly set up with your database and third-party service credentials.

### Running the Application

1. Start the application in development mode:
    ```bash
    npm run dev
    ```

2. The server should be running on `http://localhost:3000`.

### Scheduling Automated Deposits

The project uses an HTTP Endpoint Trigger to schedule automated deposit tasks.

1. The Deposit Trigger is defined in `src/services/scheduleDeposits.service.js`.
2. It is scheduled to run every 3 minutes. Adjust the schedule as needed by switching the snippet below:
    ```javascript
    // Set the interval to run the function every 3 minutes
    const THREE_MINUTES = 3 * 60 * 1000;
    ```

### Database Models

### User

| field            | data_type     | constraints      |
| ---------        | ------------- | ---------------- |
| id               | integer       | required         |
| username         | string        | required, unique |
| email            | string        | required, unique |
| mobileNumber     | string        | required         |
| password         | string        | required, unique |

### Wallet

| field            | data_type     | constraints      |
| ---------        | ------------- | ---------------- |
| id               | integer       | required         |
| userId           | integer       | required, unique |
| balance          | float         | defaultValue     |
| transactionHistory| json         | defaultValue     |

### API Endpoints

### Base URL

- http://localhost:3000/api

### Creating a user

- Route: /auth/signup
- Method: POST

:point_down: To implement

- Creates a new user with username, email mobile number and password.

:point_down: Body

```json
{
  "username": "Test",
  "email": "emma@gmail.com",
  "mobileNumber": "+2349012345678",
  "password": "Test100$"
}
```

:point_down: Response

```json
{
  "success": true,
  "message": "user successfully created"
}
```

### Login user

- Route: /auth/login
- Method: POST

:point_down: Body

```json
{
  "email": "emma@gmail.com",
  "password": "Test100$"
}
```

:point_down: Response

```json
{
  "userId": 5,
  "success": true,
  "message": "Logged in Successfully"
}
```

### Get User
Retrieves the information of the logged in user

- Route: auth/getUser
- Method: GET

- Url: /api/auth/user

:point_down: Response
```json
{
  "user": {
    "id": 5,
    "username": "Test",
    "email": "emma@gmail.com",
    "mobileNumber": "+2349012345678",
    "createdAt": "2024-06-04T09:46:54.000Z",
    "updatedAt": "2024-06-04T09:46:54.000Z"
  }
}
```

### Find User
Finds a user with either the username or email or both specified in the request body.

- Route: auth/user/find
- Method: POST

- Url: /api/auth/user/find

:point_down: Body
```json
{
  "username": "Test"
}
```

:point_down: Response
```json
{
  "id": 5,
  "username": "Test",
  "email": "emma@gmail.com",
  "mobileNumber": "+2349012345678",
  "createdAt": "2024-06-04T09:46:54.000Z",
  "updatedAt": "2024-06-04T09:46:54.000Z"
}
```

### Create Wallet
Creates a new wallet for a user

- Route: wallets/create
- Method: POST

- Url: /api/wallets/create

:point_down: Response
```json
{
  "wallet": {
    "balance": 0,
    "transactionHistory": [],
    "id": 8,
    "userId": 5,
    "updatedAt": "2024-06-04T09:50:47.339Z",
    "createdAt": "2024-06-04T09:50:47.339Z"
  },
  "message": "Wallet created successfully"
}
```

### Wallet Deposit
Deposits an amount from a user's wallets to another user wallet. If balance threshold is enough, deposit is successful, if not, it sends a notification to the user initiating the deposit of a failed transaction due to insufficient funds.

- Route: wallets/deposit/:walletId
- Method: PUT

- Url: /api/wallets/deposit/2

#### Successful Deposit

:point_down: Body
```json
{
  "amount": 0,
  "notificationType": "email"
}
```

:point_down: Response
```json
{
  "message": "Amount Deposit Successful"
}
```

#### Unsuccessful Deposit

:point_down: Body
```json
{
  "amount": 10,
  "notificationType": "email"
}
```

:point_down: Response
```json
{
  "error": "Insufficient Funds"
}
```
A notification is then sent, either by email or mobile (specified by user) to the user.

### Automated Wallet Deposit
Automates the deposit of an amount from a user's wallets to another user wallet, with interval to be manually preset. If balance threshold is enough, deposit is successful, if not, it sends a notification to the user initiating the deposit of a failed transaction due to insufficient funds.

- Route: wallets/trigger-deposit
- Method: POST

- Url: /api/wallets/trigger-deposit

#### Successful Deposit

:point_down: Body
```json
{
  "amount": 0,
  "notificationType": "email"
}
```

:point_down: Response
```json
{
  "message": "Amount Deposit Successful"
}
```

#### Unsuccessful Deposit

:point_down: Body
```json
{
  "amount": 10,
  "notificationType": "email"
}
```

:point_down: Response
```json
{
  "error": "Insufficient Funds"
}
```
A notification is then sent, either by email or mobile (specified by user) to the user.