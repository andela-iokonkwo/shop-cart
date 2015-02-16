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
