

 angular.module('starter.controllers', ['ngCordova'])

 .controller('MapCtrl',
  ['$http','$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', 'CommentService', '$location', '$ionicHistory', '$ionicSideMenuDelegate', function($http, $ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation, CommentService, $location, $ionicHistory,$ionicSideMenuDelegate) {


    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight();
    };

    // console.log("mapctrl started", UserService.getUser());
    // if(UserService.getUser() === null){
    //   console.log("no user, made one");
    //   UserService.create()
    //   .then(function(data){
    //     UserService.updateUser(data.data.user);
    //     console.log("user created and updated to ", UserService.getUser());
    //   });
    // }

    // $scope.userStart = function(){
    //   UserService.create()
    //   .then(function(data){
    //     UserService.updateUser(data.data.user);
    //     console.log("user created and updated to", UserService.getUser());
    //   });
    // };

    // UPDATE SURVEY QUESTIONS IN DB
    // $scope.updateSurvey = function(u) {
    //   $scope.user = UserService.getUser();
    //   $scope.user.age = u.age;
    //   $scope.user.gender = u.gender;
    //   $scope.user.zipcode = u.zipcode;
    //   UserService.updateUser($scope.user);
    //   UserService.edit($scope.user.id);
    // };

    $scope.updatePath = function(path){
      if(UserService.getUser() === null){
        console.log("no user, made one");
        UserService.create()
        .then(function(data){
          UserService.updateUser(data.data.user);
          console.log("user updated to ", UserService.getUser());
        });

      }
      $scope.user = UserService.getUser();
      console.log("updatePath user ", UserService.getUser());
      if($scope.user.paths !== null){
        $scope.user.paths.push(path);
      }else{
        $scope.user.paths = [path];
      }
      UserService.edit($scope.user.id)
      .then(function(data){
        console.log("update data", data);
        UserService.updateUser($scope.user);
      });
    };

  // SET MAP INTIALLY
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
        enable : ['click', 'dragend', 'dragstart'],
        logic : 'emit'
      }
    },
    layers: {
      baselayers: {
        osm: {
          name: 'Default',
          url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          type: 'xyz'
        },
      }
    },
    defaults: {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: true,
      maxNativeZoom: 18,
      maxZoom : 18,
      inertiaMaxSpeed: 150
    },
    center : {
      lat: 21.3008900859581,
      lng: -157.8398036956787,
      zoom: 15,
    },
    controls: {},
    markers : {},
    bikeShareIcon: {
      iconUrl: '../img/bike-assets/bike-icon.png',
      iconSize:     [30, 30],
      // shadowUrl: 'img/leaf-shadow.png',
      shadowSize:   [50, 64],
      iconAnchor:   [0, 0],
      shadowAnchor: [4, 62],
      popupAnchor:  [15, 0]
    },
    bikeShareIconClicked: {
      iconUrl: '../img/bike-assets/bike-icon-gray.png',
      iconSize:     [30, 30],
      // shadowUrl: 'img/leaf-shadow.png',
      shadowSize:   [50, 64],
      iconAnchor:   [0, 0],
      shadowAnchor: [4, 62],
      popupAnchor:  [15, 0]
    },
    reportIcon: {
      iconUrl: '../img/bike-assets/Bike Yellow copy.png',
      iconSize:     [35, 35],
      // shadowUrl: 'img/leaf-shadow.png',
      shadowSize:   [50, 64],
      iconAnchor:   [0, 0],
      shadowAnchor: [4, 62],
      popupAnchor:  [15, 0],
      className: 'bikeIconSuggestion',
      message: 'Drop the bycicle where you\'d like to see the station'
    }
  });
  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

  document.addEventListener("deviceready", updateUserLocMarker, false);


  function updateUserLocMarker (map) {
    if(isCordovaApp) {
      navigator.geolocation.getCurrentPosition(function(position){
      $ionicLoading.hide();
        console.log("loc marker is cordova app");
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
          timeout : 6000,
          enableHighAccuracy : true
        });
    } else {
      $cordovaGeolocation
        .getCurrentPosition({timeout : 6000, enableHighAccuracy : true})
        .then(function (position) {
          $ionicLoading.hide();
          console.log("loc marker is not cordova app");
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

  $scope.foundLocation = false;

  function onLocationError(e) {
      alert(e.message);
  }

  $scope.findCenter = function(){
    leafletData.getMap().then(function(map){

      $scope.show($ionicLoading);
      map.locate({setView: true})
      .on('onlocationerror', function(e){
         console.log(e);
         alert("Location access denied.");
       });
      // updateUserLocMarker();
      $scope.foundLocation = true;
    });

  };


  //  INITIALIZE FILTERS TO SHOW MARKERS
  $scope.showStations = true;

  // TOGGLE FILTERS
  $scope.setShowStations = function(){
    $scope.showStations = !$scope.showStations;
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

  // default values that will be changed on station click
  $scope.stationClicked = {
    // "lastClicked": null,
    // "id": 391,
    // "type": "BikeShare",
    // "name": "Paki and Kalakaua",
    // "description": "Station located on the gravel shoulder on the west side of Paki Avenue to the north of the intersection with Kalakaua.",
    // "info": "On-Street in Place of Parking",
    // "fid": 0,
    // "site_id": "0027_011",
    // "street": "Paki Avenue",
    // "side": "W",
    // "lat": 21.2609380183713,
    // "long": -157.81827587802,
    // "geolink": "https://www.google.com/maps/@21.2607781,-157.8181971,3a,75y,331.63h,59.46t/data=!3m6!1e1!3m4!1s5GecKEKkbvn9xE21RYW_tw!2e0!7i13312!8i6656",
    // "sitelink": null,
    // "photolink": "https://s3-us-west-2.amazonaws.com/bikesharesites/stationPhotos/0985_003.jpg",
    // "upDownVote": null,
    // "votesCounter": null,
    // "safetyCounter": null,
    // "createdAt": "2016-02-29T22:11:46.561Z",
    // "updatedAt": "2016-02-29T22:11:46.561Z"
  };

  // CHECK IF STATION IS LIKED BY USER
  $scope.isLiked = function(){
    $scope.user = UserService.getUser();
    if($scope.user.liked === null || undefined){
      console.log("in null");
      return false;
    } else {
      if($scope.user.liked.indexOf($scope.stationClicked.id) === -1){
        console.log("in indexOf -1");
        return false;
      } else {
        console.log("in found indexOf");
        return true;
      }
    }
  };

  // IF USER LIKED COLOR IS RED, UPDATE USER MODEL
  $scope.userLiked = function(){
    $scope.myStyle={color:'red'};
    if($scope.user.liked === null || undefined){
      $scope.user.liked = [$scope.stationClicked.id];
    }else{
      $scope.user.liked.push($scope.stationClicked.id);
    }
    UserService.updateUser($scope.user);
    UserService.edit($scope.user.id);
  };

  // USER UNLIKED, CHANGE ICON TO BLANK, UPDATE USER MODEL
  $scope.userUnliked = function(){
    $scope.myStyle={};
    $scope.user.liked.splice($scope.user.liked.indexOf($scope.stationClicked.id),1);
    UserService.updateUser($scope.user);
    UserService.edit($scope.user.id);
  };

  function sortByClosest(array){
    array.sort(function(a,b){
      // console.log("consoleLogging", array);
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


  function setMarkersReturned(data){
    createMarkers(data, 'bikeShare');
  }

  //FIND POINTS IN RADIUS ON LOCATION FOUND
  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    $ionicLoading.hide();
    console.log("location found", event, args);
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
        provider: new L.GeoSearch.Provider.Google({
          // bounds : 21.221181|-158.381653|21.725976|-157.592010
        })
      }).addTo(map);

      map.addControl(L.control.sidebar('sidebar', {
          position: 'left'
      }));

    });
  });

  // IF CREATING NEW REPORT/SUGGEST POINT
  // $scope.showReportControl = false;


  // LIKE MULITPLE STATIONS
  $scope.likeMultiStations = function () {
    $scope.showBulkLikeFooter = true;
  };


  $scope.closeBulkLiking = function () {
    $scope.showBulkLikeFooter = false;
  };

  // ADD REPORT/SUGGESTION POINT
  $scope.createReportPoint = function(){
      $scope.showReportControl = true;
      var reportPoint = {
          lat: $scope.center.lat,
          lng: $scope.center.lng,
          // message: "Drop the bicycle where you'd</br> like to see a bike station",
          focus: true,
          draggable: true,
          icon : $scope.reportIcon
        };

      $scope.markers ={
        reportPoint : reportPoint
      };

    setMarkersReturned(bikesharePoints);
  };

  // CANCEL REPORT POINT
  $scope.cancelReportPoint = function(){
    $scope.showReportControl = false;
    setMarkersReturned(bikesharePoints);
    delete $scope.markers.reportPoint;
  };

  $scope.suggestStation = function(){
    if($scope.markers.reportPoint){
      $scope.markers.reportPoint.type = "suggest";
      $scope.markers.reportPoint.suggestedBy = UserService.getUser().id;
      PointService.suggestPoint($scope.markers.reportPoint);
      console.log("suggested point stored");
    }
  };

  // COMMENT SUBMIT FUNCTION
  // $scope.postComment = function(comment){
  //   if($scope.showReportControl){
  //     PointService.addPoint({
  //       type : "ReportSuggest",
  //       lat : $scope.markers.reportPoint.lat,
  //       long : $scope.markers.reportPoint.lng
  //     })
  //     .then(function(data){
  //       CommentService.addComment(comment, data.data.newId)
  //       .then(function(data){
  //         $scope.cancelReportPoint();
  //         $scope.closeModal(6);
  //       });
  //     });
  //   } else {
  //     CommentService.addComment(comment, $scope.currentMarkerProperties.id)
  //     .then(function(data){
  //       $scope.closeModal(6);
  //     });
  //   }
  // };

  //PROPERTIES FOR CHECKBOX IN TAB-HOME.HTML
  // $scope.pinTypes = [
  //     { text: "Bike Share", checked: true },
  //     { text: "Landmark", checked: false },
  //     { text: "Bike Rack", checked: false }
  //   ];

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

    $scope.user = UserService.getUser();
    if(args.modelName !== 'reportPoint'){
      if($scope.stationClicked.lastClicked){
        $scope.markers[$scope.stationClicked.lastClicked].icon = $scope.bikeShareIcon;
      }
      $scope.markers[args.modelName].icon = $scope.bikeShareIconClicked;
      $scope.stationClicked = $scope.markers[args.modelName].properties;
      $scope.stationClicked.lastClicked = args.modelName;
      $scope.updateDistanceFromMarker($scope.stationClicked, bbbList);
      $scope.updateClosestBBB();
      $scope.openModal(4);
      // $scope.sidebar.show();

    }
    if($scope.user.liked === null || undefined){
      $scope.myStyle = {};
    } else {
      if($scope.user.liked.indexOf($scope.stationClicked.id) === -1){
        $scope.myStyle={};
      } else {
        $scope.myStyle={color:'red'};
      }
    }
  });




  //////// BEGINNIG of MODAL ////////

  $ionicModal.fromTemplateUrl('templates/feedback/markerDetail.html', {
    id: '4',
    scope: $scope,
    // backdropClickToClose: false,
    hardwareBackButtonClose: false,
    // animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal4 = modal;
  });

