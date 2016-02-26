 angular.module('starter.controllers', ['ngCordova'])

 .controller('MapCtrl',
  ['$http','$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', function($http, $ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation) {

  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  angular.extend($scope, {
     markers : {
     }
  });

  document.addEventListener("deviceready", updateUserLocMarker, false);

  function updateUserLocMarker (map) {
    if(!isCordovaApp) {
      navigator.geolocation.getCurrentPosition(function(position){
      $ionicLoading.hide();

        if(map) {
          map.panTo({
            lat : position.coords.latitude,
            lng : position.coords.longitude
          });
        }
        $scope.markers.userMarker = {
          lat : position.coords.latitude,
          lng : position.coords.longitude,
          message : 'You are here'
        };
      }, function(err){
        console.log(err);
      }, {
        timeout : 10000,
        enableHighAccuracy : true
      });
    } else {
      $cordovaGeolocation
        .getCurrentPosition({timeout : 10000, enableHighAccuracy : true})
        .then(function (position) {
          $ionicLoading.hide();

          if(map.panTo) {
            map.panTo({
              lat : position.coords.latitude,
              lng : position.coords.longitude
            });
          }
          $scope.markers.userMarker = {
          lat : position.coords.latitude,
          lng : position.coords.longitude,
          message : 'You are here'
        };
        }, function(err) {
          console.log(err);
        });
    }
  }

  angular.extend($scope, {
    honolulu: {
      lat: 21.3008900859581,
      lng: -157.8398036956787,
      zoom: 13
    },
    events: {
      map : {
        enable : ['click', 'locationfound', 'dragend'],
        logic : 'broadcast'
      }
    },
    layers: {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      }
    },
    defaults: {
      scrollWheelZoom: false
    },
    center : {
      lat: 21.3008900859581,
      lng: -157.8398036956787,
      zoom: 13,
      // autoDiscover:true
    },
    bikeShareIcon: {
      type: 'extraMarker',
      icon: 'fa-bicycle',
      markerColor: 'green-light',
      prefix: 'fa',
      shape: 'circle'
    },
    historyIcon: {
      type: 'extraMarker',
      icon: 'fa-camera',
      markerColor: 'yellow',
      shape : 'star',
      prefix : 'fa'
    }
  });

  $scope.findCenter = function(){
    leafletData.getMap().then(function(map){
      $scope.show($ionicLoading);
      map.locate();
      updateUserLocMarker(map);
      $scope.removeRouting();
    });
  };

  // Filter which markers to show

  $scope.showStations = true;
  $scope.showLandmarks = false;
  $scope.showBikeRacks = false;

  $scope.setShowStations = function(){
    $scope.showStations = !$scope.showStations;
  };

  $scope.setShowLandmarks = function(){
    $scope.showLandmarks = !$scope.showLandmarks;
  };

  $scope.setShowBikeRacks = function(){
    $scope.showBikeRacks = !$scope.showBikeRacks;
  };

  // Functions to set and filter by radius //

  $scope.myLocation = {};

  $scope.radius = 1610;
  $scope.radiusHalf = false;
  $scope.radiusMile = true;
  $scope.radiusTwoMile = false;
  $scope.radiusAll = false;

  $scope.setRadius = function(rad){
    $scope.radius = rad;
    if ( rad === 805) {  $scope.radiusHalf = true; $scope.radiusMile = false; $scope.radiusTwoMile = false; $scope.radiusAll = false; }
    if ( rad === 1610) {  $scope.radiusHalf = false; $scope.radiusMile = true; $scope.radiusTwoMile = false; $scope.radiusAll = false; }
    if ( rad === 3220) {  $scope.radiusHalf = false; $scope.radiusMile = false; $scope.radiusTwoMile = true; $scope.radiusAll = false; }
    if ( rad === 50000) {  $scope.radiusHalf = false; $scope.radiusMile = false; $scope.radiusTwoMile = false; $scope.radiusAll = true; }
  };

  $scope.setPinsWithinRadius = function(){
    $scope.markers = {};

    PointService.getPointsInRadius($scope.radius, $scope.myLocation.myLat, $scope.myLocation.myLong)
      .then(function(data){

        $scope.markers.userMarker = {
          lat : $scope.myLocation.myLat,
          lng : $scope.myLocation.myLong,
          // message : 'You are here'
        };

        if ($scope.showStations){
          for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
            var bikeNum = 'bike' + i;
            $scope.markers[bikeNum] = {
              lat : data.data.geoJSONBikeShare.features[i].properties.lat,
              lng : data.data.geoJSONBikeShare.features[i].properties.long,
              icon: $scope.bikeShareIcon
            };
          }

        }

        if ($scope.showLandmarks){
          for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
            var historyNum = 'history' + j;
            $scope.markers[historyNum] = {
              lat : data.data.geoJSONHistory.features[j].properties.lat,
              lng : data.data.geoJSONHistory.features[j].properties.long,
              icon: $scope.historyIcon
            };
          }
        }
      });
  };

  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    $ionicLoading.hide();
    var leafEvent = args.leafletEvent;
    $scope.center.autoDiscover = true;
    $scope.markers.userMarker = {
      lat : leafEvent.latitude,
      lng : leafEvent.longitude,
      message : 'You are here'
    };


    PointService.getPointsInRadius(1610, leafEvent.latitude, leafEvent.longitude)
      .then(function(data){
      $scope.myLocation = { "myLat" : leafEvent.latitude, "myLong" : leafEvent.longitude};

      //PROPERTIES FOR LIST VIEW IN TAB-HOME.HTML MODAL
      $scope.bikesharePoints = [];

        for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){

          //TO SEND DATA INFO INTO ARRAY
          var bksData = data.data.geoJSONBikeShare.features[i].properties;
          var markLat = bksData.lat;
          var markLong = bksData.long;

          $scope.bikesharePoints.push({
            title: bksData.name,
            dist: Math.round(((bksData.distance_from_current_location)*0.000621371192) * 100) / 100,
            lat: bksData.lat,
            long: bksData.long
          });

          //COUNT OF STATION WITHIN USER'S RADIUS
          $scope.stationCount = $scope.bikesharePoints.length;

          var bikeNum = 'bike' + i;
          $scope.markers[bikeNum] = {
            lat : bksData.lat,
            lng : bksData.long,
            icon: $scope.bikeShareIcon
          };


        }
        //GET DIRECTION FROM USER TO POINT
        $scope.getDirections = function(desLat, desLong){
          $scope.removeRouting();

          $scope.markers = {};
          leafletData.getMap()
            .then(function(map){
              $scope.routingControl = L.Routing.control({
                waypoints: [L.latLng( leafEvent.latitude, leafEvent.longitude), L.latLng( desLat, desLong)],
                routeWhileDragging: true
              }).addTo(map);
              $scope.closeModal(2);
            });
        };

        $scope.updateRoute = function (fromLat, fromLng, toLat, toLng) {
          $scope.markers = {};
          leafletData.getMap()
            .then(function(map){
              $scope.routingControl.getPlan().setWaypoints([
                  L.latLng(fromLat, fromLng),
                  L.latLng(toLat, toLng)
              ]);
              $scope.closeModal(2);
            });
        };

        //TO REMOVE CURRENT ROUTES
        $scope.removeRouting = function() {
          leafletData.getMap()
          .then(function(map) {
            map.removeControl($scope.routingControl);
            routingOnMap = false;
          });
        };

        for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
          var historyNum = 'history' + j;
          $scope.markers[historyNum] = {
            lat : data.data.geoJSONHistory.features[j].properties.lat,
            lng : data.data.geoJSONHistory.features[j].properties.long,
            icon: $scope.historyIcon
          };
        }

      });

  });

  $scope.$on('leafletDirectiveMap.map.dragend', function(event, args){
    // $scope.center.autoDiscover = false;
    // $scope.markers = {
    //   userMarker : $scope.markers.userMarker
    // };
    console.log("consoleLogging", leafletData.getMap());
    leafletData.getMap().then(function(map){
      // $scope.show($ionicLoading);
      var bounds = map.getBounds();
      PointService.getPointsInView(bounds._northEast.lat,bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lng)
        .then(function(data){

          for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
          var pointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3)"> ' + data.data.geoJSONBikeShare.features[i].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
          var popupElement = angular.element(document).find('#popup');
          popupElement = $compile(popupElement);
          var content = popupElement($scope);
            var bikeNum = 'bike' + i;
            $scope.markers[bikeNum] = {
              lat : data.data.geoJSONBikeShare.features[i].properties.lat,
              lng : data.data.geoJSONBikeShare.features[i].properties.long,
              icon: $scope.bikeShareIcon,
              message : pointsDetail,
              compileMessage : true,
              getMessageScope: function(){ return $scope; },
              properties : data.data.geoJSONBikeShare.features[i].properties
            };
          }
          for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
            var historyPointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3)"> ' + data.data.geoJSONHistory.features[j].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var historyPopupElement = angular.element(document).find('#popup');
            historyPopupElement = $compile(historyPopupElement);
            var historyContent = historyPopupElement($scope);
            var historyNum = 'history' + j;
            $scope.markers[historyNum] = {
              lat : data.data.geoJSONHistory.features[j].properties.lat,
              lng : data.data.geoJSONHistory.features[j].properties.long,
              icon: $scope.historyIcon,
              message : historyPointsDetail,
              compileMessage : true,
              getMessageScope: function(){ return $scope; },
              properties : data.data.geoJSONHistory.features[j].properties
            };
          }
        });
    });
  });

  //PROPERTIES FOR CHECKBOX IN TAB-HOME.HTML
  $scope.pinTypes = [
      { text: "Bike Share", checked: true },
      { text: "Landmark", checked: false },
      { text: "Bike Rack", checked: false }
    ];

  //SPINNER ONLOAD ANIMATION
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading, please wait...</p><ion-spinner icon="spiral"></ion-spinner> <ion-spinner icon="spiral"></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.$on('leafletDirectiveMap.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
  });

  $scope.$on('leafletDirectiveMarker.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
      var marker = args.markerName;
      $scope.currentMarkerProperties = args.leafletObject.options.properties;
  });


  //////// BEGINNIG of MODAL ////////

  $ionicModal.fromTemplateUrl('filter-modal.html', {
      id: '1',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal1 = modal;
    });

  $ionicModal.fromTemplateUrl('bikeShareList.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  // Modal for Marker Info
  $ionicModal.fromTemplateUrl('markerDetail.html', {
    id: '3',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal3 = modal;
  });

  $scope.openModal = function(index) {
    switch (index) {
      case 1 : $scope.modal1.show();
                break;
      case 2 : $scope.modal2.show();
                break;
      case 3 : $scope.modal3.show();
    }
  };

   $scope.closeModal = function(index) {
    switch (index) {
      case 1 : $scope.modal1.hide();
                break;
      case 2 : $scope.modal2.hide();
                break;
      case 3 : $scope.modal3.hide();
    }
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
    //////// END of MODAL ////////


  }]);