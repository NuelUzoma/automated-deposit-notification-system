// Contains classes for User Management and Wallet services.
import { Users, Wallets } from "../database/db.connect.js";
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN); // Twilio client

class UserManagementService {
    // functions for user management
    
    static async getUser(userId) {
        await Users.findOne({ where: { id: userId } });
    }

    static async sendMobileNotification(mobileNumber, message) {
        try {
            // Send SMS Notification to user using Twilio client
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_NUMBER,
                to: mobileNumber
            });

             // Notification sent successfully
             console.log('Mobile notification sent successfully');
        } catch (err) {
            throw err;
        }
    }

    static async sendEmailNotification(email, subject, message) {
        try {
            // Send email to user using Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                },
            });
    
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: email,
                subject,
                text: message
            }
    
            await transporter.sendMail(mailOptions);
        } catch (err) {
            throw(err);
        }
    }
}


// Wallet Service Class
class UserWalletService {
    // functions for wallet service

    static async checkSufficientBalance(userId, amount) {
        // Logic to check if user balance is sufficient
        try {
            // Retrieve user wallet based on userId
            const userWallet = await Wallets.findOne({ where: { id: userId } }); // Depositor

            // Return error if wallet is not found
            if (!userWallet) {
                res.status(404).json({ error: 'Wallet not found' });
            }

            // Compare user's wallet with the amount
            if (userWallet.balance >= amount) {
                return true; // Sufficient balance
            } else {
                return false; // Insufficient balance
            }
        } catch (err) {
            throw err;
        }
    }

    static async performDeposit(userId, walletId, amount) {
        // Logic to perform deposits
        try {
            // Retrieve Users Wallet
            const user1Wallet = await Wallets.findOne({ where: { id: userId } }); // Depositor
            const user2Wallet = await Wallets.findOne({ where: { id: walletId } }); // Reciepient

            // Return error if wallet is not found
            if (!user1Wallet || !user2Wallet) {
                res.status(404).json({ error: 'Wallet not found' });
            }

            // Perform the deposit by updating the balances
            user1Wallet.balance -= amount;
            user2Wallet.balance += amount;

            // Update wallet records in the database
            await user1Wallet.save();
            await user2Wallet.save();

        } catch (err) {
            throw err;
        }
    }
}


export {
    UserManagementService,
    UserWalletService
}