

 angular.module('starter.controllers', ['ngCordova'])

 .controller('MapCtrl',
  ['$http','$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', 'CommentService', '$location', '$ionicHistory', function($http, $ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation, CommentService, $location, $ionicHistory) {
  angular.extend($scope, {
    honolulu: {
      lat: 21.3008900859581,
      lng: -157.8398036956787,
      zoom: 15
    },
    events: {
      map : {
        enable : ['click', 'locationfound', 'dragend', 'load'],
        logic : 'broadcast'
      },
      markers : {
        enable : ['click', 'dragend', 'dragstart']
        // logic : 'emit'
      }
    },
    layers: {
      baselayers: {
        osm: {
          name: 'Default',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz'
        },
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
      iconUrl: '../img/bike-assets/bike-icon.png',
      iconSize:     [30, 30],
      // shadowUrl: 'img/leaf-shadow.png',
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [15, 0] // point from which the popup should open relative to the iconAnchor
    },
    bikeShareIconClicked: {
      iconUrl: '../img/bike-assets/bike-icon-gray.png',
      iconSize:     [30, 30],
      // shadowUrl: 'img/leaf-shadow.png',
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [15, 0] // point from which the popup should open relative to the iconAnchor
    },
    reportIcon: {
      iconUrl: '../img/bike-assets/bike-icon.png',
      iconSize:     [35, 35],
      // shadowUrl: 'img/leaf-shadow.png',
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [15, 0], // point from which the popup should open relative to the iconAnchor
      message: 'Drop the bycicle where you\'d like to see the station'
    }
  });
  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

  document.addEventListener("deviceready", updateUserLocMarker, false);


  function updateUserLocMarker (map) {
    if(isCordovaApp) {
      navigator.geolocation.getCurrentPosition(function(position){
      $ionicLoading.hide();
        if(position.coords.longitude < -158.006744|| position.coords.longitude > -157.640076|| position.coords.latitude > 21.765877 || position.coords.latitude < 21.230502){
          map.panTo({
            lat : 21.3008900859581,
            lng :  -157.8398036956787
          });
        } else {
          if(map) {
            map.panTo({
              lat : position.coords.latitude,
              lng : position.coords.longitude
            });
          }
          $scope.markers.userMarker = {
            lat : position.coords.latitude,
            lng : position.coords.longitude,
            message : 'You are here'          };
        }
        }, handleErr, {
          timeout : 10000,
          enableHighAccuracy : true
        });
    } else {
      $cordovaGeolocation
        .getCurrentPosition({timeout : 10000, enableHighAccuracy : true})
        .then(function (position) {
          $ionicLoading.hide();
          if(position.coords.longitude < -158.006744|| position.coords.longitude > -157.640076|| position.coords.latitude > 21.765877 || position.coords.latitude < 21.230502){
            map.panTo({
              lat : 21.3008900859581,
              lng :  -157.8398036956787
            });
          } else {
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
          }
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
      // function updateUserLocMarker(map) {
      //   console.log("consoleLoggingfirst", map);
      // }

      // updateUserLocMarker(map);

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
  function createMarkers(array, name){
    for(var i = 0; i < array.length; i++){
      var pointDetail;
      var showMarker;
      var pointIcon;
      showMarker = $scope.showStations;
      pointIcon = $scope.bikeShareIcon;
        $scope.markers[(name + i)] = {
        lat : array[i].lat,
        lng : array[i].long,
        icon: pointIcon,
        properties : array[i],
        };
    }
  }

  $scope.stationClicked = {
    // default values that will be changed on station click
    "lastClicked": null,
    "id": 391,
    "type": "BikeShare",
    "name": "Paki and Kalakaua",
    "description": "Station located on the gravel shoulder on the west side of Paki Avenue to the north of the intersection with Kalakaua.",
    "info": "On-Street in Place of Parking",
    "fid": 0,
    "site_id": "0027_011",
    "street": "Paki Avenue",
    "side": "W",
    "lat": 21.2609380183713,
    "long": -157.81827587802,
    "geolink": "https://www.google.com/maps/@21.2607781,-157.8181971,3a,75y,331.63h,59.46t/data=!3m6!1e1!3m4!1s5GecKEKkbvn9xE21RYW_tw!2e0!7i13312!8i6656",
    "sitelink": null,
    "photolink": null,
    "upDownVote": null,
    "votesCounter": null,
    "safetyCounter": null,
    "createdAt": "2016-02-29T22:11:46.561Z",
    "updatedAt": "2016-02-29T22:11:46.561Z"
  };

  function sortByClosest(array){
    array.sort(function(a,b){
      return a.distance - b.distance;
    });
  }

 $scope.updateDistanceFromMarker = function(marker, array){
    array.forEach(function(item){
      item.distance = L.latLng([marker.lat, marker.long]).distanceTo([item.lat, item.lng]);
    });
    sortByClosest(array);
  };

  $scope.updateClosestBBB = function(){
    $scope.closestBBB = bbbList.slice(0,5);

    // leafletData.getMap().then(function(map){

    // var RedIcon = L.Icon.Default.extend({
    //     options: {
    //       iconUrl: './../img/bike-assets/userMarker.png',
    //       iconSize:[24, 32],
    //       shadowSize:   [42, 32]
    //     }
    //  });
    // var redIcon = new RedIcon();
    //   L.marker([leafEvent.latitude, leafEvent.longitude], {icon: redIcon}).addTo(map)
    //   .bindPopup("You are here!").openPopup();
    // });


  };


  $scope.stationWalkTime = function(marker, station){
    return Math.round(L.latLng([$scope.stationClicked.lat, $scope.stationClicked.long]).distanceTo($scope.places[place]) * (60/15500));
  };

  $scope.rideTime = function(place){
    return Math.round(L.latLng([$scope.stationClicked.lat, $scope.stationClicked.long]).distanceTo($scope.places[place]) * (60/15500));
  };

  $scope.places = {
    kakaako : [21.296586, -157.860886],
    alamoana : [21.290763, -157.843645],
    university : [21.296760, -157.821071],
    waikiki : [21.275413, -157.824987],
    downtown : [21.309355, -157.860274],
    diamondhead: [21.260855, -157.817874]
  };


  $scope.showDetailHeader = false;

  $scope.$on('leafletDirectiveMarker.map.click', function(event,args){
    if(args.modelName !== 'reportPoint'){
      if($scope.stationClicked.lastClicked){
        $scope.markers[$scope.stationClicked.lastClicked].icon = $scope.bikeShareIcon;
      }
      $scope.markers[args.modelName].icon = $scope.bikeShareIconClicked;
      $scope.stationClicked = $scope.markers[args.modelName].properties;
      $scope.stationClicked.lastClicked = args.modelName;
      $scope.updateDistanceFromMarker($scope.stationClicked, bbbList);
      $scope.updateClosestBBB();
      $scope.showDetailHeader = true;
    }
  });

  $scope.hideDetailHeader = function () {
    $scope.showDetailHeader = false;
  };

  function setMarkersReturned(data){
    createMarkers(data, 'bikeShare');
  }


  //FIND POINTS IN RADIUS ON LOCATION FOUND
  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    $ionicLoading.hide();
    var leafEvent = args.leafletEvent;
    $scope.center.autoDiscover = true;

    leafletData.getMap().then(function(map){

    var RedIcon = L.Icon.Default.extend({
        options: {
          iconUrl: './../img/bike-assets/userMarker.png',
          iconSize:[24, 32],
          shadowSize:   [42, 32]
        }
     });
    var redIcon = new RedIcon();
      L.marker([leafEvent.latitude, leafEvent.longitude], {icon: redIcon}).addTo(map)
      .bindPopup("You are here!").openPopup();
    });

  });

  setMarkersReturned(bikesharePoints);

  $scope.$on('leafletDirectiveMap.map.load', function(event, args){
    leafletData.getMap()
    .then(function(map){
      new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Google()
      }).addTo(map);
    });
  });

  // IF CREATING NEW REPORT/SUGGEST POINT
  $scope.showReportControl = false;

  // ADD REPORT/SUGGESTION POINT
  $scope.createReportPoint = function(){
    $scope.showReportControl = true;
    var reportPoint = {
        lat: $scope.center.lat,
        lng: $scope.center.lng,
        message: "Drop the bicycle where you'd like to see a bike station",
        focus: true,
        draggable: true,
        icon : $scope.reportIcon
      };
    $scope.markers ={
      reportPoint : reportPoint
    };
  };

  // CANCEL REPORT POINT
  $scope.cancelReportPoint = function(){
    $scope.showReportControl = false;
    setMarkersReturned(bikesharePoints);
    delete $scope.markers.reportPoint;
  };

  // COMMENT SUBMIT FUNCTION
  $scope.postComment = function(comment){
    if($scope.showReportControl){
      PointService.addPoint({
        type : "ReportSuggest",
        lat : $scope.markers.reportPoint.lat,
        long : $scope.markers.reportPoint.lng
      })
      .then(function(data){
        CommentService.addComment(comment, data.data.newId)
        .then(function(data){
          $scope.cancelReportPoint();
          $scope.closeModal(5);
        });
      });
    } else {
      CommentService.addComment(comment, $scope.currentMarkerProperties.id)
      .then(function(data){
        $scope.closeModal(5);
      });
    }
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
  $ionicModal.fromTemplateUrl('templates/feedback/fbckBtns.html', {
      id       : '1',
      scope    : $scope,
      animation: 'scale-in'
    }).then(function(modal) {
      $scope.modal1 = modal;
    });

  $ionicModal.fromTemplateUrl('templates/feedback/fbackForm.html', {
    id       : '2',
    scope    : $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/feedback/mahaloFeedback.html', {
    id       : '3',
    scope    : $scope,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal3 = modal;
  });

  // // MODAL FOR LANDMARK LISTS
  $ionicModal.fromTemplateUrl('markerDetail.html', {
    id: '4',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal4 = modal;
  });

  // $ionicModal.fromTemplateUrl('reportDetail.html', {
  //   id: '5',
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal5 = modal;
  // });

  // $ionicModal.fromTemplateUrl('bikeRackList.html', {
  //   id: '6',
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal6 = modal;
  // });

  // $ionicModal.fromTemplateUrl('favorites.html', {
  //   id: '7',
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal7 = modal;
  // });

  // $ionicModal.fromTemplateUrl('inputFeedbackForm.html', {
  //     id       : '8',
  //     scope    : $scope,
  //     animation: 'slide-in-up'
  //   }).then(function(modal) {
  //     $scope.modal8 = modal;
  //   });

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
                break;
      case 8 : $scope.modal8.show();
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
                break;
      case 8 : $scope.modal8.hide();
    }
  };

  //REMOVE MODAL WHEN DESTROYED
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });

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


  //ICON CHANGE ON-CLICK
  $scope.isCollapsed = true;
  $scope.benCollapsed = true;

////////////////////////////////////////////////////////////

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.class = "wholeModalDiv";
  $scope.changeClass = function(){
    if ($scope.class === "wholeModalDiv")
      $scope.class = "blue";
    else
      $scope.class = "wholeModalDiv";
  };


  //>>>>>>>>>>>> POPOVER EVENT

  // $ionicPopover.fromTemplateUrl('inputFeedbackForm.html', {
  //   scope: $scope
  // }).then(function(popover) {
  //   $scope.popover = popover;
  // });

  // $scope.openPopover = function($event) {
  //   $scope.popover.show($event);
  // };
  // $scope.closePopover = function() {
  //   $scope.popover.hide();
  // };
  // //Cleanup the popover when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.popover.remove();
  // });
  // // Execute action on hide popover
  // $scope.$on('popover.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove popover
  // $scope.$on('popover.removed', function() {
  //   // Execute action
  // });

//////// end of controller
}]);
