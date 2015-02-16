'use strict';

describe('testing all my shopping cart services', function () {
    beforeEach(module('toaster'));
    beforeEach(module('shopApp.cart.services'));

    // Factory of interest is called MyFactory
    describe('service: cart', function () {
        var shoppingCart = null;
        beforeEach(inject(function (cart) {
            shoppingCart = cart;
            shoppingCart.init();
        }))
       
        it('it should be an instance', function () {
            expect(typeof shoppingCart).toEqual('object');
        });

        it('should be able to add an item', function () {
            shoppingCart.addItem({ id: 1, name: 'Nice Dress', price: 10000, image_Url: 'img/products/model1.jpg' }, 3);
            expect(shoppingCart.getItems().length).toEqual(1);
            expect(shoppingCart.getTotalItems()).toEqual(3);
        });

        it('should be able to empty', function () {
            shoppingCart.empty();
            expect(shoppingCart.getItems().length).toEqual(0);
        });

        describe('service: cart core functions', function () {
            //var shoppingCart = null;
            beforeEach(inject(function (cart) {
                shoppingCart.setTaxRate(5);
                shoppingCart.setShipping(1000);
                shoppingCart.addItem({ id: 1, name: 'Nice Dress', price: 10000, image_Url: 'img/products/model1.jpg'}, 1);
                shoppingCart.addItem({ id: 2, name: 'Nice Shoe', price: 15000, image_Url: 'img/products/model1.jpg' }, 4);
                shoppingCart.addItem({ id: 3, name: 'Nice Shirt', price: 25000, image_Url: 'img/products/model1.jpg' }, 2);
            }))

            it('tax rate should be set', function () {
                expect(shoppingCart.getTaxRate()).toEqual(5);
            });

            it('shipping should be set', function () {
                expect(shoppingCart.getShipping()).toEqual(1000);
            });

            it('tax charge should be ', function () {
                expect(shoppingCart.getTax()).toEqual(6000);
            });

            it('count items in total', function () {
                expect(shoppingCart.getTotalItems()).toEqual(7);
            });

            it('count unique items in cart', function () {
                expect(shoppingCart.getTotalUniqueItems()).toEqual(3);
            });


            it('check getItems has correct number of items', function () {
                expect(shoppingCart.getItems().length).toEqual(3);
            });

            it('Have correct getSubTotal', function () {
                expect(shoppingCart.getSubTotal()).toEqual(120000);
            });


            it('Have correct totalCost', function () {
                expect(shoppingCart.totalCost()).toEqual(127000);
            });


            it('find item by id (by int) ', function () {
                expect(shoppingCart.getItemById(2).getName()).toEqual('Nice Shoe');
            });

            it('remove item by ID', function () {
                shoppingCart.removeItemById(3);
                expect(shoppingCart.getItemById(3)).toEqual(false);
                expect(shoppingCart.getTotalUniqueItems()).toEqual(2);
            });


            it('remove item by ID', function () {
                shoppingCart.removeItemById(1);
                expect(shoppingCart.getItemById(1)).toEqual(false);
            });

            it('should create an object', function () {
                var obj = shoppingCart.toObject();
                expect(obj.shipping).toEqual(1000);
                expect(obj.tax).toEqual(6000);
                expect(obj.taxRate).toEqual(5);
                expect(obj.subTotal).toEqual(120000);
                expect(obj.totalCost).toEqual(127000);
                expect(obj.items.length).toEqual(3);
            });
        });
        describe('cartItem', function () {

            var cartItem;
            beforeEach(function () {
                shoppingCart.addItem({ id: 3, name: 'Nice Shirt', price: 25000, image_Url: 'img/products/model1.jpg' }, 2);
                cartItem = shoppingCart.getItemById(3);
            });


            it('should have correct Name', function () {
                expect(cartItem.getName()).toEqual('Nice Shirt');
            });

            it('should default quantity to 2', function () {
                expect(cartItem.getQuantity()).toEqual(2);
            });

            it('should absolutely update quantity', function () {
                expect(cartItem.getQuantity()).toEqual(2);
                cartItem.setQuantity(5);
                expect(cartItem.getQuantity()).toEqual(5);
            });

            it('should relatively update quantity', function () {
                expect(cartItem.getQuantity()).toEqual(2);
                cartItem.setQuantity(1, true);
                expect(cartItem.getQuantity()).toEqual(3);
            });


            it('should get total', function () {
                expect(cartItem.getTotal()).toEqual(50000);
            });

            it('should update total after quantity change', function () {
                cartItem.setQuantity(1, true);
                expect(cartItem.getTotal()).toEqual(75000);
            });


            it('should create an object', function () {
                var obj = cartItem.toObject();
                expect(obj.id).toEqual(3);
                expect(obj.name).toEqual('Nice Shirt');
                expect(obj.price).toEqual(25000);
                expect(obj.quantity).toEqual(2);
                expect(obj.image).toEqual('img/products/model1.jpg');
                expect(obj.total).toEqual(50000);
            });
        })
    });
});