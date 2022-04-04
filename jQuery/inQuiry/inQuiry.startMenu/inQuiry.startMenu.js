/*!
 * PLUGIN inQuiry startMenuPopup  V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 March 2022)
 * @Dependencies: jQuery, inQuiry.Extentions.js
 */
(function ($) {
	"use strict";

    class startMenuPopup {      

        constructor(options) {
            
            this.keyDownTimeout = null;
            this.keyDownDelayTimer = options.searchDelay;  //milli seconds
            this.container = options.container;
            this.onSearchEvent = options.searchApi;
            this.allowSearchNoText = options.allowSearchNoText;
            this.minCharsOnSearch = options.minCharsOnSearch;

            this.container.classList.add('start-menu-container');

            var a = document.createElement('div');
            a.classList.add('start-menu-row');

            this.container.append(a);
            this.container.append(a.cloneNode());

            var bdiv = document.createElement('div');
            bdiv.classList.add('start-menu-search-container');

            var b = document.createElement('input');
            b.setAttribute('type', 'text');
            b.setAttribute('name', 'startMenuSearch');
            b.classList.add('start-menu-search');

            bdiv.append(b);

            this.container.children[0].append(bdiv);

            var ddiv = document.createElement('div');
            ddiv.setAttribute('class', 'start-menu-search-results');
           
            this.container.children[1].classList.add('start-menu-row-scroll');
            this.container.children[1].append(ddiv);

            $(this.container).find("input[name='startMenuSearch']").on("keyup", (evt) => {

                evt.preventDefault();
    
                var term = $("input[name='startMenuSearch']").val();
    
                if(this.allowSearchNoText)
                {

                    if (evt.keyCode != 13 && (term.length == 0 || term.length > this.minCharsOnSearch)) {

                        this.runSearch(term);

                    }

                }
                else
                {

                    if (evt.keyCode != 13 && term.length > this.minCharsOnSearch) {

                        this.runSearch(term);

                    }

                }
    
            });
 
            this.runSearch = (searchTerm) => {
    
                if (this.keyDownTimeout) { 

                    clearTimeout(this.keyDownTimeout); 

                }

                this.keyDownTimeout = setTimeout(() => {

                    this.onSearchEvent(searchTerm);
            
                }, this.keyDownDelayTimer);
    
            };

        }

    }

    $.fn.startMenu = function(options)
    {
        
        if(this.length <= 0) { 

            return this; 

        }

        var defaults = {
            container: this[0],
            searchDelay: 350,
            allowSearchNoText: true,
            minCharsOnSearch: 1,
            searchApi: (term) => { }
        }

        this[0].startMenu = new startMenuPopup($.extend({}, defaults, options));

        return this;

    }

})(jQuery);
