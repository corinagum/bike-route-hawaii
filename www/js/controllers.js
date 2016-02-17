
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
  });
