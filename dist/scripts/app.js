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

angular.module('shopApp.admin', ['angularFileUpload', 'ui.bootstrap', ])
    .controller('adminCategoryCtrl', ['$scope', '$filter', '$http', 'ngSettings', '$stateParams', '$modal', '$location', '$state', 'toaster','$timeout',
        function ($scope, $filter, $http, ngSettings, routeParams, $modal, $location, $state, toast, $timeout) {
      var init;
      var url = ngSettings.apiServiceBaseUri;
      $scope.allProducts = [];      
      $scope.SelectedCategory = routeParams.Id.split('-')[0];
      $scope.searchKeywords = '';
      $scope.filteredProducts = [];
      $scope.row = '';
      $scope.select = function(page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;
        return $scope.products = $scope.filteredProducts.slice(start, end);
      };
      $scope.onFilterChange = function() {
        $scope.select(1);
        $scope.currentPage = 1;
        return $scope.row = '';
      };
      $scope.onNumPerPageChange = function() {
        $scope.select(1);
        return $scope.currentPage = 1;
      };
      $scope.onOrderChange = function() {
        $scope.select(1);
        return $scope.currentPage = 1;
      };
      $scope.search = function() {
          $scope.filteredProducts = $filter('filter')($scope.allProducts, $scope.searchKeywords);
        return $scope.onFilterChange();
      };
      $scope.order = function(rowName) {
        if ($scope.row === rowName) {
          return;
        }
        $scope.row = rowName;
        $scope.filteredProducts = $filter('orderBy')($scope.allProducts, rowName);
        return $scope.onOrderChange();
      };
      $scope.numPerPageOpt = [3, 5, 10, 20];
      $scope.numPerPage = $scope.numPerPageOpt[2];
      $scope.currentPage = 1;
      $scope.products = [];
      init = function() {
        $scope.search();
        return $scope.select($scope.currentPage);
      };
      console.log(routeParams.Id);
      var id = routeParams.Id.split('-')[1];
      $http.get(url + 'category/' + id + '/products').then(function (result) {
          $scope.allProducts = result.data;
          console.log(result.data);
          init();
      });
     
      $scope.delete = function () {
          $http.delete(url + 'categories/' + id).then(function (result) {
              $scope.allProducts = result.data;
              console.log(result.data);
              toast.pop('success', "Category Delete", "Category Deleted Successfully");
              $location.path('/');
          });
      }
      $scope.hasDeletedProduct;
      $scope.deleteProd = function (id) {
          $http.delete(url + 'products/' + id).then(function (result) {
              toast.pop('success', "Product Delete", "Product Deleted Successfully");
              $scope.hasDeletedProduct = true;
              $timeout(function () {
                  $state.forceReload();
              })
          });
      }

      $scope.editProduct = function (productToEdit) {
          $scope.modalInstance = $modal.open({
              templateUrl: 'views/admin/edit-product.html',
              controller: 'EditProductCtrl',
              resolve: {
                  product: function () {
                      return productToEdit;
              }
          }
          });
          $scope.modalInstance.result.then(function () {
              console.log('Modal dismissed at: ' + new Date());
              $scope.okModal = true;
              $timeout(function () {
                  $state.forceReload();
              });
          }, function () {
              $scope.cancelModal = true;
              console.log('Modal dismissed at: ' + new Date());
          });
      }

      $scope.addProduct = function () {
          $scope.modalInstance = $modal.open({
              templateUrl: 'views/admin/add-product.html',
              controller: 'AddProductCtrl'           
          });
          $scope.modalInstance.result.then(function () {
              console.log('Modal dismissed at: ' + new Date());
              $scope.okModal = true;
              $timeout(function () {
                  $state.forceReload();
              });
          }, function () {
              $scope.cancelModal = true;
              console.log('Modal dismissed at: ' + new Date());
          });
      }
    }
    ]).controller('AddProductCtrl', ['$scope','$modalInstance','$timeout','$upload','toaster','ngSettings','$stateParams',
function ($scope, $modalInstance, $timeout, $upload, toast, ngAuthSettings, routeParams) {
    var cId = routeParams.Id.split('-')[1];
    $scope.product = { CategoryId: cId };;
    $scope.modalInstance = $modalInstance;

    $scope.selectedFiles = null;


    $scope.fileReaderSupported = window.FileReader != null;
    $scope.uploadRightAway = false;

    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.cancel = function(l){
        $modalInstance.dismiss('cancel');
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for ( var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                function setPreview(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }
                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };
    $scope.hasUploaded = false;
    $scope.save = function() {
        $scope.progress[0] = 0;
        var prod = angular.copy($scope.product, {});
        console.log(prod);
        $scope.upload[0] = $upload.upload({
            //url: ngAuthSettings.apiServiceBaseUri + 'api/products/product-image-upload',
            url: ngAuthSettings.apiServiceBaseUri + 'products',
            method: 'POST',
            headers: { },
            data: {product: prod},
            file: $scope.selectedFiles[0]
        }).progress(function (evt) {
                // get upload percentage
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                toast.pop('success', "Product Upload", "Product Uploaded Successfully");
                //prod.Image_Url = data.image_Url;
                console.log(data);
                $modalInstance.close(data);
            
            }).error(function (data, status, headers, config) {
            toast.pop('error', data);
            $scope.hasFailed = true;
        });

    }
}])
    .controller('EditProductCtrl', ['$scope', '$modalInstance', '$timeout', '$http', 'toaster', 'ngSettings', '$stateParams','product',
function ($scope, $modalInstance, $timeout, $http, toast, ngAuthSettings, routeParams, product) {
    $scope.product = product;
    $scope.modalInstance = $modalInstance;
    $scope.cancel = function (l) {
        $scope.hasCanceled = true;
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function () {
        var prod = angular.copy($scope.product, {});
        console.log(prod);
        $http.put(ngAuthSettings.apiServiceBaseUri + 'products/' + prod.id, prod).then(function (result) {
            console.log(result);
            $scope.hasEdited = true;
            toast.pop('success', "Product Edit", "Product Edited Successfully");
            $modalInstance.close(result.data);
        }, function () {
            $scope.hasEdited = false;
            toast.pop('error', "Product Edit", "There was an error while editing product.");
            $modalInstance.dismiss('cancel');
        });

    }
}]).controller('NewCategoryCtrl', ['$scope', '$timeout', '$upload', 'toaster', 'ngSettings',
function ($scope, $timeout, $upload, toast, ngAuthSettings) {
    $scope.category = {};
    $scope.selectedFiles = null;


    $scope.fileReaderSupported = window.FileReader != null;
    $scope.uploadRightAway = false;

    $scope.hasUploader = function (index) {
        return $scope.upload[index] != null;
    };
    $scope.cancel = function (l) {
        $modalInstance.dismiss('cancel');
    };
    $scope.abort = function (index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.onFileSelect = function ($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if (window.FileReader && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                function setPreview(fileReader, index) {
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }
                setPreview(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.save = function () {
        $scope.progress[0] = 0;
        var category = angular.copy($scope.category, {});
        console.log($scope.category);
        $scope.upload[0] = $upload.upload({
            //url: ngAuthSettings.apiServiceBaseUri + 'api/products/product-image-upload',
            url: ngAuthSettings.apiServiceBaseUri + 'categories',
            method: 'POST',
            headers: {},
            data: { category: category },
            file: $scope.selectedFiles[0]
        }).progress(function (evt) {
            // get upload percentage
            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (data, status, headers, config) {
            // file is uploaded successfully
            toast.pop('success', "Product Upload", "Product Uploaded Successfully");
            $scope.hasUploaded = true;

            console.log(data);

        }).error(function (data, status, headers, config) {
            toast.pop('error', "Product upload", "There was an error while uploading product.");
            $scope.hasUploaded = false;

            // file failed to upload
            console.log(data);
        });

    }
}]);


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
shopDirectives = angular.module("shopApp.directives", []);

// Route State Load Spinner(used on page or content load)
shopDirectives.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        //Layout.scrollTop(); // scroll to the top on content load
                    }, true);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
shopDirectives.directive('a', function () {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
shopDirectives.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});


shopDirectives.directive('fancyBox', ['$compile', '$http', function ($compile, $http) {
    return {
        restrict: 'A',
        controller: function ($scope) {
            $scope.openFancybox = function (url) {
                $http.get(url).then(function (response) {
                    if (response.status == 200) {
                        var template = angular.element(response.data);
                        var compiledTemplate = $compile(template);
                        compiledTemplate($scope);
                        $.fancybox({ content: template, type: 'html' });
                    }
                });
            };
        }
    };
}]);


shopDirectives.directive('fancyImageBox',['$compile', '$timeout',  function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    }
}]);

shopDirectives.directive('layerSlider',['$compile', '$timeout',  function ($compile, $timeout) {
    return {
        //restrict: 'AE',
        //templateUrl: 'templates/slider.html',
        link: function ($scope, element, attrs) {
            element.layerSlider({
                skinsPath: 'layerslider/skins/',
                skin: 'fullwidth',
                thumbnailNavigation: 'hover',
                hoverPrevNext: false,
                responsive: false,
                responsiveUnder: 960,
                layersContainer: 960
            });
        }
    }
}]);

shopDirectives.directive('sliderRange', ['$compile', '$timeout',  function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.slider({
                range: true,
                min: 0,
                max: 500,
                values: [50, 250],
                slide: function (event, ui) {
                    $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                }
            });
            $("#amount").val("$" + element.slider("values", 0) +
            " - $" + element.slider("values", 1));
        }
    }
}]);

