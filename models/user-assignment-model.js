const { DataTypes } = require('sequelize');
const SequelizeFactory = require('../config/orm-config');

const sequelize = SequelizeFactory().get();

const UserAssignments = sequelize.define('User_Assignments', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

(async() => {
   try{
      await sequelize.sync()
      console.log("Successfully synced UserAssignment Table");
   }catch(error){
      console.log("Error syncing UserAssignment Table")
   }
})()

module.exports = UserAssignments;