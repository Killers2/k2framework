/*!
 * PLUGIN inQuiry ToolTip  V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: jQuery, inQuiry.Extentions.js, inQuiry.toolTip.js
 */
(function ($) {
	"use strict";

    $.menuModalLoader = {
        ASYNC: 1, 
        IFRAME: 2, 
        CONTENT: 3, 
        SCRIPT: 4,
    }

    class menuModal {
		
        id;
        name;
        container;
        items;
        onMenuBuilt;
        prevSelected;

        constructor(options) {

            this.id = options.id;

            this.name = options.name;

            this.container = options.container;

            this.onMenuBuilt = options.onBuilt;

            this.items = [];

            this.prevSelected = null;

            for (var i = 0; i < options.items.length; i++) {

                this.items.push(this.menuItem(options.items[i]));

            }

            this.build();

        };

        menuItem = function (options) {
  
            var defaults = {
                loader: $.menuModalLoader.CONTENT,          // iframe or ajax 
                method: "",                                 // url or method of content 
                label: "",                                  // Button Label 
                fontAwsomeIconClass: "",                    // fontAwsome Icon Class
                eventConfig: null,                          // Events Config 
                toolTipConfig: null,                        // tool tip configuration
                button: null,                               // The button element.
                belongsTo: null,                            // The parent menu.
                disabled: false,                            // Disable this menu item on creation.
                section: null,                               // For enabling ajax embbed page requests.
            }
    
            options = $.extend({}, defaults, options);

            return {
                loader: options.loader,
                method: options.method,
                label: options.label,
                fontAwsomeIconClass: options.fontAwsomeIconClass,
                eventConfig: options.eventConfig,
                toolTipConfig: options.toolTipConfig,
                section: options.section,
                button: null,
                belongsTo: null,
                disabled: false,
                create: function (defaultClass, parent) {

                    this.belongsTo = parent;

                    var a = $("<li />", { 'data-uri-loader': options.loader }); 

                    if (options.loader == $.menuModalLoader.ASYNC || options.loader == $.menuModalLoader.IFRAME) {

                        a.attr('data-uri', options.method)

                    }

                    if (defaultClass) {

                        a.addClass(defaultClass)

                    }

                    if (options.toolTipConfig) {

                        $(a).uiToolTip({
                            content: options.toolTipConfig.content,
                            maxWidth: options.toolTipConfig.maxWidth,
                            position: options.toolTipConfig.toolTipPos,
                        });

                    }

                    a.html('<i class="' + options.fontAwsomeIconClass + '"></i><label>' + options.label + '</label>');

                    if (options.eventConfig) {

                        if (!options.eventConfig.onClickEvent) {

                            a.on("click", (evt) => { 

                                this.belongsTo.onItemClickDefault(a[0], this); 

                            });

                        } else {

                            a.on("click", (evt) => { 

                                options.eventConfig.onClickEvent(a[0], this); 

                            });

                        }

                    } else {

                        a.on("click", (evt) => { 

                            this.belongsTo.onItemClickDefault(a[0], this); 

                        });

                    }

                    this.button = a[0];

                    return this.button;

                }
            };

        };

        build = function () {

            var a, b, c, d, f, g, h, j, dClass = '';
            
            var me = this;

            $(me.container).attr('data-menu-modal-id', me.id);

            var a = $("<div />", { class: 'window-tab-menu' });
            var b = $("<div />", { class: 'window-tab-menu-screen' });

            var c = $("<ul />", { id: 'window-tab-menu' });
            $.each(me.items, (idx, item) => {

                if (!item.disabled) {

                    dClass = null;

                    if (idx == 0) { 
                        dClass = 'current'; 
                    }

                    if (idx == (me.items.length - 1)) { 
                        dClass = 'last'; 
                    }

                    c.append($(item.create(dClass, me)));

                }

            });
            a.append(c);

            var d = $("<div />", { class: 'window-tab-menu-row window-tab-menu-row-padding' });
            var f = $("<div />", { class: 'window-tab-menu-row window-tab-menu-row-height' });

            var g = $("<div />", { id: 'window-tab-menu-circle-logo', class: 'window-tab-menu-circle-logo', });
            var h = $("<div />", { id: 'window-tab-menu-circle-logo-text', class: 'window-tab-menu-circle-logo-text'});
            
            g.html("MM");
            h.html("Header Menu.");

            d.append(g);
            d.append(h);

            var progress = $("<div />", { id: 'window-tab-menu-view-progressbar', class: 'window-tab-menu-view-progressbar'});
            var j = $("<div />", { id: 'window-tab-menu-view', class: 'window-tab-menu-view'});
            
            f.append(progress);
            f.append(j);

            b.append(d);
            b.append(f);

            $(me.container).append(a);
            $(me.container).append(b);

            $(me.container).addClass('window-tabs-container');
                
            $($(me.container).find("#window-tab-menu")[0].children[0]).trigger("click");

            if (me.onMenuBuilt) {

                me.onMenuBuilt();

            }

        };

        onItemClickDefault = function (li, item) {

            var ul = li.parentNode;

            var viewBox = 'window-tab-menu-view';

            if (item.belongsTo.items.length > 1) {

                $.each(ul.children, (idx, liItem) => {
                    
                    $(liItem)
                        .removeClass('current')
                        .removeClass('before')
                        .removeClass('after');

                });

                $(li).addClass('current');

                if (li.previousSibling) {

                    $(li.previousSibling).addClass('before')

                }

                if (li.nextSibling) {

                    $(li.nextSibling).addClass('after')

                }

            }

            var hText = '';

            if (item.belongsTo.name) { 

                hText += item.belongsTo.name + ' / '; 

            }

            hText += $(li).find("label").html();

            $("#window-tab-menu-circle-logo-text").html(hText);

            $("#" + viewBox).html("");

            if (item.belongsTo.prevSelected) {
                
                if (item.belongsTo.prevSelected.eventConfig) {

                    window.document.removeEventListener('iframe.event.receiver', item.belongsTo.prevSelected.eventConfig.onIframeEventReceive, false);

                    if (item.belongsTo.prevSelected.eventConfig.onContentClear) {

                        item.belongsTo.prevSelected.eventConfig.onContentClear();

                    }

                }

            }

            item.belongsTo.prevSelected = item;

            if (item.loader == $.menuModalLoader.SCRIPT) {

                if (item.eventConfig) {

                    if (item.eventConfig.onContentLoading) {

                        item.eventConfig.onContentLoading();

                    }

                }

                if(typeof item.method === 'function') {

                    item.method(); // AS SCRIPT the prop URI is a function.

                }

                if (item.eventConfig) {

                    if (item.eventConfig.onContentLoaded) {

                        item.eventConfig.onContentLoaded();

                    }

                }

            }

            if (item.loader == $.menuModalLoader.CONTENT) {

                if (item.eventConfig) {

                    if (item.eventConfig.onContentLoading) {

                        item.eventConfig.onContentLoading();

                    }

                }

                $("#" + viewBox).html(item.method); // AS CONTENT the prop URI is html content.
               
                if (item.eventConfig) {

                    if (item.eventConfig.onContentLoaded) {

                        item.eventConfig.onContentLoaded();

                    }

                }

            }

            if (item.loader == $.menuModalLoader.IFRAME) {

                var a = $("<iframe />", { id: 'window-tab-menu-window-iframe', class: 'window-tab-menu-window-iframe', frameborder: '0' });

                if(item.method != null) {

                    a.attr('src', item.method); // AS IFRAME the prop URI is url of the site content.

                }

                $("#" + viewBox).append(a);

                if (item.eventConfig) {

                    if (item.eventConfig.onIframeEventReceive) {

                        window.document.addEventListener('iframe.event.receiver', item.eventConfig.onIframeEventReceive, false);

                    }

                }

            }

            if (item.loader == $.menuModalLoader.ASYNC) {
               
                if (item.eventConfig) {

                    if (item.eventConfig.onContentLoading) {

                        item.eventConfig.onContentLoading();

                    }

                }

                var pjaxOption = null;
                var pjaxAutoRun = true;

                if(item.section)
                {
                    pjaxOption = { 
                        fragment: item.section, 
                        requestUrl: item.method
                    };
                }

                $.ajax({ 
                    type: "get", 
                    url: item.method,  // AS ASYNC the prop URI is url of the ajax site content.
                    beforeSend: (xhr, options) => {

                        $('.window-tab-menu-view-progressbar').removeClass('hide');

                    },
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                
                        // Upload progress
                        xhr.upload.addEventListener("progress", function(evt){
                            if (evt.lengthComputable) {
                                var percentComplete = ((evt.loaded / evt.total) * 100);

                                $('.window-tab-menu-view-progressbar').css("width",  percentComplete + "%");

                                if (percentComplete === 100) 
                                {
                                    $('.window-tab-menu-view-progressbar').addClass('hide');
                                } 
                            }
                       }, false);
                       
                       // Download progress
                       xhr.addEventListener("progress", function(evt){
                           if (evt.lengthComputable) {
                            var percentComplete = ((evt.loaded / evt.total) * 100);

                            $('.window-tab-menu-view-progressbar').css("width",  percentComplete + "%");

                            if (percentComplete === 100) 
                            {
                                $('.window-tab-menu-view-progressbar').addClass('hide');
                            } 
                        }
                       }, false);
                       
                       return xhr;
                    },
                    success: (data, status, xhr) => {

                        if(pjaxOption && $.inQuiry.pjax) {

                            var pjax = new $.inQuiry.pjax();

                            // Lets get the contents
                            var page = pjax.extractContainer(data, xhr, pjaxOption);
                            
                            // Clear out any focused controls before inserting new page contents.
                            try {

                                document.activeElement.blur();

                            } catch (e) { }

                            //Set the document title based on loaded content
                            if (page.title) {

                                document.title = page.title;

                            }

                            var context = $("#" + viewBox);

                            pjax.renderTags([...page.scripts, ...page.cssLinks], () => {

                                context.html(page.contents);

                                //Add inline scripts
                                context.append(page.scripts.filter((idx, s) => s.src == ""));

                                // FF bug: Won't autofocus fields that are inserted via JS.
                                // This behavior is incorrect. So if theres no current focus, autofocus the last field.
                                var autofocusEl = context.find('input[autofocus], textarea[autofocus]').last()[0];

                                if (autofocusEl && document.activeElement !== autofocusEl) {

                                    autofocusEl.focus();

                                }

                                var scrollTo = page.scrollTo;

                                // Ensure browser scrolls to the element referenced by the URL anchor
                                if (page.url.hash) {

                                    var name = decodeURIComponent(page.url.hash.slice(1));

                                    var target = document.getElementById(name) || document.getElementsByName(name)[0];

                                    if (target) {

                                        scrollTo = $(target).offset().top;

                                    }

                                }

                                if (typeof scrollTo == 'number') {

                                    $(window).scrollTop(scrollTo);

                                }

                                if(pjaxAutoRun) {

                                    context.find("script").each((idx, item) => {

                                        eval($(item).text());

                                    });

                                }

                                if (item.eventConfig) {
    
                                    if (item.eventConfig.onContentLoaded) {
            
                                        item.eventConfig.onContentLoaded();
            
                                    }
            
                                }

                            });

                        }
                        else
                        {

                            $("#" + viewBox).html(data);
    
                            if(pjaxAutoRun) {

                                $("#" + viewBox).find("script").each((idx, item) => {

                                    eval($(item).text());

                                });

                            }

                            if (item.eventConfig) {
    
                                if (item.eventConfig.onContentLoaded) {
        
                                    item.eventConfig.onContentLoaded();
        
                                }
        
                            }

                        }

                    },
                    error: (xhr, status, error) => {

                    },
                    statusCode: {
                         500: (xhr) => { }
                    } 
                });

            }

        };

    }

    $.fn.menuModal = function(options)
    {

        var defaults = {
            id: "menu-modal",
            name: "menuModal",
            container: this[0],
            items: [],
            onBuilt: () => {}
        }

        options = $.extend({}, defaults, options);

        this[0].menuModal = new menuModal(options);

        return this;

    }

})(jQuery);