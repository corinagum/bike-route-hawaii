 angular.module('starter.controllers', ['ngCordova'])

 .controller('MapCtrl',
  ['$http','$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', 'CommentService', function($http, $ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation, CommentService) {

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
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      inertiaMaxSpeed: 150
    },
    center : {
      lat: 21.3008900859581,
      lng: -157.8398036956787,
      zoom: 15,
    },
    markers : {},
    bikeShareIcon: {
      type: 'extraMarker',
      icon: 'fa-bicycle',
      markerColor: 'green-light',
      prefix: 'fa',
      shape: 'circle'
    },
    historyIcon: {
      type: 'extraMarker',
      icon: 'fa-university',
      markerColor: 'yellow',
      shape : 'square',
      prefix : 'fa'
    },
    bikeRack: {
      type: 'extraMarker',
      icon: 'fa-unlock-alt',
      markerColor: 'black',
      shape: 'circle',
      prefix : 'fa'
    }
  });
  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

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
      }, handleErr, {
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
        }, handleErr);
    }
  }

  function handleErr(error){
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $ionicLoading.hide();
        ionic.DomUtil.ready(function(){
          angular.element(document.querySelector('#locate-before-start'))
          .text('Ride-Hawaii needs your location to work :)');
        });
        $scope.setShowBlocker();
        break;

      case error.POSITION_UNAVAILABLE:
        $ionicLoading.hide();
        ionic.DomUtil.ready(function(){
          angular.element(document.querySelector('#locate-before-start'))
          .text('Please enable location services. Position not found.');
        });
        $scope.setShowBlocker();
        break;

      case error.TIMEOUT:
        $ionicLoading.hide();
        ionic.DomUtil.ready(function(){
          angular.element(document.querySelector('#locate-before-start'))
          .text('Please enable location services');
        });
        $scope.setShowBlocker();
        break;

      case error.UNKNOWN_ERROR:
        $ionicLoading.hide();
        ionic.DomUtil.ready(function(){
          angular.element(document.querySelector('#locate-before-start'))
          .text('An unknown error occurred.');
        });
        $scope.setShowBlocker();
        break;
    }
  }

  $scope.setShowBlocker = function(){
    $scope.foundLocation = false;
  };

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

  //  INITIALIZE FILTERS TO SHOW MARKERS
  $scope.showStations = true;
  $scope.showLandmarks = false;
  $scope.showBikeRacks = false;

  // TOGGLE FILTERS
  $scope.setShowStations = function(){
    $scope.showStations = !$scope.showStations;
  };
  $scope.setShowLandmarks = function(){
    $scope.showLandmarks = !$scope.showLandmarks;
  };
  $scope.setShowBikeRacks = function(){
    $scope.showBikeRacks = !$scope.showBikeRacks;
  };

  // DEFAULT RADIUS VALUES
  $scope.radius = 1610;
  $scope.radiusHalf = false;
  $scope.radiusMile = true;
  $scope.radiusTwoMile = false;
  $scope.radiusAll = false;

  // RADIUS SETTER
  $scope.setRadius = function(rad){
    $scope.radius = rad;
    if ( rad === 805) {  $scope.radiusHalf = true; $scope.radiusMile = false; $scope.radiusTwoMile = false; $scope.radiusAll = false; }
    if ( rad === 1610) {  $scope.radiusHalf = false; $scope.radiusMile = true; $scope.radiusTwoMile = false; $scope.radiusAll = false; }
    if ( rad === 3220) {  $scope.radiusHalf = false; $scope.radiusMile = false; $scope.radiusTwoMile = true; $scope.radiusAll = false; }
    if ( rad === 50000) {  $scope.radiusHalf = false; $scope.radiusMile = false; $scope.radiusTwoMile = false; $scope.radiusAll = true; }
  };

  // LOOPS THROUGH DATA RETURNED TO CHECK ITS TYPE AND IF IT SHOULD BE ASSIGNED A MARKER
  $scope.createMarkers = function(array, name){
    for(var i = 0; i < array.length; i++){
      var pointDetail;
      var showMarker;
      var pointIcon;
      array[i].properties.distanceToFrom = Math.round(((array[i].properties.distance_from_current_location)*0.000621371192) * 100) / 100;
      if(name === 'bikeShare'){
      pointDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + array[i].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
      $scope.bikesharePoints.push(array[i].properties);
      showMarker = $scope.showStations;
      pointIcon = $scope.bikeShareIcon;
      }
      if(name === 'landmark'){
        pointDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + array[i].properties.name + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
        $scope.landmarkPoints.push(array[i].properties);
        showMarker = $scope.showLandmarks;
        pointIcon = $scope.historyIcon;
      }
      if(name === 'bikeRack'){
        pointDetail = '<div><div class="sendPoint" id="popup" ng-click="openModal(3); checkFavorite(currentMarkerProperties);"> ' + array[i].properties.description + '&nbsp<a href="#"><i class="fa fa-chevron-right"></i></a></div></div>';
        $scope.bikeRackPoints.push(array[i].properties);
        showMarker = $scope.showBikeRacks;
        pointIcon = $scope.bikeRack;
      }
      if (showMarker){
        $scope.markers[(name + i)] = {
          lat : array[i].properties.lat,
          lng : array[i].properties.long,
          icon: pointIcon,
          message : pointDetail,
          compileMessage : true,
          getMessageScope: function(){ return $scope; },
          properties : array[i].properties
        };
      }
    }
  };

  // UTILITY FUNCTION FOR SETTING MARKERS WHEN RETURNED FROM API REQUEST
  $scope.bikesharePoints = [];
  $scope.landmarkPoints = [];
  $scope.bikeRackPoints = [];

  $scope.setMarkersReturned = function(data){
    $scope.createMarkers(data.data.geoJSONBikeShare.features, 'bikeShare');
    $scope.createMarkers(data.data.geoJSONHistory.features, 'landmark');
    $scope.createMarkers(data.data.geoJSONBikeRack.features, 'bikeRack');
  };

  // FIND POINTS ACCORDING TO FILTERS
  $scope.setPinsWithinRadius = function(){
    $scope.markers = {userMarker: this.markers.userMarker};
    PointService.getPointsInRadius($scope.radius, $scope.markers.userMarker.lat, $scope.markers.userMarker.lng)
      .then(function(data){
        $scope.setMarkersReturned(data);
      });
  };

  //FIND POINTS IN RADIUS ON LOCATION FOUND
  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    $ionicLoading.hide();
    var leafEvent = args.leafletEvent;
    $scope.center.autoDiscover = true;
    $scope.markers.userMarker = {
      lat : leafEvent.latitude,
      lng : leafEvent.longitude,
      message : 'You are here'
    };
    PointService.getPointsInRadius($scope.radius, $scope.markers.userMarker.lat, $scope.markers.userMarker.lng)
      .then(function(data){
        $scope.setMarkersReturned(data);
    });

  });

  //CHANGES CURRENT MARKER PROPERTIES BASED ON WHAT ITEM IS CLICKED IN LIST MODAL
  $scope.changeCurrentMarker = function(item){
    $scope.currentMarkerProperties = item;
  };

  // SWITCH FOR TURNING DRAG ON AND OFF
  $scope.showPointsOnDrag = true;
  $scope.setShowPointsOnDrag = function(){
    $scope.showPointsOnDrag = !$scope.showPointsOnDrag;
  };

  $scope.showFavorites = false;

  $scope.setshowFavorites = function(){
    $scope.showFavorites = !$scope.showFavorites;
  };

  // SHOW POINTS ON DRAG IF NOT ROUTING AND SHOWPOINTS ON DRAG ENABLED
  $scope.$on('leafletDirectiveMap.map.dragend', function(event, args){
    if ($scope.showPointsOnDrag){
      $ionicLoading.hide();
      var leafEvent = args.leafletEvent;
      $ionicLoading.hide();
      $scope.markers = {
        userMarker : $scope.markers.userMarker
      };
      if( routeOnMap === false ) {
        leafletData.getMap().then(function(map){
          var bounds = map.getBounds();
          PointService.getPointsInView(bounds._northEast.lat,bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lng)
            .then(function(data){
              $scope.setMarkersReturned(data);
            });
        });
      }
    }
  });

  // COMMENT SUBMIT FUNCTION
  $scope.postComment = function(comment){
    CommentService.addComment(comment, $scope.currentMarkerProperties.id)
    .then(function(data){
      $scope.closeModal(5);
    });
  };

  //PROPERTIES FOR CHECKBOX IN TAB-HOME.HTML
  $scope.pinTypes = [
      { text: "Bike Share", checked: true },
      { text: "Landmark", checked: false },
      { text: "Bike Rack", checked: false }
    ];

  //LOAD ANIMATION SHOW
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading, please wait...</p><ion-spinner icon="ripple">'
    });
  };

  // LOAD ANIMATION HIDE
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  // SAVE CURRENT MARKER PROPERTIES TO SCOPE
  $scope.$on('leafletDirectiveMarker.map.click', function(event, args){
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

  $ionicModal.fromTemplateUrl('favorites.html', {
    id: '7',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal7 = modal;
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
                break;
      case 7 : $scope.modal7.show();
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
                break;
      case 7 : $scope.modal7.hide();
    }
  };

  //REMOVE MODAL WHEN DESTROYED
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  //////// END of MODAL ////////

  // Logic for Location Details Modal

  $scope.favoritesList = null;

  if( !JSON.parse(localStorage.getItem('favorites')) ) {
    $scope.favoritesList = [];
  } else{
    $scope.favoritesList = JSON.parse(localStorage.getItem('favorites'));
  }
  $scope.checkFavorite = function(currentMarker) {
    if(!currentMarker) {
      currentMarker = $scope.currentMarkerProperties;
    }

    var faveMarker = $scope.favoritesList.findIndex(function(item){
      return item.id === currentMarker.id;
    });
    return faveMarker > -1;
  };

  $scope.addFavorite = function(){
    var faveMarker = $scope.favoritesList.findIndex(function(item){
      return item.id === $scope.currentMarkerProperties.id;
    });

      if(faveMarker > -1) {
          $scope.favoritesList.splice(faveMarker, 1);
          localStorage.setItem('favorites', JSON.stringify($scope.favoritesList));
          $scope.isFavorited = false;
      } else {
        $scope.favoritesList.push($scope.currentMarkerProperties);
        localStorage.setItem('favorites', JSON.stringify($scope.favoritesList));
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
      $scope.currentMarkerProperties.safetyCounter--;
    } else {
      safetyList.push($scope.currentMarkerProperties.id);
      localStorage.setItem('safetyWarnings', JSON.stringify(safetyList));
      $scope.isSafetyWarn = true;
      $scope.currentMarkerProperties.safetyCounter++;
    }
  };
//////// end of controller
}]);
