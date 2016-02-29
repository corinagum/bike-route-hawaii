// 'use strict';
var db                  = require('./../models');
var Point               = db.Point;
module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
     var bikeRacks = require('./../www/assets/bike-rack-locations.js').features;
     var toInsert = [];
     for(var i=0; i<bikeRacks.length; i++){
      bikeRacks[i].properties.type = 'bikeRack';
      bikeRacks[i].properties.long = Number(bikeRacks[i].properties.Location.split(',').pop());
      bikeRacks[i].properties.lat = Number(bikeRacks[i].properties.Location.split(',')[0]);
      delete bikeRacks[i].properties.Location;
       toInsert.push(bikeRacks[i].properties);
     }
     return Point.bulkCreate(toInsert);
   },

  down: function (queryInterface, Sequelize) {

      // Add reverting commands here.
      // Return a promise to correctly handle asynchronicity.

      // Example:
      return queryInterface.bulkDelete('Person', null, {});

  }
};
