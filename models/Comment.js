module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    subject : DataTypes.STRING,
    description : DataTypes.TEXT,
    name : DataTypes.STRING,
    email : DataTypes.TEXT,
    contact : DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Comment.belongsTo(models.Point);
      }
    }
  });

  return Comment;
};