//shopDirectives.directive('imageZoom', function ($compile, $timeout) {
//    return {
//        link: function ($scope, element, attrs) {
//            element.zoom({ url: $('.product-main-image img').attr('data-BigImgSrc') });
//        }
//    }
//});

shopDirectives.directive('imageZoom', ['$timeout', function ($timeout) {
    return {     
        link: function (scope, element, attrs) {
            $timeout(function () {
                element.zoom({ url: $('.product-main-image img').attr('data-BigImgSrc') });
            });
        }
    };
}]);

shopDirectives.directive('touchSpinCart', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.val($scope.cartItem.getQuantity());
            element.TouchSpin({
                buttondown_class: "btn quantity-down",
                buttonup_class: "btn quantity-up"
            });

            element.on('change', function() {
                $scope.$apply(function () {
                    $scope.cartItem.setQuantity(element.val(), false);
                })
            });
            $(".quantity-down").html("<i class='fa fa-angle-down'></i>");
            $(".quantity-up").html("<i class='fa fa-angle-up'></i>");
        }
    }
}]);

shopDirectives.directive('touchSpin', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.TouchSpin({
                buttondown_class: "btn quantity-down",
                buttonup_class: "btn quantity-up"
            });
            $(".quantity-down").html("<i class='fa fa-angle-down'></i>");
            $(".quantity-up").html("<i class='fa fa-angle-up'></i>");
        }
    }
}]);

