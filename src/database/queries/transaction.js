import { Transactions } from "../db.connect.js";


// Create a new Transaction
export async function createTransaction({senderId, reciepientId, details}, transaction) {
    try {
        const transactions = await Transactions.create({
            senderId,
            reciepientId,
            details
        }, transaction); // Here, the transaction means DB Transaction tied with deposit
        return transactions;
    } catch (err) {
        throw err;
    }
}