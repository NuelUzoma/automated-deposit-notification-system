import axios from 'axios';
import logger from '../logging/logger.js';


async function loginUser(req) {
    try {
      const authResponse = await axios.post('http://localhost:3000/api/auth/login', {
        email: "emmanuelmadubuike.dev@gmail.com",
        password: "Test100$"
      }, {
        withCredentials: true
      });
      const userId = authResponse.data.userId;
      req.session.userId = userId; // Store userId in session
      return userId;
    } catch (error) {
      console.error('Error logging in user:', error);
      return null;
    }
}

export const triggerAutomatedDeposit = async (req, res) => {
    try {
        const userId = req.session?.userId; // Retrieve userId from session

        if (!userId) {
            console.warn('User not logged in. Attempting login...');
            userId = await loginUser(); // Try to login if not already logged in
        }

        if (userId) {
            const response = await axios.put(`http://localhost:3000/api/wallets/deposit/:walletId`, {
            userId,
            walletId: 2,
            amount: 100,
            notificationType: 'email'
        }, {
            withCredentials: true
        });
        
        console.log('Automated deposit response:', response.data);
        
        } else {
            console.warn('Failed to retrieve or login user for automated deposit.');
        }
    } catch (error) {
        console.error('Error triggering automated deposit:', error);
    }
};

// Set the interval to run the function every 3 minutes
const THREE_MINUTES = 3 * 60 * 1000;
const now = new Date();
const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 14
, 0, 0);
if (startTime <= now) {
    startTime.setDate(startTime.getDate() + 1);
}
const initialDelay = startTime - now;

setTimeout(async () => {
    // Initial call
    await axios.post('http://localhost:3000/api/wallets/trigger-deposit');

    // Subsequent calls every 3 minutes
    setInterval(async () => {
        await axios.post('http://localhost:3000/api/wallets/trigger-deposit')
    }, THREE_MINUTES);
}, initialDelay);

logger.info('Automated deposit scheduled.');