shopDirectives.directive('sideBarDropdown', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.click(function (event) {
                event.preventDefault();
                if (element.hasClass("collapsed") == false) {
                    element.addClass("collapsed");
                    element.siblings(".dropdown-menu").slideDown(300);
                } else {
                    element.removeClass("collapsed");
                    element.siblings(".dropdown-menu").slideUp(300);
                }
            });
        }
    }
}]);

shopDirectives.directive('searchBox',['$compile', '$timeout',  function ($compile, $timeout) {
    return {
        link: function ($scope, element, attrs) {
            element.click(function () {            
                if (element.hasClass('show-search-icon')) {
                    if ($(window).width()>767) {
                        $('.search-box').fadeOut(300);
                    } else {
                        $('.search-box').fadeOut(0);
                    }
                    $('.search-btn').removeClass('show-search-icon');
                } else {
                    if ($(window).width()>767) {
                        $('.search-box').fadeIn(300);
                    } else {
                        $('.search-box').fadeIn(0);
                    }
                    element.addClass('show-search-icon');
                } 
            }); 

            // close search box on body click
            if (element.size() != 0) {
                $('.search-box, .search-btn').on('click', function(e){
                    e.stopPropagation();
                });

                $('body').on('click', function() {
                    if (element.hasClass('show-search-icon')) {
                        element.removeClass("show-search-icon");
                        $('.search-box').fadeOut(300);
                    }
                });
            }
        }
    }
}]);

shopDirectives.directive('owlCarousel', ['$timeout', function ($timeout) {
    return {
        restrict: 'EA',
        scope: {
            options : '='
        },
        link: function (scope, element, attrs) {
            console.log('owlCarousel');
            $timeout(function () {
                $(element).owlCarousel(scope.options);
            });


        }
    };
}]);

shopDirectives.directive('headerPage', ['$timeout', '$http', 'ngSettings', '$location', '$filter',
    function ($timeout, $http, ngSettings, $location, $filter) {
    return {
        restrict: 'EA',
        scope: {
        },
        templateUrl: 'templates/header.html',
        controller: function ($scope) {
            $http.get(ngSettings.apiServiceBaseUri + 'categories').then(function (result) {
                $scope.categories = result.data;
            })

            $http.get(ngSettings.apiServiceBaseUri + 'category/for-header').then(function (result) {
                $scope.menucategories = result.data;
                //var q = $filter('toArray')(result.data);
                //console.log(q);
            })
            
            $scope.gotoCategory = function (id) {
                $location.path('category/' + id);
                console.log(id);
            }
        },
        link: function (scope, element, attrs) {
            //Layout.initHeader();
                $(".header .navbar-toggle").click(function () {
                    if ($(".header .navbar-collapse").hasClass("open")) {
                        $(".header .navbar-collapse").slideDown(300)
                        .removeClass("open");
                    } else {
                        $(".header .navbar-collapse").slideDown(300)
                        .addClass("open");
                    }
                });
                $(".header-navigation .dropdown").on("hover", function () {
                    if ($(this).children(".header-navigation-content-ext").show()) {
                        if ($(".header-navigation-content-ext").height() >= $(".header-navigation-description").height()) {
                            $(".header-navigation-description").css("height", $(".header-navigation-content-ext").height() + 22);
                        }
                    }
                });

                $(".header .navbar-toggle span:nth-child(2)").addClass("short-icon-bar");
                $(".header .navbar-toggle span:nth-child(4)").addClass("short-icon-bar");

                $(".mobi-toggler").on("click", function (event) {
                    event.preventDefault();//the default action of the event will not be triggered

                    $(".header").toggleClass("menuOpened");
                    $(".header").find(".header-navigation").toggle(300);
                });

        }
    };
}]);

