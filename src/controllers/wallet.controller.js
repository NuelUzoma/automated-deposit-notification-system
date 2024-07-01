import { db, Users, Wallets } from '../database/db.connect.js'
import { UserManagementService, UserWalletService } from '../services/user.service.js';
import logger from '../logging/logger.js';
import { createTransaction } from '../database/queries/transaction.js';


// Function for Wallet-to-Wallet Automated Deposit between Users
export async function httpWalletDeposit(req, res, next) {
    let transaction;

    try {
        transaction = await db.sequelize.transaction(); // Create Transaction
        const userId = parseInt(req.user.id, 10);
        const reciepientWalletId = req.params.walletId; // The walletId of reciepient
        const { amount, notificationType } = req.body; // Amount to be deposited and specify notification type

        // Retrieve wallet records for user1(depositor) and user2(reciepient)
        const userWallet = await Wallets.findOne({ where: { userId: userId } }); // Depositor
        const reciepientWallet = await Wallets.findOne({ where: { id: reciepientWalletId } }); // Reciepient

        // Return error if wallet is not found
        if (!userWallet || !reciepientWallet) {
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
            // Perform the automated deposit by updating the balances and transaction history using User Wallet Service
            await UserWalletService.performDeposit(userId, reciepientWalletId, amount, transaction);

            // Update the transaction history for the deposit in the database
            const username = req.user.username;
            const reciepientUserId = parseInt(reciepientWallet.userId, 10);

            const reciepientUser = await Users.findOne({ where: {
                id: reciepientUserId
            }});

            const reciepientUsername = reciepientUser.username

            await createTransaction({
                senderId: userId,
                reciepientId: reciepientUserId,
                details: [`Depositor: ${username}, Reciepient: ${reciepientUsername}, Amount: ${amount}, Transaction Successful`]
            }, transaction).then(logger.info('Transaction History updated'));

            // Return successful response
            await transaction.commit();
            res.status(201).json({ message: 'Amount Deposit Successful' });
        }
    } catch (err) {
        if (transaction) {
            await transaction.rollback(); // Abort transaction on error
        }
        // res.status(500).json({
        //     error: 'An error occurred while processing the deposit'
        // });
        next(err);
    }
}