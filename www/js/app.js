
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
  //created controller to view Leaflet library --should modularize and set it into controller file*
  .controller('MapCtrl', function($scope, $ionicLoading, $compile) {

    //to set default view map
    var map = L.map('map').setView([21.315640, -157.858110], 6);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
          // waypoints: [
          //     L.latLng(57.74, 11.94),
          //     L.latLng(57.6792, 11.949)
          // ],
          // routeWhileDragging: true

    }).addTo(map);

    $scope.map = map;

    //to locate user's location
    $scope.centerOnMe = function() {
       if (!$scope.map) {
         return;
       }

       $scope.loading = $ionicLoading.show({
         content: 'Getting current location...',
         showBackdrop: false
       });

       map.locate({
         setView: true,
         maxZoom: 16
       });

       function onLocationFound(data) {
         var radius = data.accuracy / 2;
         console.log("fullData", data);
         console.log("long", data.longitude);
         console.log("lat", data.latitude);
         L.marker(data.latlng).addTo(map)
           .bindPopup("You are within " + radius + " meters from this point").openPopup();

         L.circle(data.latlng, radius).addTo(map);
         $ionicLoading.hide();
       }

       map.on('locationfound', onLocationFound);

        var polylinePoints = [
          new L.LatLng(21.315640, -157.858110),
          new L.LatLng(21.315652, -157.858112),
          new L.LatLng(21.315646, -157.858116),
          new L.LatLng(21.315669, -157.858119),
          new L.LatLng(21.315685, -157.858125),
        ];

        var polylineOptions = {
          color: 'blue',
          weight: 6,
          opacity: 0.9
        };

      var polyline = new L.Polyline(polylinePoints, polylineOptions);

      map.addLayer(polyline);

      // zoom the map to the polyline
      map.fitBounds(polyline.getBounds());
   };
  })


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
