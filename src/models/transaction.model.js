import { DataTypes } from 'sequelize';


// Transactions Table
function Transaction(sequelize) {
    const TransactionSchema = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        senderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        reciepientId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        details: {
            type: DataTypes.JSON,
            defaultValue: [],
        }
    }, {
        tableName: 'transactions'
    });

    return TransactionSchema;
}


export default Transaction;