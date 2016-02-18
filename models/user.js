module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    facebookId : DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        user.hasMany(models.route);
      }
    }
  });

  return user;
};