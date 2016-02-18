module.exports = function(sequelize, DataTypes) {
  var route = sequelize.define("route", {
    startTime : DataTypes.DATE,
    endTime : DataTypes.DATE,
    duration : DataTypes.INTEGER,
    distance : DataTypes.FLOAT,
    routeCoordinates : DataTypes.ARRAY(DataTypes.STRING),
  }, {
    classMethods: {
      associate: function(models) {
        route.belongsTo(models.user);
      }
    }
  });

  return route;
};