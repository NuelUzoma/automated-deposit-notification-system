import dotenv from 'dotenv';

dotenv.config();

// MySQL Configurations

const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialet: "mysql",
}


export default mysqlConfig;