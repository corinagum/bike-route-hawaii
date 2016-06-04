angular.module('starter.controllers', [])

<<<<<<< HEAD
.controller('DashCtrl', function($scope) {
      $scope.footerExpand = function() {
        console.log('Footer expanded');
      };
      $scope.footerCollapse = function() {
          console.log('Footer collapsed');
      };
=======
.controller('DashCtrl', function($scope, $timeout, ionPullUpFooterState) {
      $scope.onFooterExpand = function() {
        console.log('Footer expanded');
      };
      $scope.onFooterCollapse = function() {
          console.log('Footer collapsed');
      };

      $scope.expand = function() {
        $scope.footerState = ionPullUpFooterState.EXPANDED;  
      };
>>>>>>> 251bcdc5a66c2cd08c24979cbb0625f0cfaf9fb7
  })

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
<<<<<<< HEAD
=======
})

.controller('PageCtrl', function($scope) {
   
>>>>>>> 251bcdc5a66c2cd08c24979cbb0625f0cfaf9fb7
});
