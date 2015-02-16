describe("filters", function () {
    var toNaira, toArray;
    beforeEach(module("shopApp.filters"));

    beforeEach(inject(function (nairacurrencyFilter, toArrayFilter) {
        toArray = toArrayFilter;
        toNaira = nairacurrencyFilter;
    }));
    describe("toArrayFilter", function () {

        it("should convert an object to an array of values", function() {
            var obj = {
                a: { name: 'A' },
                b: { name: 'B' },
                c: { name: 'C' }
            };
            expect(toArray(obj)).toEqual([
              {  name: 'A' },
              {  name: 'B' },
              {  name: 'C' }
            ]);
        });


        it("should not include $key if `addKey` param is false", function() {
            var obj = {
                a: { name: 'A' },
                b: { name: 'B' },
                c: { name: 'C' }
            };
            expect(toArray(obj, false)).toEqual([
              { name: 'A' },
              { name: 'B' },
              { name: 'C' }
            ]);
        });


        it("should work with non-object properties if $key is disabled", function() {
            var obj = {
                a: 'A',
                b: 'B',
                c: 'C'
            };
            expect(toArray(obj, false)).toEqual([
              'A',
              'B',
              'C'
            ]);

        });


        it("should handle invalid inputs", function() {
            expect(toArray(undefined)).toBeUndefined();
            expect(toArray(null)).toBe(null);
        });
    });

    describe("nairacurrencyFilter", function () {

        it("should format a set of number to currency with the naira symbol", function () {
            expect(toNaira(12345)).toEqual('₦12,345');
        });
    });
});