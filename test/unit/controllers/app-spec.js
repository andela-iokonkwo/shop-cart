// testing controller


describe('testing all my app controllers', function () {
    var $httpBackend, scope, $controller, ngSettings, params;
    beforeEach(module('ui.router'));
    beforeEach(module('shopApp.controllers'));
    beforeEach(module("shopApp.settings"));

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        ngSettings = $injector.get('ngSettings');
        $httpBackend = $injector.get('$httpBackend');

        scope = $injector.get('$rootScope').$new();
        params = $injector.get('$stateParams');
        // The $controller service is used to create instances of controllers
        $controller= $injector.get('$controller');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('ProductController', function () {        
        beforeEach(inject(function ($injector) {
            params.id = 3;
            createController = function () {
                return $controller('ProductController', { '$scope': scope });
            };
        }));

     
        it('it should get products', function () {
            $httpBackend.expectGET(ngSettings.apiServiceBaseUri + 'Products/3').respond([{id:1}, {id:2}]);
            var controller = createController();
            $httpBackend.flush();
            expect(scope.product.length).toBe(2);
        });


        //it('should fail authentication', function () {

        //    // Notice how you can change the response even after it was set
        //    authRequestHandler.respond(401, '');

        //    $httpBackend.expectGET('/auth.py');
        //    var controller = createController();
        //    $httpBackend.flush();
        //    expect($rootScope.status).toBe('Failed...');
        //});


        //it('should send msg to server', function () {
        //    var controller = createController();
        //    $httpBackend.flush();

        //    // now you don’t care about the authentication, but
        //    // the controller will still send the request and
        //    // $httpBackend will respond without you having to
        //    // specify the expectation and response for this request

        //    $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
        //    $rootScope.saveMessage('message content');
        //    expect($rootScope.status).toBe('Saving...');
        //    $httpBackend.flush();
        //    expect($rootScope.status).toBe('');
        //});


        //it('should send auth header', function () {
        //    var controller = createController();
        //    $httpBackend.flush();

        //    $httpBackend.expectPOST('/add-msg.py', undefined, function (headers) {
        //        // check if the header was send, if it wasn't the expectation won't
        //        // match the request and the test will fail
        //        return headers['Authorization'] == 'xxx';
        //    }).respond(201, '');

        //    $rootScope.saveMessage('whatever');
        //    $httpBackend.flush();
        //});
    });

    describe('HomeController', function () {
        beforeEach(inject(function ($injector) {
            createController = function () {
                return $controller('HomeController', { '$scope': scope });
            };
        }));


        it('it should get all products in homepage', function () {
            $httpBackend.expectGET(ngSettings.apiServiceBaseUri + 'products/for-homepage').respond({ 'new arrival': [{id:1}] });
            var controller = createController();
            $httpBackend.flush();
            expect(scope.products['new arrival'][0].id).toBe(1);
        });
    });

    describe('CategoryController', function () {
        var mockData;
        beforeEach(inject(function ($injector) {
            params.id = "men_1";
            createController = function () {
                return $controller('CategoryController', { '$scope': scope });
            };
            mockData = [{ "id": 2, "name": "Gab Moren Men's Suede and Patent Leather Oxford Shoe | Black", "description": "Gab Moren is a brand that shows that a man takes pride in the little things, this brand helps the modern man to invest in a handful of sensible and stylish pairs of shoes that take care of them, this shoes are stylish, tasteful and masculine!\n\nMen’s Shoes vary from the oxford shoes which is timeless and formal, to Derby shoes which are the business casual shoes, to the edgy & stylish brogues and finally the loafers which is nearly every man’s favourite. This brogues is from the resort collection and it has an 100% leather inner lining.", "image_Url": "https://paysmall.blob.core.windows.net/products/men2.jpg", "price": 12000.0, "discountedPrice": 11250.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T00:31:50.613", "categoryId": 1, "category": null }, { "id": 3, "name": "Franck NEW YORK Leather Cut Strap Slip-on Formal Loafer | Black", "description": "Franck NEW YORK is a unique brand that pays attention to the sartorial man. It is a brand for the fashion forward and trendy man. With shoes that ranges from formal shoes, brogues, boat shoes and drivers. Their attention to detail and quality of their products put them at the very top of the fashion scene especially when it comes to shoes.\n\nA pair of footwear can change your look! Do the walking and let your shoes do the talking. This shoe is a mix of classic styling with modern touches, fashioned with wingtip, perforated detail, rubber sole and inner lining which makes it really comfortable to wear. This quintessential Men's PU Leather Cut out Strap Slip-on Formal Loafers with rubber sole and 100% inner leather lining detailed will make a perfect addition to every sophisticated man wardrobe collection. You are sure to turn heads in this deluxe edition - resort collection.", "image_Url": "https://paysmall.blob.core.windows.net/products/men3.jpg", "price": 10000.0, "discountedPrice": 9750.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T00:38:20.63", "categoryId": 1, "category": null }, { "id": 4, "name": "Deo Milano Men's Leather Lace-up Casual Brogue | Brown", "description": "Deo Milano is that brand with a difference! A unique brand that gets you inspired. Their attention to detail and quality of their products put them at the very top of the fashion scene especially when it comes to the male shoes. Deo Milano shoes shows the extent of creativity, quality and workmanship put into them. These shoes ranges from rugged brogues, derby shoes, plimsolls, loafers, boat shoes to sleek sneakers and trainers. These shoes have come to show the style & philosophy of the Deo Milano brand.\n\nThe way you dress from your clothes to your footwear plays a role in how you are addressed. So, making an impression with the right footwear becomes imperative. A pair of footwear can change your look! Do the walking and let your shoes do the talking with this trendy men's brogues. You sure will turn heads in this deluxe edition - resort collection of men's brogues which features brogue design, lace-up, slip-on style, contrast rubber sole and inner lining detail.", "image_Url": "https://paysmall.blob.core.windows.net/products/men4.jpg", "price": 8000.0, "discountedPrice": 7500.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T00:40:43.67", "categoryId": 1, "category": null }, { "id": 5, "name": "Gab Moren Men's Suede and Leather Brogue shoe | Black", "description": "Gab Moren is a brand that shows that a man takes pride in the little things, this brand helps the modern man to invest in a handful of sensible and stylish pairs of shoes that take care of them, this shoes are stylish, tasteful and masculine!\n\nMen’s Shoes vary from the oxford shoes which is timeless and formal, to Derby shoes which are the business casual shoes, to the edgy & stylish brogues and finally the loafers which is nearly every man’s favourite. This brogues is from the resort collection and it has an 100% leather inner lining.", "image_Url": "https://paysmall.blob.core.windows.net/products/men5.jpg", "price": 12000.0, "discountedPrice": 11250.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T00:46:16.313", "categoryId": 1, "category": null }, { "id": 6, "name": "Franck NEW YORK Penny Slip-on Formal Loafers | Brown", "description": "Franck NEW YORK is a unique brand that pays attention to the sartorial man. It is a brand for the fashion forward and trendy man. With shoes that ranges from formal shoes, brogues, boat shoes and drivers. Their attention to detail and quality of their products put them at the very top of the fashion scene especially when it comes to shoes.\n\nA pair of footwear can change your look! Do the walking and let your shoes do the talking. This shoe is a mix of classic styling with modern touches, fashioned with rubber sole detail and inner lining which makes it really comfortable to wear. This quintessential shoe will make a perfect addition to every sophisticated man wardrobe collection. You are sure to turn heads in this deluxe edition - resort collection.", "image_Url": "https://paysmall.blob.core.windows.net/products/men6.jpg", "price": 10000.0, "discountedPrice": 9500.0, "available": true, "size": null, "color": null, "dateAdded": "2015-02-12T00:49:39.33", "categoryId": 1, "category": null }]
        }));


        it('it should get all products in a category', function () {
            $httpBackend.expectGET(ngSettings.apiServiceBaseUri + 'category/1/products').respond(mockData);
            var controller = createController();
            $httpBackend.flush();
            expect(scope.products.length).toBe(2);
            expect(scope.products[0].length).toBe(4);
        });
    });
});