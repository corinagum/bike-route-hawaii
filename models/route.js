module.exports = function(sequelize, DataTypes) {
  var route = sequelize.define("route", {
    startTime : DataTypes.DATE,
    endTime : DataTypes.DATE,
    duration : DataTypes.TIME,
    distance : DataTypes.FLOAT,
    status : DataTypes.STRING,
    routeCoordinates : DataTypes.JSON,
    coordinateTimes : DataTypes.JSON
  }, {
    classMethods: {
      associate: function(models) {
        route.belongsTo(models.user);
      }
    }
  });

  return route;
};