angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service("RouteService", ['$http', function ($http) {
  // START CRUD OPERATIONS \\
// GET
    this.getRoutes = function(id) {
      return $http.get('/' + id);
    };
// POST
    this.addRoute = function(route) {
      return $http.post('/routes/end', {
        route: route
      });
    };

// DELETE
    this.deleteRoute = function(id) {
      return $http.delete('/' + id +'/delete');
    };
  }])
  .service("UserService", ['$http', function($http){

// LOGIN
    this.login = function(auth) {
      return $http.post('/login', {
        auth : auth
      });
    };
// REGISTER
    this.signUp = function(register) {
      return $http.post('/register', {
        register : register
      });
    };
// LOGOUT
    this.logout = function(){
      return $http.get('/logout');
    };

//AUTHORIZATION STATUS
    this.authStatus = function(){
      return $http.get('/authStatus');
    };

}]);

