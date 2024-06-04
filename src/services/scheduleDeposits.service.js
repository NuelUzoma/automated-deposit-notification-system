import axios from 'axios';
import logger from '../logging/logger.js';


export const triggerAutomatedDeposit = async (req, res) => {
    try {
        const authResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: "emmanuelmadubuike.dev@gmail.com",
            password: "Test100$"
        }, {
            withCredentials: true
        });
        console.log(authResponse);
        const userId = authResponse.data.userId;
        console.log('User ID: ', userId);

        // const walletId = 2;
        const response = await axios.put(`http://localhost:3000/api/wallets/deposit/:walletId`, {
            userId: userId, // The authenticated user's ID
            walletId: 4,
            amount: 100,
            notificationType: 'email'
        }, {
            withCredentials: true
        });
        console.log('Automated deposit response:', response.data);
    } catch (error) {
        console.error('Error triggering automated deposit:', error);
    }
};

// Set the interval to run the function every 3 minutes
const THREE_MINUTES = 3 * 60 * 1000;
const now = new Date();
const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 30, 0, 0);
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
