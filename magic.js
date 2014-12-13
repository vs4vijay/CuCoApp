/* magic.js */


var app = angular.module('currencyApp', ['ngRoute', 'ngResource', 'multi-select']);


angular.module('currencyApp').controller('MainCtrl', ['$scope', 'CurrencyService', function($scope, CurrencyService) {
  $scope.viz = 'Vizay Soni';
  $scope.currencyListClone = [];
  $scope.convertedCurrencyList = [];

  var currencyObject = CurrencyService.get().$promise.then(function(data) {
    $scope.currencyList = Object.keys(data).map(function(key) {
      return {"symbol" : key, "name" : data[key] }
    });

    angular.copy($scope.currencyList, $scope.currencyListClone);
  });

  $scope.selectBaseCurrency = function(data) {
    console.log(data);
  };

  $scope.selectOutputCurrency = function(data) {
    console.log($scope.currencyModel.outputCurrencyList);
    if(data.ticked) {
      $scope.convertedCurrencyList.push(data);
    } else {
      data.ticked = false;
      var index = $scope.convertedCurrencyList.indexOf(data);
      $scope.convertedCurrencyList.splice(index, 1);
    };
  };

}]);



angular.module('currencyApp').service('CurrencyService', ['$resource', function($resource) {

  var APP_ID = '5ed697172773474a9a0188365e10c4c0';
  // URL is http://openexchangerates.org/api/latest.json?app_id=5ed697172773474a9a0188365e10c4c0
  var CurrencyResource = $resource('http://openexchangerates.org/api/currencies.json');

  return CurrencyResource;

}]);
