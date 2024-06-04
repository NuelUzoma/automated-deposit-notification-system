import { DataTypes } from 'sequelize';


// Profile (Dashboard) table
function Profile(sequelize) {
    const ProfileSchema = sequelize.define("Profile", {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: { // User ID 
          type: DataTypes.INTEGER,
          references: {
              model: 'users',
              key: 'id'
          },
        },
        name: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
    }, {
        tableName: 'profiles',
    });
    
    return ProfileSchema;
}


export default Profile;
