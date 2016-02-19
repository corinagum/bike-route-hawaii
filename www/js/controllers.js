
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MapCtrl', ['RouteService', 'UserService', '$scope', '$ionicLoading', '$compile', function(RouteService, UserService, $scope, $ionicLoading, $compile) {

    //to set default view map
    var map = L.map('map').locate({
      setView : true,
      maxZoom : 16
    });

    var defaultTile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

    }).addTo(map);

// DISPLAY BIKESHARE STATION MARKERS
  var stationLayer = omnivore.kml('./assets/HI_Bikeshare_Priority_Stations.kml')
    .on('ready', function(){
      map.fitBounds(stationLayer.getBounds());
      stationLayer.eachLayer(function(station){
        station.setIcon(L.ExtraMarkers.icon({
        icon: 'fa-bicycle',
        markerColor: 'green-light',
        shape: 'circle',
        prefix: 'fa'
      }));
        station.bindPopup(station.feature.properties.name);
      });
    })
    .addTo(map);

// DISPLAY HISTORY SAMPLE
  var historyLayer = omnivore.kml('./assets/Images_of_Old_Hawaii-Sample.kml')
    .on('ready', function(){
      map.fitBounds(historyLayer.getBounds());
      historyLayer.eachLayer(function(history){
        console.log(history.feature.properties);
        history.setIcon(L.ExtraMarkers.icon({
          icon: 'fa-camera',
          markerColor: 'yellow',
          shape : 'star',
          prefix : 'fa'
        }));
        history.bindPopup(history.feature.properties.name);
      });
    })
    .addTo(map);

    var overlayStations = {
      "Bike Stations": stationLayer,
      "Sites" : historyLayer
    };
    L.control.layers(null, overlayStations).addTo(map);


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
        maxZoom: 16,
        watch: true
      });

      $scope.coordinates = [];

      function onLocationFound(data) {
        var radius = data.accuracy / 2;
        console.log("fullData", data);

        L.marker(data.latlng).addTo(map)
          .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(data.latlng, radius).addTo(map);
        $ionicLoading.hide();
      }

      map.on('locationfound', onLocationFound);

      /////////// testing tracker

    //   function setGeolocation() {
    // var geolocation = window.navigator.geolocation.getCurrentPosition(
    //     function ( position ) {
    //         latitude = position.coords.latitude;
    //         longitude = position.coords.longitude;
    //         accuracy = position.coords.accuracy;
    //         console.log('lat: ' + latitude + ', '+ 'lng: ' + longitude + ', '+ 'accuracy: ' + accuracy);
    //     },
    //     function () { /*error*/ }, {
    //         maximumAge: 250,
    //         enableHighAccuracy: true
    //     }
    // );}

    //   setInterval(function(){
    //     setGeolocation();
    //     // locate({setView: false});
    //     // console.log("New Location");
    //     // console.log(map.locate({setView: false}));
    //   }, 6000);
   };

   $scope.trackUserRoute = function(){
    console.log(map.locate({setView: false}));
    console.log('this fired');

   };

   $scope.endRoute = function(route){
    RouteService.addRoute(route);
   };
  }]);
