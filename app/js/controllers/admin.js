
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