shopDirectives.directive('footerPage', ['$timeout', '$http', 'ngSettings', '$location',
    function ($timeout, $http, ngSettings, $location) {
    return {
        restrict: 'EA',
        templateUrl: 'templates/footer.html',       
        link: function (scope, element, attrs) {
            !function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + "://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); }
            }(document, "script", "twitter-wjs");
        }
    };
}]);
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
shopFilter = angular.module("shopApp.filters", []);
shopFilter.filter('nairacurrency',
    ['$filter', '$locale',
        function (filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;
            return function (amount, currencySymbol) {
                var value = currencyFilter(amount, "₦");
                var sep = value.indexOf(formats.DECIMAL_SEP);
                if (amount >= 0) {
                    return value.substring(0, sep);
                }
                return value.substring(0, sep) + '';
            };
        }]);

shopFilter.filter('toArray', function () {
    return function (obj, addKey) {
        if (!obj) return obj;
        if (addKey === false) {
            return Object.keys(obj).map(function (key) {
                return obj[key];
            });
        } else {
            return Object.keys(obj).map(function (key) {
                return Object.defineProperty(obj[key], '$key', { enumerable: false, value: key });
            });
        }
    };
});

'use strict';

angular.module("shopApp.cart.services", [])
    .service('cart', ['$rootScope', 'cartItem', 'store', function ($rootScope, cartItem, store) {

        this.init = function () {
            this.$cart = {
                shipping: null,
                taxRate: null,
                tax: null,
                items: []
            };
        };

        this.addItem = function (product, quantity) {

            var inCart = this.getItemById(product.id);

            if (typeof inCart === 'object') {
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
            } else {
                var newItem = new cartItem(product.id, product.name, product.price, quantity, product.image_Url);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('cart:itemAdded', newItem);
            }

            $rootScope.$broadcast('cart:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function (shipping) {
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function () {
            if (this.getCart().items.length == 0) return 0;
            return this.getCart().shipping;
        };

        this.setTaxRate = function (taxRate) {
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function () {
            return this.$cart.taxRate
        };

        this.getTax = function () {
            return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function () {
            return this.$cart;
        };

        this.getItems = function () {
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getSubTotal = function () {
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function () {
            return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
        };

        this.removeItem = function (index) {
            this.$cart.items.splice(index, 1);
            $rootScope.$broadcast('cart:itemRemoved', {});
            $rootScope.$broadcast('cart:change', {});

        };

        this.removeItemById = function (id) {
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if (item.getId() === id) {
                    cart.items.splice(index, 1);
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('cart:itemRemoved', {});
            $rootScope.$broadcast('cart:change', {});
        };

        this.empty = function () {
            this.$cart.items = [];
            localStorage.removeItem('cart');
        };

        this.toObject = function () {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function (item) {
                items.push(item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items: items
            }
        };


        this.$restore = function (storedCart) {
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new cartItem(item._id, item._name, item._price, item._quantity, item._image));
            });
            this.$save();
        };

        this.$save = function () {
            return store.set('cart', JSON.stringify(this.getCart()));
        }

    }])

    .factory('cartItem', ['$rootScope', 'toaster', function ($rootScope, $log) {

        var item = function (id, name, price, quantity, image) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setImage(image);
        };


        item.prototype.setId = function (id) {
            if (id) this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function () {
            return this._id;
        };


        item.prototype.setName = function (name) {
            if (name) this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function () {
            return this._name;
        };

        item.prototype.setPrice = function (price) {
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function () {
            return this._price;
        };

        item.prototype.setQuantity = function (quantity, relative) {


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0) {
                if (relative === true) {
                    this._quantity += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
                if (this._quantity < 1) this._quantity = 1;

            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }
            $rootScope.$broadcast('cart:change', {});

        };

        item.prototype.getQuantity = function () {
            return this._quantity;
        };

        item.prototype.setImage = function (image) {
            if (image) this._image = image;
        };

        item.prototype.getImage = function () {
            if (this._image) return this._image;
            else $log.info('This item has no image');
        };


        item.prototype.getTotal = function () {
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function () {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                image: this.getImage(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ($window.localStorage[key]) {
                    var cart = angular.fromJson($window.localStorage[key]);
                    return JSON.parse(cart);
                }
                return false;

            },
            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage.removeItem(key);
                } else {
                    $window.localStorage[key] = angular.toJson(val);
                }
                return $window.localStorage[key];
            }
        }
    }])