if(!isCordovaApp){
  $ionicModal.fromTemplateUrl('yourSuggestionSave.html', {
    id: '3',
    scope: $scope,
    backdropClickToClose: false,
    hardwareBackButtonClose: false,
    animation: 'scale-in'
  }).then(function(modal) {
    $scope.modal3 = modal;
  });
}

  $scope.openModal = function(index) {
    switch (index) {
      case 1 : $scope.modal1.show();
                break;
      case 2 : $scope.modal2.show();
                break;
      case 3 : $scope.modal3.show();
                break;
      case 4 : $scope.modal4.show();
    }
  };

   $scope.closeModal = function(index) {
    // window.location.reload(true);
    switch (index) {
      case 1 : $scope.modal1.hide();
                break;
      case 2 : $scope.modal2.hide();
                break;
      case 3 : $scope.modal3.hide();
                break;
      case 4 : $scope.modal4.hide();
    }
  };

  //REMOVE MODAL WHEN DESTROYED
  $scope.$on('$destroy', function() {
    if($scope.modal){
      $scope.modal.remove();
    }
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


  //ICON CHANGE ON-CLICK
  $scope.isCollapsed = true;
  $scope.benCollapsed = true;

////////////////////////////////////////////////////////////

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

//////// end of controller
}])
.controller('LandingCtrl', ['$scope', 'UserService', function($scope, UserService) {
  console.log("LandingCtrl");

  $scope.userStart = function(){
    if(UserService.getUser() !== null || undefined){
        console.log("resetting user");
        UserService.updateUser(null);
      }
      UserService.create()
      .then(function(data){
        UserService.updateUser(data.data.user);
        console.log("user created ", UserService.getUser());
      });
    // if(UserService.getUser() !== null || undefined){
    //   console.log("resetting user");
    //   UserService.updateUser(null);
    // }
      // UserService.create()
      // .then(function(data){
      //   UserService.updateUser(data.data.user);
      //   console.log("user updated to ", UserService.getUser());
      // });
  };
}])
.controller('FormCtrl', ['$scope', 'UserService', '$ionicHistory', function($scope, UserService, $ionicHistory) {
  console.log("FormCtrl");

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.update = function(u) {
    if(UserService.getUser() === null){
      console.log("no user, made one");
      UserService.create()
      .then(function(data){
        UserService.updateUser(data.data.user);
        console.log("created user and updated to ", UserService.getUser());
      });
    }
    $scope.user = UserService.getUser();
    if(u){
      if(u.name){
        $scope.user.name = u.name;
        u.name = null;
      }
      if(u.email){
        $scope.user.email = u.email;
        u.email = null;
      }
      if(u.commentType){
        if($scope.user.commentType === null || undefined){
          $scope.user.commentType = [u.commentType];
          u.commentType = null;
        }else{
          $scope.user.commentType.push(u.commentType);
          u.commentType = null;
        }
      }
      if(u.comment){
        if($scope.user.comment !== null || undefined){
          $scope.user.comment.push(u.comment);
          u.comment = null;
        }else{
          $scope.user.comment = [u.comment];
          u.comment = null;
        }
      }
      if(u.age){
        $scope.user.age = u.age;
        u.age = null;
      }
      if(u.gender){
        $scope.user.gender = u.gender;
        u.gender = null;
      }
      if(u.zipcode){
        $scope.user.zipcode = u.zipcode;
        u.zipcode = null;
      }
      UserService.updateUser($scope.user);
      UserService.edit($scope.user.id);
    }
  };

}])
.controller('PathCtrl', ['$scope', 'UserService', '$ionicHistory', function($scope, UserService, $ionicHistory) {
  console.log("PathCtrl");
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
  $scope.updatePath = function(path){
    if(UserService.getUser() === null){
      console.log("no user, made one");
      UserService.create()
      .then(function(data){
        UserService.updateUser(data.data.user);
        console.log("user updated to ", UserService.getUser());
      });

    }
    $scope.user = UserService.getUser();
    console.log("updatePath user ", UserService.getUser());
    if($scope.user.paths !== null){
      $scope.user.paths.push(path);
    }else{
      $scope.user.paths = [path];
    }
    UserService.edit($scope.user.id)
    .then(function(data){
      console.log("update data", data);
      UserService.updateUser($scope.user);
    });
  };
}])
.controller('MahaloCtrl', ['$scope', 'UserService', function($scope, UserService) {
  console.log("MahaloCtrl");
  $scope.updatePath = function(path){
    if(UserService.getUser() === null){
      console.log("no user, made one");
      UserService.create()
      .then(function(data){
        UserService.updateUser(data.data.user);
        console.log("user updated to ", UserService.getUser());
      });
    }
    $scope.user = UserService.getUser();
    if($scope.user.paths !== null){
      $scope.user.paths.push(path);
    }else{
      $scope.user.paths = [path];
    }
    UserService.edit($scope.user.id)
    .then(function(data){
      UserService.updateUser($scope.user);
    });
  };

  $scope.clearUser = function(){
    UserService.updateUser(null);
  };
}]);
