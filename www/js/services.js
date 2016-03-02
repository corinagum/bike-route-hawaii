angular.module('starter.services', [])

.service("PointService", ['$http', 'processENV', function($http, processENV) {
  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  var domain;
  if(!isCordovaApp){
    domain = 'http://localhost:4000';
  }
  if(isCordovaApp){
    domain = '.';
  }
  this.getPoint = function() {
    return $http.get(domain + '/api/points');
  };

  this.addPoint = function(point) {
    return $http.post(domain + '/api/points', {
      point : point
    });
  };

  this.editPoint = function(point) {
    return $http.put(domain + '/api/points/' + point.id, {
      point : point
    });
  };

  this.deletePoint = function(point) {
    return $http.delete(domain + '/api' + point.id);
  };

  this.getPointsInRadius = function(radius, lat, long) {
    return $http.get(domain + '/api/points/within/' +
      radius + '/' + lat + '/' + long);
  };

  this.getPointsInView = function(NElat, NElong, SWlat, SWlong){
    // console.log(process.env);
    console.log(processENV);
    return $http.get(domain + '/api/points/bounds/' +
      NElat + '/' + NElong + '/' + SWlat + '/' +SWlong, {processENV:processENV});
  };
}])

.service("CommentService", ['$http', function($http) {
  this.addComment = function(comment, pointId){
    comment.PointId = pointId;
    if(comment.contact === 'Yes'){
      comment.contact = true;
    } else {
      comment.contact = false;
    }
    return $http.post('http://localhost:4000/api/comments', {
      comment : comment
    });
  };
}])

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

