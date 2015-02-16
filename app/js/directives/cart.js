'use strict';
angular.module("shopApp.cart.directives", ["shopApp.cart.services"])
    .directive('addToCart', ['cart', function (cart) {
        return {
            restrict: 'EA',
            transclude: true,
            controller: function ($scope) {
                $scope.cart = cart;
            },
            scope: {
                product: '='
            },
            template: '<button class="btn btn-default add2cart" ng-hide="cart.getItemById(product.id)" ng-click="cart.addItem(product, 1)" type="submit">Add to cart</button>' +
                      '<button class="btn btn-danger add2cart" ng-show="cart.getItemById(product.id)" ng-click="cart.removeItemById(product.id)"  type="submit">Remove</button>',
        };
    }])

        .directive('addToCartPage', ['cart', function (cart) {
            return {
                restrict: 'EA',
                transclude: true,
                controller:  function ($scope) {
                    $scope.cart = cart;
                    $scope.quantity = 1;
                },
                scope: {
                    product: '=',
                    popup: '@'
                },
                templateUrl: 'templates/addtocart-page.html',
                link: function (scope, element, attrs) {
                    scope.inCart = function () {
                        return cart.getItemById(scope.product.id);
                    };

                    if (scope.inCart()) {
                        scope.quantity = cart.getItemById(scope.product.id).getQuantity();
                    } else {
                        scope.quantity = 1;
                    }               
                }
            };
        }])

    .directive('shoppingCart', ['cart', function (cart) {
        return {
            restrict: 'EA',
            controller:  function ($scope) {
                $scope.cart = cart;
            },
            scope: {},
            templateUrl: 'templates/shopping-cart.html',           
        };
    }])

    .directive('cartSummary', ['cart',function (cart) {
        return {
            restrict: 'EA',
            controller: function ($scope) {
                $scope.cart = cart;
            },
            scope: {},
            transclude: true,
            templateUrl: 'templates/cart-summary.html'
        };
    }]);