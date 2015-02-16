shopControllers = angular.module("shopApp.controllers", []);
shopControllers.controller('ProductController', ['$scope', 'ngSettings', '$http', '$stateParams', function ($scope, ngSettings, $http, params) {

    $scope.options = {
        pagination: false,
        navigation: true,
        items: 5,
        addClassActive: true,
        itemsCustom: [
            [0, 1],
            [320, 1],
            [480, 2],
            [660, 2],
            [700, 3],
            [768, 3],
            [992, 4],
            [1024, 4],
            [1200, 5],
            [1400, 5],
            [1600, 5]
        ],
    }

    $scope.product = {};
    $http.get(ngSettings.apiServiceBaseUri + 'Products/' + params.id).then(function (result) {
        $scope.product = result.data;
    })
}]);

shopControllers.controller('HomeController', ['$scope', '$timeout', 'ngSettings', '$http', '$filter', function ($scope, $timeout, ngSettings, $http, $filter) {

    $scope.options = {
        pagination: false,
        navigation: true,
        items: 5,
        addClassActive: true,
        itemsCustom: [
            [0, 1],
            [320, 1],
            [480, 2],
            [660, 2],
            [700, 3],
            [768, 3],
            [992, 4],
            [1024, 4],
            [1200, 5],
            [1400, 5],
            [1600, 5]
        ],
    }

    $scope.products = {};
    $http.get(ngSettings.apiServiceBaseUri + 'products/for-homepage').then(function (result) {
        $scope.products = result.data;
    })
}]);

shopControllers.controller('CategoryController', ['$scope', '$http', 'ngSettings', '$stateParams', function ($scope, $http, ngSettings, params) {
    $scope.products = {};
    $scope.length = 0;
    $scope.Name = params.id.split('_')[0];
    $http.get(ngSettings.apiServiceBaseUri + 'category/' + params.id.split('_')[1] + '/products').then(function (result) {
        $scope.length = result.data.length;
        $scope.products = chunks(result.data, 4);       
    })

    var chunks = function (array, size) {
        var results = [];
        while (array.length) {
            results.push(array.splice(0, size));
        }
        return results;
    };
}]);