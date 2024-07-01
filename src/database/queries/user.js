import { Users } from '../db.connect.js';


// creates new user to database
export async function createUser(userData) {
    try {
        let { username, email, mobileNumber, password } = userData;

        if (email) email = email.toLowerCase();
        
        // create a new user
        const newUser = await Users.create(userData);
        return newUser;
    } catch(err) {
        throw err;
    }
}

// Find a user from db either by username or email
export async function findUser(userData) {
    try {
        const user = await Users.findOne({
            where: userData,
            attributes: { exclude: ['password'] }
        });
        return user;
    } catch(err) {
        throw err;
    }
}