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

// Decrement Wallet balance after Successful Deposit
// export async function walletDeposit(userId, walletId) {
//     try {
//         const userWallet = await Wallets.findOne({
//             where: {
//                 userId,
//                 walletId
//             }
//         });
//         return userWallet;
//     } catch (err) {
//         throw err;
//     }
// }