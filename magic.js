/*  magic.js
*   Author: Vijay Soni (vs4vijay@gmail.com)
*   Hosted At: https://github.com/vs4vijay/CuCoApp
*   To Do: Can imporve the performance of App by using client side caching for
*          exchange rates.
*/

var app = angular.module('currencyApp', ['ngRoute', 'ngResource', 'multi-select']);


angular.module('currencyApp').controller('MainCtrl', ['$scope', '$q', 'CurrencyService', function($scope, $q, CurrencyService) {
  $scope.currencyModel = {
    baseCurrency: [{
      symbol : 'USD',
      name : 'United States Dollar'
    }],
    baseCurrencySymbol: 'USD',
    baseCurrencyValue: 1
  };
  $scope.convertedCurrencyList = [];
  $scope.currencyExchangeRates = {};

  var currencyObject = CurrencyService.getCurrencies().$promise.then(function(data) {
    $scope.currencyList = Object.keys(data).map(function(key) {
      return {"symbol" : key, "name" : data[key] }
    });
  });

  $scope.resetConvertedCurrencyList = function() {
    $scope.convertedCurrencyList = [];
    angular.forEach(function(value, key) {
      value.ticked = false;
    });
  };

  var convertAccordingToExchangeRate = function(inputCurrencySymbol, inputCurrencyValue, outputCurrencySymbol) {
    var deferred = $q.defer();
    CurrencyService.getExchangeRates().$promise.then(function(currencyExchange) {
      $scope.currencyExchangeRates = currencyExchange.rates;

      // As we have only access to Free API for currency, so we have to convert
      // our base currency to USD first, then from USD value we calculate
      // our output currency
      var inputCurrencyRate = $scope.currencyExchangeRates[inputCurrencySymbol];
      var outputCurrencyRate = $scope.currencyExchangeRates[outputCurrencySymbol];

      // Converting to current exchange rate using USD
      var currentCurrencyRate = outputCurrencyRate/inputCurrencyRate;

      //var outputCurrencyValue = currentCurrencyRate * inputCurrencyValue;
      deferred.resolve(currentCurrencyRate);
    }, function(error) {
      deferred.reject(error);
    });

    //Returning a promise
    return deferred.promise;
  };

  $scope.selectOutputCurrency = function(data) {
    if(data.ticked) {
      convertAccordingToExchangeRate($scope.currencyModel.baseCurrencySymbol, $scope.currencyModel.baseCurrencyValue, data.symbol).then(function(currentCurrencyRate) {

        data.currentCurrencyRate = currentCurrencyRate;
        data.value = data.currentCurrencyRate * $scope.currencyModel.baseCurrencyValue;
        $scope.convertedCurrencyList.push(data);
      });
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
  var CurrencyResource = $resource('http://openexchangerates.org/api/:operation.json', {
    operation: '@operation'
  }, {
    getCurrencies: {
      method: 'GET',
      params: {
        operation: 'currencies',
        app_id: APP_ID
      }
    }, getExchangeRates: {
      method: 'GET',
      params: {
        operation: 'latest',
        app_id: APP_ID
      }
    }
  });

  return CurrencyResource;

}]);
