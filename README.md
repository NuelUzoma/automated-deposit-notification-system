# Automated Deposit Notification System

This project implements an automated deposit notification system. It verifies user authentication and performs automated deposit operations at regular intervals, sending notifications upon failed transactions.

## Table of Contents

- [Installation](#installation)
- [Packages Used](#packages-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Scheduling Automated Deposits](#scheduling-automated-deposits)
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

