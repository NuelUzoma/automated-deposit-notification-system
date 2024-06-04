import { triggerAutomatedDeposit } from '../services/scheduleDeposits.service.js';

// Express.js route handler to trigger automated deposits
export async function httpTriggerDeposit(req, res) {
    try {
        await triggerAutomatedDeposit(req);
        return res.json({ message: 'Automated deposit triggered' });
    } catch (err) {
        console.error('Error triggering automated deposit:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
