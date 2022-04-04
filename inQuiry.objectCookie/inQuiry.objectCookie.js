/*!
 * PLUGIN inQuiry ObjectCookie V3.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 */
(function ($$) {
	"use strict";

    $$.fn.toCookie = function(name, days)
    {

        if(typeof this[0] === 'object' || this[0] instanceof Object) {
            
            var _cookie = new $$.cookie.create(name, days);

            $$.each(this[0], (key, value) => {

                var isJson = (typeof value !== 'string' || !value instanceof String)

                _cookie.keys.add(new $$.cookie.item(key, value, isJson));

            });
            
            _cookie.save();

        }

    }

})(inQuiry);
