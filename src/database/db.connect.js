import { Sequelize } from 'sequelize';
import mysqlConfig from '../config/mysql.config.js';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import logger from '../logging/logger.js';

import User from '../models/user.model.js';

// Sequelize configuration
const sequelize = new Sequelize(
    mysqlConfig.database,
    mysqlConfig.user,
    mysqlConfig.password,
    {
        host: mysqlConfig.host,
        dialect: mysqlConfig.dialet
    }
);

// Define the session store
const SequelizeStore = connectSessionSequelize(session.Store);

// Session to be stored in the database
const sessionStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
    expiration: 24 * 60 * 60 * 1000, // 24 hours
});

sessionStore.sync();

// Authenticate sequelize connection
sequelize.authenticate()
    .then(() => {
        logger.info('Connection to the database is successful');
    }).catch(err => {
        logger.info('Unable to connect to the database:', err);
    }
);

// Create a db object for database models
const db = {}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add models
db.users = User(sequelize);

export const Users = db.users;


// sync all models
// force: false will not drop the table if it already exists
db.sequelize.sync({ force: false })
    .then(async () => {
        logger.info('Database & tables synced');
    }).catch(err => {
        logger.info('Unable to sync database & tables:', err);
    }
);


export {
    db,
    sessionStore
};