/*!
 * PLUGIN inQuiry ToolTip  V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: JQuery, inQuiry.Extentions.js
 */
(function ($) {
	"use strict";

    $.uiToolTipPos = { 
        LEFT: 1, 
        RIGHT: 2, 
        TOP: 4, 
        BOTTOM: 8,
        FREETOPLEFT: 16,
        FREETOPRIGHT: 32,
        FREEBOTTOMLEFT: 64,
        FREEBOTTOMRIGHT: 128
    };

    class uiToolTip {
        constructor(options) {
            this.alpha = 0;         
            this.endalpha = options.alpha;            
            this.content = options.content;
            this.maxWidth = options.maxWidth;
            this.speed = options.speed;
            this.delay = options.delay;
            this.alpha = options.alpha;
            this.hideDelay = options.hideDelay;
            this.position = options.position;
            this.element = options.element;
            this.defaultFreeTop = 8;
            this.defaultFreeLeft = 8;
            this.defaultFreeHeight = 0;
            this.ttElement = null;            
            this.enabled = true;
            this.id = $.inQuiry.generateUuid();
            this.ie = !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);

            var c = new $.inQuiry.cookie.create('uitooltip', null);

            if (c.read() != null) { 

                this.enabled = (c.keys['enabled'] == 'true' ? true : false); 

            }

            var mouseenterEvent = function(evt) 
            {                    
                if(evt.target.uiToolTip) {
        
                    evt.target.uiToolTip.show(); 

                }
            };

            var mouseoutEvent = function(evt)
            {
                if(evt.target.uiToolTip) {
    
                    evt.target.uiToolTip.hide(); 
                    
                }
            };

            this.element.addEventListener("mouseenter", mouseenterEvent);
    
            this.element.addEventListener("mouseleave", mouseoutEvent);

            this.show = () => {

                if (!this.enabled) { 
                    
                    return; 

                }

                var exsits = document.getElementById(this.id);
                
                if(exsits != null) {

                    exsits.remove();

                }

                this.ttElement = $("<div />", { id: this.id, class: "ui-tooltip"});
               
                var content = $("<div />", { class: "ui-tooltip-content" });
               
                content.html(this.content);

                this.ttElement.append(content);

                this.ttElement[0].style.opacity = 0;
                this.ttElement[0].style.filter = 'alpha(opacity=0)';
                this.ttElement[0].style.display = 'block';
                this.ttElement[0].style.width = this.maxWidth ? this.maxWidth + 'px' : 'auto';
               
                $("body").append(this.ttElement);

                if (!this.maxWidth && this.ie) {

                    content[0].style.display = 'none';

                    this.ttElement[0].style.width = tt.offsetWidth;

                    content[0].style.display = 'block';

                }

                if (this.ttElement[0].offsetWidth > this.maxWidth) { 
                    
                    this.ttElement[0].style.width = this.maxWidth + 'px'; 
                
                }

                var offSet = $(this.element).offset();

                if (this.position == $.uiToolTipPos.TOP) { 
                
                    this.ttElement[0].style.top = offSet.top - (this.ttElement[0].offsetHeight + 8) + 'px';

                    this.ttElement[0].style.left = offSet.left - ((this.ttElement[0].offsetWidth - this.element.offsetWidth) / 2) + 'px';
                    
                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-right")
                        .removeClass("ui-tooltip-arrow-top")
                        .addClass("ui-tooltip-arrow-bottom");

                }

                if (this.position == $.uiToolTipPos.RIGHT) { 
                    
                    this.ttElement[0].style.top = offSet.top - (this.ttElement[0].offsetHeight / 2) + (this.element.offsetHeight / 2) + 'px';
                    
                    this.ttElement[0].style.left = (this.element.offsetWidth + 10 + offSet.left) + 'px';
                    
                    this.ttElement
                        .removeClass("ui-tooltip-arrow-right")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-top")
                        .addClass("ui-tooltip-arrow-left");

                }    

                if (this.position == $.uiToolTipPos.BOTTOM) { 
                    
                    this.ttElement[0].style.top = (offSet.top + this.ttElement[0].offsetHeight) + 'px';
                    
                    this.ttElement[0].style.left = offSet.left - ((this.ttElement[0].offsetWidth - this.element.offsetWidth) / 2) + 'px';
                    
                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-right")
                        .addClass("ui-tooltip-arrow-top");

                }

                if (this.position == $.uiToolTipPos.LEFT) { 
                    
                    this.ttElement[0].style.top = offSet.top - (this.ttElement[0].offsetHeight / 2) + (this.element.offsetHeight / 2) + 'px';
                    
                    this.ttElement[0].style.left = ((offSet.left - this.ttElement[0].offsetWidth) - 12) + 'px';

                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-top")
                        .addClass("ui-tooltip-arrow-right");
                
                }
   
                if (this.position == $.uiToolTipPos.FREETOPLEFT) { 
                   
                    this.defaultFreeHeight = this.ttElement[0].offsetHeight + this.defaultFreeTop;
                    this.defaultFreeLeft = -this.ttElement[0].offsetWidth;

                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-top")
                        .removeClass("ui-tooltip-arrow-right");
                
                    $(document).on("mousemove", this.getPosition);

                }

                if (this.position == $.uiToolTipPos.FREETOPRIGHT) { 
                   
                    this.defaultFreeHeight = this.ttElement[0].offsetHeight + this.defaultFreeTop;

                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-top")
                        .removeClass("ui-tooltip-arrow-right");
                
                    $(document).on("mousemove", this.getPosition);

                }

                if (this.position == $.uiToolTipPos.FREEBOTTOMLEFT) { 
                   
                    this.defaultFreeHeight = -this.ttElement[0].offsetHeight;
                    this.defaultFreeLeft = -this.ttElement[0].offsetWidth; 

                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-top")
                        .removeClass("ui-tooltip-arrow-right");
                
                    $(document).on("mousemove", this.getPosition);

                }
                
                if (this.position == $.uiToolTipPos.FREEBOTTOMRIGHT) { 
                   
                    this.defaultFreeHeight = -this.ttElement[0].offsetHeight + this.defaultFreeTop;

                    this.ttElement
                        .removeClass("ui-tooltip-arrow-left")
                        .removeClass("ui-tooltip-arrow-bottom")
                        .removeClass("ui-tooltip-arrow-top")
                        .removeClass("ui-tooltip-arrow-right");
                
                    $(document).on("mousemove", this.getPosition);

                }

                this.ttElement.fadeTo(this.delay, this.alpha);

            };

            this.getPosition = (e) => {


                this.ttElement[0].style.top = (e.pageY - this.defaultFreeHeight) + 'px';

                this.ttElement[0].style.left = (e.pageX + this.defaultFreeLeft) + 'px';

            };

            this.hide = () => {

                $(document).off("mousemove", this.getPosition);

                this.ttElement.fadeTo(this.hideDelay, 0, (evt) => {

                    this.ttElement.remove();

                });

            };

            this.enable = () => {

                this.enabled = true;

                this.save();

            };

            this.disable = () => {

                this.enabled = false;

                this.save();

            };

            this.save = () => {

                var c = new $.inQuiry.cookie.create('uitooltip', null);

                if (c.read() != null) { 
                    
                    c.remove(); 

                }

                c = new $.inQuiry.cookie.create('uitooltip', 365);

                c.keys.add(new $.inQuiry.cookie.item('enabled', (this.enabled ? 'true' : 'false')));

                c.save();

            };

            this.destroy = () => {

                $(this.ttElement).remove();

                this.element.removeEventListener("mouseenter", mouseenterEvent);
    
                this.element.removeEventListener("mouseout", mouseoutEvent);
    
            };

        }
    }

    $.fn.uiToolTip = function (options) {

        var defaults = {
            content: "",
            maxWidth: null,
            delay: 150,
            alpha: 75,
            hideDelay: 100,
            position: $.uiToolTipPos.TOP,
            element: null
        };
   
        this.each((idx, item) => {

            var inQuiryItem = $(item);

            if(inQuiryItem[0].uiToolTip)
            {
                inQuiryItem[0].uiToolTip.destroy();
                inQuiryItem[0].uiToolTip = null;
                
            }

            var config = $.extend({}, defaults, options);

            config.element = inQuiryItem[0];

            if (inQuiryItem.attr("ui-tooltip")) {

                config.content = inQuiryItem.attr("ui-tooltip");
    
            }
    
            if (inQuiryItem.attr("ui-tooltip-maxwidth")){
    
                config.maxWidth = inQuiryItem.attr("ui-tooltip-maxwidth");

            }
    
            if (inQuiryItem.attr("ui-tooltip-point")) {
    
                config.position = $.uiToolTipPos[inQuiryItem.attr("ui-tooltip-point").toUpperCase()];
    
            }

            inQuiryItem[0].uiToolTip = new uiToolTip(config); 

        });

    };

    $.fn.uiToolTipEnable = function () {

        this.each(function(idx, inQuiryItem){

            if(inQuiryItem.uiToolTip)
            {

                inQuiryItem.uiToolTip.enable();

            }

        });

    };

    $.fn.uiToolTipDisable = function () {

        this.each(function(idx, inQuiryItem){

            if(inQuiryItem.uiToolTip)
            {

                inQuiryItem.uiToolTip.disable();

            }

        });

    };

    $.fn.uiToolTipHide = function () {

        this.each(function(idx, inQuiryItem){

            if(inQuiryItem.uiToolTip)
            {

                inQuiryItem.uiToolTip.hide();

            }

        });

    };

})(jQuery);

//Ui StartUp
$(document).ready(function(){ $("[ui-tooltip]").uiToolTip(); });