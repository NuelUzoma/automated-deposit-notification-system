import { DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';

function User(sequelize) {
    const UserSchema = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'username exists'
            },
            validate: {
                notNull: {
                    msg: 'username field is required'
                },
                notEmpty: {
                    msg: 'username field is required'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'email exists'
            },
            validate: {
                notNull: {
                    msg: 'email field is required'
                },
                notEmpty: {
                    msg: 'email field is required'
                },
                isEmail: {
                    msg: 'please use a correct email format user@example.com'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'password field is required'
                }
            }
        }
    }, {
        tableName: 'users',
        hooks: {
            beforeCreate: async function(user) {
                const salt = await bcryptjs.genSalt(10); 
                user.salt = salt;
                user.password = await bcryptjs.hash(user.password, salt);
            }
        }
    });

    UserSchema.prototype.validPassword = async function(password) {
        return bcryptjs.compare(password, this.password, this.salt);
    };

    return UserSchema;
}



export default User;