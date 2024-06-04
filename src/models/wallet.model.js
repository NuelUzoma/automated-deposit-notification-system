import { DataTypes } from 'sequelize';


// Wallet table
function Wallet(sequelize) {
    const WalletSchema = sequelize.define("Wallet", {
        id: { 
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: { // User ID of the wallet owner
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        balance: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        transactionHistory: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
    }, {
        tableName: 'wallets',
    });
  
    return WalletSchema;
}


export default Wallet;