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
    var images = require('./../www/assets/Hookuleana.js').features;
    var toInsert = [];
    for(var i=0; i<images.length; i++){
      toInsert.push(images[i].properties);
    }
    return Point.bulkCreate(toInsert);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Point', null, {});
  }
};