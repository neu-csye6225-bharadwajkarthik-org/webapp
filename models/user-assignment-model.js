const { DataTypes } = require('sequelize');
const SequelizeFactory = require('../config/orm-config');
const logger = require('../utils/logger');

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
      logger.info('ORM: Successfully synced "user-assignment" table');
   }catch(error){
      logger.error('ORM: Error syncing "user-assignment" table');
      console.log("Error syncing UserAssignment Table")
   }
})()

module.exports = UserAssignments;