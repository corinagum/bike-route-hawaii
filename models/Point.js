module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    type : DataTypes.STRING,
    name : DataTypes.STRING,
    description : DataTypes.TEXT,
    info : DataTypes.TEXT,
    fid : DataTypes.INTEGER,
    site_id: DataTypes.STRING,
    street : DataTypes.STRING,
    side : DataTypes.STRING,
    lat : DataTypes.FLOAT,
    long : DataTypes.FLOAT,
    geolink : DataTypes.STRING,
    sitelink : DataTypes.STRING,
    photolink : DataTypes.STRING,
    likedBy : DataTypes.ARRAY(DataTypes.INTEGER),
    clicks : DataTypes.INTEGER
  });

  return Point;
};