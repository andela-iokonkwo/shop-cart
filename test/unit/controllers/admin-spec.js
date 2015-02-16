// testing controller


describe('testing all my admin controllers', function () {
    var $httpBackend, scope, $controller, ngSettings, params, filter, orderBy, requestHandler, mockProducts, mockDeletProduct;
    beforeEach(module('ui.router'));
    beforeEach(module('ui.bootstrap'));
    beforeEach(module('angularFileUpload'));
    beforeEach(module('toaster'));
    beforeEach(module("shopApp.settings"));
    beforeEach(module('shopApp.admin'));

    var fakeModal = {
        result: {
            then: function (confirmCallback, cancelCallback) {
                //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                this.confirmCallBack = confirmCallback;
                this.cancelCallback = cancelCallback;
            }
        },
        close: function (item) {
            //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
            this.result.confirmCallBack(item);
        },
        dismiss: function (type) {
            //The user clicked cancel on the modal dialog, call the stored cancel callback
            this.result.cancelCallback(type);
        }
    };


    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        ngSettings = $injector.get('ngSettings');
        $httpBackend = $injector.get('$httpBackend');
        scope = $injector.get('$rootScope').$new();
        params = $injector.get('$stateParams');
        filter = $injector.get('filterFilter');
        orderBy = $injector.get('orderByFilter');
        params = $injector.get('$stateParams');
        mockProducts = [{ "id": 8, "name": "City Goddess Short Sleeve Midi Dress | Red", "description": "City Goddess is a brand that has been designing and styling beautiful clothes for almost a decade for all women. City Goddess always bring the latest trends and design from the red carpet and fashion shows making them affordable for every woman. With a massive selection of items from maxi dresses, lace dresses. With City Goddess you will be the star at every occasion.\n\nWomen's clothing vary in styles from the little black dress, bodycon dresses & skirts that accentuates your curves at the right places, skater dresses for the fun & free spirited lady to the shirt dress for the edgy lady. This dress features a scoop neck cut, short sleeves and a mesh insert.", "image_Url": "https://paysmall.blob.core.windows.net/women/woman1.jpg", "price": 10000.0, "discountedPrice": 9800.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:14:28.07", "categoryId": 2, "category": null }, { "id": 9, "name": "AX Paris Long Sleeve Wrap Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This long sleeve wrap dress is simple and classy for any occasion.\n\nExplore the various types of styles from Ax Paris collection on Konga.com at the best prices with fast delivery service nationwide.", "image_Url": "https://paysmall.blob.core.windows.net/women/women.jpg", "price": 10000.0, "discountedPrice": 9900.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:15:53.493", "categoryId": 2, "category": null }, { "id": 10, "name": "AX Paris Contrast Waist and Sleeve Midi Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. No matter the occasion, keep your mono-strap dresses up your sleeve, it will help you impress at any event or occasion. Keep it elegant and stylish in this 3/4 sleeve dress, you would definitely rock.", "image_Url": "https://paysmall.blob.core.windows.net/women/women3.jpg", "price": 8000.0, "discountedPrice": 7990.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:17:18.547", "categoryId": 2, "category": null }, { "id": 11, "name": "GOLD Sleeveless Plain Bodycon Dress | Burgundy", "description": "Gold is the most luxurious, contemporary fashion brand designed to reveal the sensuality and charm in every woman. With classic designs and impeccable fashion styles, in outfits ranging from jackets, skirts, blazers, tops, shirts to dresses, bags, shoes and much more, Gold will add creativity and elegance to your looks anytime. Each collection features fashion forward designs that includes inspiring work wear and fashionable catwalk trends for party and fun wear. Stay Gold!\n\nGet this sleeveless bodycon dress with with high neck for a total elegant look. Its flattering design gives it class and glamour. It will accentuate your figure and wow your onlookers. This is the perfect dress for all your parties.", "image_Url": "https://paysmall.blob.core.windows.net/women/women5.jpg", "price": 7000.0, "discountedPrice": 6490.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:18:46.88", "categoryId": 2, "category": null }, { "id": 12, "name": "Jane Norman Sleeveless Lace Dress | Red", "description": "Jane Norman is a brand whose sole purpose is to give women and ladies out there a great fit, stand out style and attention to detail. Whether its a beautiful lace frock, an exquisitely embellished evening dress, or classy jeans, the collections will always make you the best you can be.\n\nThis lovely sleeveless red dress features a cut out back and made with lace is the perfect number for that special occasion. Pair with power heels and rhinestone earrings for that sparkle and you can never go wrong.", "image_Url": "https://paysmall.blob.core.windows.net/women/women6.jpg", "price": 6490.0, "discountedPrice": 7000.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:20:53.437", "categoryId": 2, "category": null }, { "id": 13, "name": "AX Paris Crochet Contrast Skater Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This skater is simple and chic!", "image_Url": "https://paysmall.blob.core.windows.net/women/women7.jpg", "price": 8000.0, "discountedPrice": 7990.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:35:52.75", "categoryId": 2, "category": null }, { "id": 14, "name": "AX Paris Cut Out Bodycon Dress with Net Overlay | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This Sexy see through dress is sleeveless and has a figure hugging silouhette.", "image_Url": "https://paysmall.blob.core.windows.net/women/women8.jpg", "price": 4000.0, "discountedPrice": 3800.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:38:03.637", "categoryId": 2, "category": null }, { "id": 15, "name": "GOLD Monique Full Peplum Dress | Red", "description": "Gold is the most luxurious, contemporary fashion brand designed to reveal the sensuality and charm in every woman. With classic designs and impeccable fashion styles, in outfits ranging from jackets, skirts, blazers, tops, shirts to dresses, bags, shoes and much more, Gold will add creativity and elegance to your looks anytime. Each collection features fashion forward designs that includes inspiring work wear and fashionable catwalk trends for party and fun wear. Stay Gold!\n\nDresses, tops and skirts are essentials for women, they bring out the glam in every woman. They are fashioned in different designs, pattern and colours. Whatever the style they are sure to come in handy anytime and for every occasion. Stay stylish with the various designs from Gold. You would look glam in this full peplum dress with cut out neck.", "image_Url": "https://paysmall.blob.core.windows.net/women/women9.jpg", "price": 5500.0, "discountedPrice": 5390.0, "available": false, "size": null, "color": null, "dateAdded": "2015-02-12T05:39:12.133", "categoryId": 2, "category": null }];
        mockDeleteProducts = [{ "id": 9, "name": "AX Paris Long Sleeve Wrap Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This long sleeve wrap dress is simple and classy for any occasion.\n\nExplore the various types of styles from Ax Paris collection on Konga.com at the best prices with fast delivery service nationwide.", "image_Url": "https://paysmall.blob.core.windows.net/women/women.jpg", "price": 10000.0, "discountedPrice": 9900.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:15:53.493", "categoryId": 2, "category": null }, { "id": 10, "name": "AX Paris Contrast Waist and Sleeve Midi Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. No matter the occasion, keep your mono-strap dresses up your sleeve, it will help you impress at any event or occasion. Keep it elegant and stylish in this 3/4 sleeve dress, you would definitely rock.", "image_Url": "https://paysmall.blob.core.windows.net/women/women3.jpg", "price": 8000.0, "discountedPrice": 7990.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:17:18.547", "categoryId": 2, "category": null }, { "id": 11, "name": "GOLD Sleeveless Plain Bodycon Dress | Burgundy", "description": "Gold is the most luxurious, contemporary fashion brand designed to reveal the sensuality and charm in every woman. With classic designs and impeccable fashion styles, in outfits ranging from jackets, skirts, blazers, tops, shirts to dresses, bags, shoes and much more, Gold will add creativity and elegance to your looks anytime. Each collection features fashion forward designs that includes inspiring work wear and fashionable catwalk trends for party and fun wear. Stay Gold!\n\nGet this sleeveless bodycon dress with with high neck for a total elegant look. Its flattering design gives it class and glamour. It will accentuate your figure and wow your onlookers. This is the perfect dress for all your parties.", "image_Url": "https://paysmall.blob.core.windows.net/women/women5.jpg", "price": 7000.0, "discountedPrice": 6490.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:18:46.88", "categoryId": 2, "category": null }, { "id": 12, "name": "Jane Norman Sleeveless Lace Dress | Red", "description": "Jane Norman is a brand whose sole purpose is to give women and ladies out there a great fit, stand out style and attention to detail. Whether its a beautiful lace frock, an exquisitely embellished evening dress, or classy jeans, the collections will always make you the best you can be.\n\nThis lovely sleeveless red dress features a cut out back and made with lace is the perfect number for that special occasion. Pair with power heels and rhinestone earrings for that sparkle and you can never go wrong.", "image_Url": "https://paysmall.blob.core.windows.net/women/women6.jpg", "price": 6490.0, "discountedPrice": 7000.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:20:53.437", "categoryId": 2, "category": null }, { "id": 13, "name": "AX Paris Crochet Contrast Skater Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This skater is simple and chic!", "image_Url": "https://paysmall.blob.core.windows.net/women/women7.jpg", "price": 8000.0, "discountedPrice": 7990.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:35:52.75", "categoryId": 2, "category": null }, { "id": 14, "name": "AX Paris Cut Out Bodycon Dress with Net Overlay | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This Sexy see through dress is sleeveless and has a figure hugging silouhette.", "image_Url": "https://paysmall.blob.core.windows.net/women/women8.jpg", "price": 4000.0, "discountedPrice": 3800.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:38:03.637", "categoryId": 2, "category": null }, { "id": 15, "name": "GOLD Monique Full Peplum Dress | Red", "description": "Gold is the most luxurious, contemporary fashion brand designed to reveal the sensuality and charm in every woman. With classic designs and impeccable fashion styles, in outfits ranging from jackets, skirts, blazers, tops, shirts to dresses, bags, shoes and much more, Gold will add creativity and elegance to your looks anytime. Each collection features fashion forward designs that includes inspiring work wear and fashionable catwalk trends for party and fun wear. Stay Gold!\n\nDresses, tops and skirts are essentials for women, they bring out the glam in every woman. They are fashioned in different designs, pattern and colours. Whatever the style they are sure to come in handy anytime and for every occasion. Stay stylish with the various designs from Gold. You would look glam in this full peplum dress with cut out neck.", "image_Url": "https://paysmall.blob.core.windows.net/women/women9.jpg", "price": 5500.0, "discountedPrice": 5390.0, "available": false, "size": null, "color": null, "dateAdded": "2015-02-12T05:39:12.133", "categoryId": 2, "category": null }];
        // The $controller service is used to create instances of controllers
        $controller = $injector.get('$controller');
    }));
    beforeEach(inject(function ($modal) {
        spyOn($modal, 'open').and.returnValue(fakeModal);
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('adminCategoryCtrl', function () {
        
        beforeEach(inject(function (_$modal_) {
            params.Id = "Men-3";
            createController = function () {
                return $controller('adminCategoryCtrl', { '$scope': scope, '$model':_$modal_ });
            };
            $httpBackend.expectGET(ngSettings.apiServiceBaseUri + 'category/3/products').respond(mockProducts);
        }));

        it('it should display selected category', function () {
            var controller = createController();
            $httpBackend.flush();
            expect(scope.SelectedCategory).toBe('Men');
        });

        it('it should get products in a category', function () {
            var controller = createController();
            $httpBackend.flush();
            expect(scope.allProducts.length).toBe(8);
        });

        it('it should be able to filter products by keywords', function () {        
            var controller = createController();
            scope.searchKeywords = 'Goddess';
            $httpBackend.flush();
            scope.search();
            expect(scope.filteredProducts.length).toBe(5);
            scope.searchKeywords = 'City';
            scope.search();
            expect(scope.filteredProducts.length).toBe(1);
        });

        it('it should able to change number of products to display per page', function () {
            var controller = createController();
            $httpBackend.flush();
            expect(scope.products.length).toBe(8);
            scope.numPerPage = 5;
            scope.onNumPerPageChange();
            expect(scope.products.length).toBe(5);
        });


        it('it should able to a select page', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.numPerPage = 5;
            scope.select(2);
            expect(scope.products.length).toBe(3);
        });

        it('it should be able to sort by price desc', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('-price');
            expect(scope.products[0].price).toBe(10000);
        });

        it('it should be able to sort by price asc', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('price');
            expect(scope.products[0].price).toBe(4000);
        });

        it('it should be able to sort by name desc', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('-name');
            expect(scope.products[0].name).toBe('Jane Norman Sleeveless Lace Dress | Red');
        });

        it('it should be able to sort by name asc', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('name');
            expect(scope.products[0].name).toBe('AX Paris Contrast Waist and Sleeve Midi Dress | Red');
        });

        it('it should be able to sort by discounted price desc', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('-discountedPrice');
            expect(scope.products[0].discountedPrice).toBe(9900);
        });

        it('it should be able to sort by discounted price asc', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('discountedPrice');
            expect(scope.products[0].discountedPrice).toBe(3800);
        });

        it('it should be able to sort by availability (Not Available)', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('available');
            expect(scope.products[0].available).toBe(false);
        });

        it('it should be able to sort by availabiliy (Available)', function () {
            var controller = createController();
            $httpBackend.flush();
            scope.order('-available');
            expect(scope.products[0].available).toBe(true);
        });

        it('it should be able to delete product', function () {
            var controller = createController();
            $httpBackend.flush();
            $httpBackend.expectDELETE(ngSettings.apiServiceBaseUri + 'products/8').respond();
            scope.deleteProd(8);
            $httpBackend.flush();
            expect(scope.hasDeletedProduct).toBe(true);
        });

        it('it should be able to delete category', function () {
            var controller = createController();
            $httpBackend.flush();
            $httpBackend.expectDELETE(ngSettings.apiServiceBaseUri + 'categories/3').respond('');
            scope.delete();
            $httpBackend.flush();
            expect(scope.allProducts).toBe('');
        });

        it('it should be able to display add product modal popup', function () {
            var controller = createController();
            $httpBackend.flush();
            expect(scope.okModal).toBeUndefined();
            scope.addProduct(); // Open the modal
            scope.modalInstance.close("3"); //Call dismiss (simulating clicking the cancel button on the modal)
            expect(scope.okModal).toBe(true);
        });

        it("should cancel the dialog when cancel is called", function () {
            var controller = createController();
            $httpBackend.flush();
            expect(scope.cancelModal).toBeUndefined();
            scope.addProduct(); // Open the modal
            scope.modalInstance.dismiss("cancel"); //Call dismiss (simulating clicking the cancel button on the modal)
            expect(scope.cancelModal).toBe(true);
        });
    });

    describe('AddProductCtrl', function () {
        var modalInstance;
        beforeEach(inject(function ($injector) {
            modalInstance = {                    // Create a mock object using spies
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                    then: jasmine.createSpy('modalInstance.result.then')
                }
            };           
            createController = function () {
                return $controller('AddProductCtrl', { '$scope': scope, $modalInstance: modalInstance});
            };
        }));

        it('it should have a modal instance', function () {
            var controller = createController();
            expect(scope.modalInstance).not.toBeUndefined();
        });

        it('it should be able to cancel popup', function () {
            var controller = createController();
            scope.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });

        it('it should be able to upload product successfully', function () {
            var controller = createController();
            scope.progress = [0];
            scope.selectedFiles = ['ABC'];           

            scope.upload = [{}];
           
            $httpBackend.expectPOST(ngSettings.apiServiceBaseUri + 'products').respond(200, '');
            scope.save();
            $httpBackend.flush();
            expect(modalInstance.close).toHaveBeenCalledWith('');

        });

        it('it should be able to handle error from server when uploading', function () {
            var controller = createController();
            scope.progress = [0];
            scope.selectedFiles = ['ABC'];
            scope.upload = [{}];
            $httpBackend.expectPOST(ngSettings.apiServiceBaseUri + 'products').respond(400, '');
            scope.save();
            $httpBackend.flush();
            expect(scope.hasFailed).toBe(true);

        });
    });

    describe('NewCategoryCtrl', function () {
        var modalInstance;
        beforeEach(inject(function ($injector) {
           
            createController = function () {
                return $controller('NewCategoryCtrl', { '$scope': scope });
            };
        }));

        it('it should be able to create category successfully', function () {
            var controller = createController();
            scope.progress = [0];
            scope.selectedFiles = ['ABC'];

            scope.upload = [{}];
            expect(scope.hasUploaded).toBe(undefined);

            $httpBackend.expectPOST(ngSettings.apiServiceBaseUri + 'categories').respond(200, '');
            scope.save();
            $httpBackend.flush();
            expect(scope.hasUploaded).toBe(true);
        });

        it('it should be able to handle error from server when creating category', function () {
            var controller = createController();
            scope.progress = [0];
            scope.selectedFiles = ['ABC'];
            scope.upload = [{}];
            expect(scope.hasUploaded).toBe(undefined);
            $httpBackend.expectPOST(ngSettings.apiServiceBaseUri + 'categories').respond(400, '');
            scope.save();
            $httpBackend.flush();
            expect(scope.hasUploaded).toBe(false);
        });
    });

    describe('EditProductCtrl', function () {
        var modalInstance;
        var product = { "id": 9, "name": "AX Paris Long Sleeve Wrap Dress | Red", "description": "Ax Paris is that brand that covers all the needs of the ladies, their pieces and styles have a cutting edge design which is easy and timeless. With Ax Paris designs, bold meets beautiful, from their dramatic animal print to their sexy lacy bodycon pieces.\n\nLadies wears embodies the various silhouette that they have, from the skater dresses and skirts for the fun and free spirited ladies, to the bodycon dresses for that hourglass figure and finally the maxi dresses for a Grecian Goddess. This long sleeve wrap dress is simple and classy for any occasion.\n\nExplore the various types of styles from Ax Paris collection on Konga.com at the best prices with fast delivery service nationwide.", "image_Url": "https://paysmall.blob.core.windows.net/women/women.jpg", "price": 10000.0, "discountedPrice": 9900.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T05:15:53.493", "categoryId": 2, "category": null };
        beforeEach(inject(function ($injector) {
            modalInstance = {                    // Create a mock object using spies
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                    then: jasmine.createSpy('modalInstance.result.then')
                }
            };
            createController = function () {
                return $controller('EditProductCtrl', { '$scope': scope, $modalInstance: modalInstance , product: product});
            };
        }));

        it('it should have a product to edit', function () {
            var controller = createController();
            expect(scope.product).not.toBeUndefined();
        });

        it('it should have a modal instance', function () {
            var controller = createController();
            expect(scope.modalInstance).not.toBeUndefined();
        });

        it('it should be able to cancel popup', function () {
            var controller = createController();
            scope.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });

        it('it should be able to edit product successfully', function () {
            var controller = createController();
            $httpBackend.expectPUT(ngSettings.apiServiceBaseUri + 'products/9').respond(200, '');
            scope.save();
            $httpBackend.flush();
            expect(modalInstance.close).toHaveBeenCalledWith('');
        });

        it('it should be able to handle error from server when editing product', function () {
            var controller = createController();
            $httpBackend.expectPUT(ngSettings.apiServiceBaseUri + 'products/9').respond(400, '');
            scope.save();
            $httpBackend.flush();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
    });
});