 angular.module('starter.controllers', ['ngCordova'])

 .controller('MapCtrl',
  ['$http','$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', function($http, $ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation) {

  $scope.navTitle='<img class="title-image" src="img/bike-assets/nav-logo.svg" />';

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
      zoom: 15
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
      zoom: 15,
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
    },
    bikeRack: {
      type: 'extraMarker',
      icon: 'fa-chevron-circle-up',
      markerColor: 'red',
      shape: 'circle',
      prefix : 'fa'
    }
  });

  var routeOnMap = false;

  $scope.foundLocation = false;

  $scope.findCenter = function(){
    leafletData.getMap().then(function(map){
      $scope.show($ionicLoading);
      map.locate();
      updateUserLocMarker(map);

      if( routeOnMap === true ) {
        $scope.removeRouting();
        routeOnMap = false;
      }

      $scope.foundLocation = true;
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
    $scope.markers = {userMarker: this.markers.userMarker};

    PointService.getPointsInRadius($scope.radius, $scope.myLocation.myLat, $scope.myLocation.myLong)
      .then(function(data){

        $scope.bikesharePoints = [];

          for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
            var pointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONBikeShare.features[i].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var bikeNum = 'bike' + i;
            var bksData = data.data.geoJSONBikeShare.features[i].properties;

            $scope.bikesharePoints.push({
              title: bksData.name,
              dist : Math.round(((bksData.distance_from_current_location)*0.000621371192) * 100) / 100,
              lat  : bksData.lat,
              long : bksData.long
            });

            if ($scope.showStations){
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
          }

        $scope.landmarkPoints = [];

          for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
            var historyPointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONHistory.features[j].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var historyNum = 'history' + j;
            var landmarkData = data.data.geoJSONHistory.features[j].properties;

            $scope.landmarkPoints.push({
              title: landmarkData.name,
              dist : Math.round(((landmarkData.distance_from_current_location)*0.000621371192) * 100) / 100,
              photo: landmarkData.photolink,
              lat  : landmarkData.lat,
              long : landmarkData.long
            });

            if ($scope.showLandmarks){
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
          }

        $scope.bikeRackPoints = [];

          for(var k = 0; k < data.data.geoJSONBikeRack.features.length; k++){
            var pointsRackDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONBikeRack.features[k].properties.description + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var bikeRackNum = 'bikeRack' + k;
            var bikerackData = data.data.geoJSONBikeRack.features[k].properties;

            $scope.bikeRackPoints.push({
              title: bikerackData.description,
              dist : Math.round(((bikerackData.distance_from_current_location)*0.000621371192) * 100) / 100,
              // photo: bikerackData.photolink,
              lat  : bikerackData.lat,
              long : bikerackData.long
            });

            if ($scope.showBikeRacks){
              $scope.markers[bikeRackNum] = {
                lat : data.data.geoJSONBikeRack.features[k].properties.lat,
                lng : data.data.geoJSONBikeRack.features[k].properties.long,
                icon: $scope.bikeRack,
                message : pointsRackDetail,
                compileMessage : true,
                getMessageScope: function(){ return $scope; },
                properties : data.data.geoJSONBikeRack.features[k].properties
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
            var pointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONBikeShare.features[i].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var bikeNum = 'bike' + i;
            var bksData = data.data.geoJSONBikeShare.features[i].properties;

            $scope.bikesharePoints.push({
              title: bksData.name,
              dist : Math.round(((bksData.distance_from_current_location)*0.000621371192) * 100) / 100,
              lat  : bksData.lat,
              long : bksData.long
            });

            if ($scope.showStations){
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
          }

        $scope.landmarkPoints = [];

          for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
            var historyPointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONHistory.features[j].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var historyNum = 'history' + j;
            var landmarkData = data.data.geoJSONHistory.features[j].properties;

            $scope.landmarkPoints.push({
              title: landmarkData.name,
              dist : Math.round(((landmarkData.distance_from_current_location)*0.000621371192) * 100) / 100,
              photo: landmarkData.photolink,
              lat  : landmarkData.lat,
              long : landmarkData.long
            });

            if ($scope.showLandmarks){
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
          }

        $scope.bikeRackPoints = [];

          for(var k = 0; k < data.data.geoJSONBikeRack.features.length; k++){
            var pointsRackDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONBikeRack.features[k].properties.description + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
            var bikeRackNum = 'bikeRack' + k;
            var bikerackData = data.data.geoJSONBikeRack.features[k].properties;

            $scope.bikeRackPoints.push({
              title: bikerackData.description,
              dist : Math.round(((bikerackData.distance_from_current_location)*0.000621371192) * 100) / 100,
              // photo: bikeRackPoints.photolink,
              lat  : bikerackData.lat,
              long : bikerackData.long
            });

            if ($scope.showBikeRacks){
              $scope.markers[bikeRackNum] = {
                lat : data.data.geoJSONBikeRack.features[k].properties.lat,
                lng : data.data.geoJSONBikeRack.features[k].properties.long,
                icon: $scope.bikeRack,
                message : pointsRackDetail,
                compileMessage : true,
                getMessageScope: function(){ return $scope; },
                properties : data.data.geoJSONBikeRack.features[k].properties
              };
            }
          }

      //GET DIRECTION FROM USER TO POINT
      $scope.getDirections = function(desLat, desLong){
        if( routeOnMap === true ) {
          $scope.removeRouting();
          routeOnMap = false;
        }

        $scope.markers = {};
        leafletData.getMap()
          .then(function(map){
            $scope.routingControl = L.Routing.control({
              waypoints: [L.latLng( leafEvent.latitude, leafEvent.longitude), L.latLng( desLat, desLong)],
              show: false,
              routeWhileDragging: true,
              position: 'topleft'}).addTo(map);
            $scope.closeModal(2);
            $scope.closeModal(4);
            routeOnMap = true;
          });

          ionic.DomUtil.ready(function(){
            // Remove assertive (red) style to use balanced (green)
            angular.element(document.querySelector('#bar'))
            // .removeClass('bar-assertive')
            .addClass('button')
            .text('Clear Route');

            // Change bar text
            // angular.element(document.querySelector('#bar'))
            // .text('Clear Route');
          });
      };

      //TO REMOVE CURRENT ROUTES THAT'S DISPLAYED ON MAP
      $scope.removeRouting = function() {
        leafletData.getMap()
        .then(function(map) {
          map.removeControl($scope.routingControl);
          routeOnMap = false;
        });
      };
    });
  });

  $scope.$on('leafletDirectiveMap.map.dragend', function(event, args){

    $ionicLoading.hide();
    var leafEvent = args.leafletEvent;
    $ionicLoading.hide();
    $scope.markers = {
      userMarker : $scope.markers.userMarker
    };
    if( routeOnMap === false ) {
    leafletData.getMap().then(function(map){
      // $scope.show($ionicLoading);
      var bounds = map.getBounds();
      PointService.getPointsInView(bounds._northEast.lat,bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lng)
        .then(function(data){

          if ($scope.showStations){
            for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
            var pointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONBikeShare.features[i].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
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
          }

          if ($scope.showLandmarks){
            for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
              var historyPointsDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONHistory.features[j].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';

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
          }

          if ($scope.showBikeRacks){
            for(var k = 0; k < data.data.geoJSONBikeRack.features.length; k++){
            var pointsRackDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + data.data.geoJSONBikeRack.features[k].properties.description + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
              var bikeRackNum = 'bikeRack' + k;
              $scope.markers[bikeRackNum] = {
                lat : data.data.geoJSONBikeRack.features[k].properties.lat,
                lng : data.data.geoJSONBikeRack.features[k].properties.long,
                icon: $scope.bikeRack,
                message : pointsRackDetail,
                compileMessage : true,
                getMessageScope: function(){ return $scope; },
                properties : data.data.geoJSONBikeRack.features[k].properties
              };
            }
          }

        });
    });
  }
});

  // COMMENT SUBMIT FUNCTION
  $scope.postComment = function(comment){
    CommentService.addComment(comment, $scope.currentMarkerProperties.id)
    .then(function(data){

    });
  };

  //PROPERTIES FOR CHECKBOX IN TAB-HOME.HTML
  $scope.pinTypes = [
      { text: "Bike Share", checked: true },
      { text: "Landmark", checked: false },
      { text: "Bike Rack", checked: false }
    ];

  //SPINNER ONLOAD ANIMATION
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading, please wait...</p><ion-spinner icon="ripple">'
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
      if ($scope.currentMarkerProperties !== undefined){
        $scope.isFavorited = $scope.checkFavorite($scope.currentMarkerProperties);
        $scope.isSafetyWarn = $scope.checkSafetyWarn($scope.currentMarkerProperties);
      }
  });

  //////// BEGINNIG of MODAL ////////
  $ionicModal.fromTemplateUrl('filter-modal.html', {
      id       : '1',
      scope    : $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal1 = modal;
    });

  $ionicModal.fromTemplateUrl('bikeShareList.html', {
    id       : '2',
    scope    : $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  // Modal for Marker Info
  $ionicModal.fromTemplateUrl('markerDetail.html', {
    id       : '3',
    scope    : $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal3 = modal;
  });

  // MODAL FOR LANDMARK LISTS
  $ionicModal.fromTemplateUrl('landmarkList.html', {
    id: '4',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal4 = modal;
  });

  $ionicModal.fromTemplateUrl('reportDetail.html', {
    id: '5',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal5 = modal;
  });

  $ionicModal.fromTemplateUrl('bikeRackList.html', {
    id: '6',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal6 = modal;
  });

  $scope.openModal = function(index) {
    switch (index) {
      case 1 : $scope.modal1.show();
                break;
      case 2 : $scope.modal2.show();
                break;
      case 3 : $scope.modal3.show();
                break;
      case 4 : $scope.modal4.show();
                break;
      case 5 : $scope.modal5.show();
                break;
      case 6 : $scope.modal6.show();
    }
  };

   $scope.closeModal = function(index) {
    switch (index) {
      case 1 : $scope.modal1.hide();
                break;
      case 2 : $scope.modal2.hide();
                break;
      case 3 : $scope.modal3.hide();
                break;
      case 4 : $scope.modal4.hide();
                break;
      case 5 : $scope.modal5.hide();
                break;
      case 6 : $scope.modal6.hide();
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

  // Logic for Location Details Modal

  var favoritesList = null;

  if( !JSON.parse(localStorage.getItem('favorites')) ) {
    favoritesList = [];
  } else{
    favoritesList = JSON.parse(localStorage.getItem('favorites'));
  }

  $scope.checkFavorite = function(currentMarker) {
    if(!currentMarker) {
      currentMarker = $scope.currentMarkerProperties;
    }
    return (favoritesList.indexOf(currentMarker.id) !== -1);
  };
  $scope.addFavorite = function(){
      if(favoritesList.indexOf($scope.currentMarkerProperties.id) !== -1) {
          favoritesList.splice(favoritesList.indexOf($scope.currentMarkerProperties.id),1);
          localStorage.setItem('favorites', JSON.stringify(favoritesList));
          $scope.isFavorited = false;
      } else {
        favoritesList.push($scope.currentMarkerProperties.id);
        localStorage.setItem('favorites', JSON.stringify(favoritesList));
        $scope.isFavorited = true;
      }
  };

  var safetyList = null;
  if(!JSON.parse(localStorage.getItem('safetyWarnings'))) {
    safetyList = [];
  } else {
    safetyList = JSON.parse(localStorage.getItem('safetyWarnings'));
  }

  $scope.checkSafetyWarn = function(currentMarker) {
    if(!currentMarker) {
      currentMarker = $scope.currentMarkerProperties;
    }
    return (safetyList.indexOf(currentMarker.id) !== -1);
  };

  $scope.addSafetyWarn = function(){
    if(safetyList.indexOf($scope.currentMarkerProperties.id) !== -1) {
      safetyList.splice(safetyList.indexOf($scope.currentMarkerProperties.id),1);
      localStorage.setItem('safetyWarnings', JSON.stringify(safetyList));
      $scope.isSafetyWarn = false;
    } else {
      safetyList.push($scope.currentMarkerProperties.id);
      localStorage.setItem('safetyWarnings', JSON.stringify(safetyList));
      $scope.isSafetyWarn = true;
    }
  };

//////// end of controller
}]);

