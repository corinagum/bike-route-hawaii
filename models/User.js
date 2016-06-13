module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name : DataTypes.STRING,
    age : DataTypes.STRING,
    gender : DataTypes.STRING,
    zipcode : DataTypes.INTEGER,
    email: DataTypes.STRING,
    location: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)),
    paths : DataTypes.ARRAY(DataTypes.STRING),
    liked : DataTypes.ARRAY(DataTypes.INTEGER),
    suggested : DataTypes.ARRAY(DataTypes.INTEGER),
    commentType : DataTypes.ARRAY(DataTypes.STRING),
    comment : DataTypes.ARRAY(DataTypes.STRING)
  });

  return User;
};