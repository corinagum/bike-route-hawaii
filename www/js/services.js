angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Paki and Kalakaua',
    desc: 'Blue bottle slow-carb letterpress, intelligentsia meggings deep v keffiyeh vinyl. Kickstarter helvetica ethical, ennui kogi ramps 90\'s listicle flannel iPhone actually marfa banjo hashtag. Asymmetrical ugh waistcoat, cred green juice photo booth umami meggings. Flannel pinterest dreamcatcher vinyl readymade, tacos scenester austin normcore listicle church-key. Hammock paleo organic four dollar toast. You probably haven\'t heard of them asymmetrical taxidermy, gochujang 90\'s tattooed tofu authentic tousled microdosing iPhone lumbersexual ennui fashion axe gastropub. Pop-up kinfolk brunch, lo-fi ramps squid health goth tilde.',
    face: 'http://chromecastbg.alexmeub.com/images/240_AF1QipMrVESpBMMxsgHBYtljVZWvhOy1dpmtS-vVCsXX.jpg'
  }, {
    id: 1,
    name: 'Paki and Noela',
    desc: 'Blue bottle slow-carb letterpress, intelligentsia meggings deep v keffiyeh vinyl. Kickstarter helvetica ethical, ennui kogi ramps 90\'s listicle flannel iPhone actually marfa banjo hashtag. Asymmetrical ugh waistcoat, cred green juice photo booth umami meggings. Flannel pinterest dreamcatcher vinyl readymade, tacos scenester austin normcore listicle church-key. Hammock paleo organic four dollar toast. You probably haven\'t heard of them asymmetrical taxidermy, gochujang 90\'s tattooed tofu authentic tousled microdosing iPhone lumbersexual ennui fashion axe gastropub. Pop-up kinfolk brunch, lo-fi ramps squid health goth tilde.',
    face: 'http://chromecastbg.alexmeub.com/images/240_AF1QipMAuhpOoerXqmbSvb6MGvZhPAJnkrWmFx3QNe6R.jpg'
  }, {
    id: 2,
    name: 'Kapiolani Park 1',
    desc: 'Blue bottle slow-carb letterpress, intelligentsia meggings deep v keffiyeh vinyl. Kickstarter helvetica ethical, ennui kogi ramps 90\'s listicle flannel iPhone actually marfa banjo hashtag. Asymmetrical ugh waistcoat, cred green juice photo booth umami meggings. Flannel pinterest dreamcatcher vinyl readymade, tacos scenester austin normcore listicle church-key. Hammock paleo organic four dollar toast. You probably haven\'t heard of them asymmetrical taxidermy, gochujang 90\'s tattooed tofu authentic tousled microdosing iPhone lumbersexual ennui fashion axe gastropub. Pop-up kinfolk brunch, lo-fi ramps squid health goth tilde.',
    face: 'http://chromecastbg.alexmeub.com/images/240_AF1QipNJ98LLErUYUwfcyu1SjwQX_Wt_3we-Ux3aAytf.jpg'
  }, {
    id: 3,
    name: 'Kapiolani Park 2',
    desc: 'Blue bottle slow-carb letterpress, intelligentsia meggings deep v keffiyeh vinyl. Kickstarter helvetica ethical, ennui kogi ramps 90\'s listicle flannel iPhone actually marfa banjo hashtag. Asymmetrical ugh waistcoat, cred green juice photo booth umami meggings. Flannel pinterest dreamcatcher vinyl readymade, tacos scenester austin normcore listicle church-key. Hammock paleo organic four dollar toast. You probably haven\'t heard of them asymmetrical taxidermy, gochujang 90\'s tattooed tofu authentic tousled microdosing iPhone lumbersexual ennui fashion axe gastropub. Pop-up kinfolk brunch, lo-fi ramps squid health goth tilde.',
    face: 'http://chromecastbg.alexmeub.com/images/240_AF1QipNPQtLL5EcPrqxhs07EaSz5ose7xHmmLb9u10BX.jpg'
  }, {
    id: 4,
    name: 'Waikiki Shell',
    desc: 'Blue bottle slow-carb letterpress, intelligentsia meggings deep v keffiyeh vinyl. Kickstarter helvetica ethical, ennui kogi ramps 90\'s listicle flannel iPhone actually marfa banjo hashtag. Asymmetrical ugh waistcoat, cred green juice photo booth umami meggings. Flannel pinterest dreamcatcher vinyl readymade, tacos scenester austin normcore listicle church-key. Hammock paleo organic four dollar toast. You probably haven\'t heard of them asymmetrical taxidermy, gochujang 90\'s tattooed tofu authentic tousled microdosing iPhone lumbersexual ennui fashion axe gastropub. Pop-up kinfolk brunch, lo-fi ramps squid health goth tilde.',
    face: 'http://chromecastbg.alexmeub.com/images/240_AF1QipN0X6n39_rePcGsmL_LgxFbthfIyDHjBeMlsmr5.jpg'
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

