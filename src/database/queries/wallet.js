import { Wallets } from '../db.connect.js';


// Create Wallet
export async function createWallet(userId, balance) {
    try {
        const wallet = await Wallets.create({ userId, balance });
        return wallet;
    } catch (err) {
        throw err;
    }
}