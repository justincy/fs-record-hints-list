angular.module('personCard',[]);
angular.module('hlApp', ['personCard']).controller('hlController', function($window, $scope){
  $scope.showPersonCard = function(id, event){
    console.log('showPersonCard');
    $scope.personCardId = id;
    $scope.personCardTarget = c.target;
    $scope.popupwrapper = !0;
  };
});