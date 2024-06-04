import {
    createWallet,
    // walletDeposit
} from '../database/queries/wallet.js';
import { Users, Wallets } from '../database/db.connect.js'
import { UserManagementService, UserWalletService } from '../services/user.service.js';


export async function httpCreateWallet(req, res, next) {
    try {
        const userId = req.user.id;
        const { balance } = req.body;

        // Create new wallet record in the database
        const wallet = await createWallet(userId, balance);

        // Return created wallet as response
        if (wallet) {
            res.status(201).json({
                wallet,
                message: 'Wallet created successfully'
            });
        } else {
            res.status(500).json({ error: 'An error occurred while creating the wallet' });
        }
    } catch (err) {
        next(err);
    }
}

// Function for Wallet-to-Wallet Automated Deposit between Users
export async function httpWalletDeposit(req, res, next) {
    try {
        const userId = req.user.id;
        const walletId = req.params.walletId; // The walletId of reciepient
        const { amount, notificationType } = req.body; // Amount to be deposited and specify notification type

        // Retrieve wallet records for user1(depositor) and user2(reciepient)
        const user1Wallet = await Wallets.findOne({ where: { id: userId } }); // Depositor
        const user2Wallet = await Wallets.findOne({ where: { id: walletId } }); // Reciepient

        // Return error if wallet is not found
        if (!user1Wallet || !user2Wallet) {
            res.status(404).json({ error: 'Wallet not found' });
        }

        const hasSufficientBalance = await UserWalletService.checkSufficientBalance(userId, amount);

        // Check if user1(depositor) has sufficient balance
        if (!hasSufficientBalance) {
            // Retrieve user information from User Management Service
            const user = await Users.findOne({ where: { id: userId } });

            // Personalized message format to be sent to user (depositor)
            const email = user.email;
            const mobileNumber = user.mobileNumber;

            const subject = 'Insufficient Funds to Initiate Transcation';

            const message = 'Dear User,\n' +
                'You currently dont have enough balance to initiate a transaction.\n' +
                `Transaction Amount: $${amount}\n` +
                'Kindly visit https://www.somelink.com to fund your wallet.\n' +
                'Thanks';

            // Send notification based on notification type
            if (notificationType === 'mobile') {
                // Send mobile notification to user (depositor)
                await UserManagementService.sendMobileNotification(mobileNumber, message);
            } else if (notificationType === 'email') {
                // Send email notification to user (depositor)
                await UserManagementService.sendEmailNotification(email, subject, message)
            }

            // Return error response
            res.status(400).json({ error: 'Insufficient Funds' });
        } else {
            // Perform the automated deposit by updating the balances using User Wallet Service
            await UserWalletService.performDeposit(userId, walletId, amount)

            // Return successful response
            res.status(201).json({ message: 'Amount Deposit Successful' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while processing the deposit' });
        next(err);
    }
}