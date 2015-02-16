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