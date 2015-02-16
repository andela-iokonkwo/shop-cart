/***
Metronic AngularJS App Main Script
***/
angular.module("shopApp.settings", []).constant('ngSettings', {
    apiServiceBaseUri: "http://shop-cart-api.azurewebsites.net/api/",
    //apiServiceBaseUri: "http://localhost:35140/api/",
    clientId: 'ngCartApp'
});
/* Metronic App */
var shopApp = angular.module("shopApp", [
    "ui.router", 
    "ui.bootstrap",  
    "ngSanitize",
    "toaster",
    "shopApp.admin",
    "shopApp.cart.services",
    "shopApp.cart.directives",
    "shopApp.directives",
    "shopApp.controllers",
    "shopApp.filters",
    "shopApp.settings"
]);

/* Setup Rounting For All Pages */
shopApp.config(['$stateProvider', '$urlRouterProvider', '$provide', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $provide, $locationProvider) {
    // Redirect any unmatched url
    $provide.decorator('$state', function ($delegate, $stateParams) {
        $delegate.forceReload = function () {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/home",
            templateUrl: "views/home.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "HomeController",            
        })
        .state('cart', {
            url: "/shopping-cart",
            templateUrl: "views/cart.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "HomeController",
        })
        .state('product', {
            url: "/products/:id",
            templateUrl: "views/product.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "ProductController",
        })
        .state('category', {
            url: "/category/:id",
            templateUrl: "views/category.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "CategoryController",            
        })
        .state('admin', {
            url: '/admin',
            abstract: true
        })
        .state('admin-category', {
            url: '/admin/category/:Id', 
            templateUrl: 'views/admin/single-category-products.html',
            controller: 'adminCategoryCtrl'
        })
        .state('admin-new-category', {
            url: '/new-category',
            templateUrl: 'views/admin/new-category.html',
            controller: 'NewCategoryCtrl'
        })

    $urlRouterProvider.otherwise("/home");
    //$locationProvider.html5Mode(true).hashPrefix('!');

}]);


shopApp.run(['$rootScope', 'cart', 'cartItem', 'store', function ($rootScope, cart, ngCartItem, store) {
    
    $rootScope.$on('cart:change', function () {
        cart.$save();
    });

    if (angular.isObject(store.get('cart'))) {
        cart.$restore(store.get('cart'));

    } else {
        cart.init();
    }
    cart.setTaxRate(5);
    cart.setShipping(500);
}])