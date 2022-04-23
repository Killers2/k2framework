/*!
 * PLUGIN inQuiry Extentions for Jquery  V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: JQuery
 */
(function ($) {
	"use strict";

    //inQuiry Extentions************************************************************************

    $.inQuiry = {};

    //Local variables
    $.inQuiry.version = '4.2.5';

    class ICookieCollection extends Array {
        add = function (obj) { 

            this.push(obj); 

            return this;

        };
        exsits = function (key) {

            for (var i = 0; i < this.length; i++) { 

                if (this[i].key == key) { 

                    return true; 

                } 

            }

            return false;

        };
        removeAll = function () { 

            this.splice(0, this.length);

            return this;

        };
        removeByKey = function (name) {

            var idx = -1;

            for (var i = 0; i < this.length; i++) {

                if (this[i].key == name) { 

                    idx = i;

                }

            }

            this.removeByIndex(idx);

            return this;

        };
        removeByValue = function (value) {

            var idx = -1;

            for (var i = 0; i < this.length; i++) {

                if (this[i].value == value) { 

                    idx = i;

                }

            }

            this.removeByIndex(idx);

            return this;

        };
        removeByIndex = function (index) {

            if (index < 0 || index > this.length - 1) { 

                return this; 

            }

            this.splice(index, 1);

            return this; 

        };
        removeDuplicates = function ()
        {
            var output = new ICookieCollection();
            
            label: for (var i = 0; i < this.length; i++) {
                
                for (var j = 0; j < output.length; j++) {
                    
                    if (output[j].toString() == this[i].toString()) { 
                    
                        continue label;

                    }

                }

                output[output.length] = this[i];

            }

            return output; 

        };
    };

	class draggableMemory {
		constructor() {
			this.active = false;
			this.enabled = true;
			this.currentX = 0;
			this.currentY = 0;
			this.initialX = 0;
			this.initialY = 0;
			this.xOffset = 0;
			this.yOffset = 0;
			this.currentElement = null;
			this.options = null;
			this.maxLeft = 0;
			this.maxTop = 0;
			this.maxBottom = 0;
			this.maxRight = 0;
			this.totalHeight = 0;
			this.totalWidth = 0;
			this.dragInit = (e) => {

				this.options.containment.on("mousedown", this.dragStart);

				this.options.containment.on("touchstart", this.dragStart);
		
			};
			this.dragStart = (e) => {

				if (!this.enabled) {
					
					return;

				}

				if (this.options) {

					this.options.drag(e, this.currentElement);

				}

				this.maxBottom = this.maxTop + this.options.containment.height() - this.options.containment.offset().top;
				this.maxRight = this.maxLeft + this.options.containment.width() - this.options.containment.offset().left;
				this.totalHeight = $(this.currentElement).height();
				this.totalWidth = $(this.currentElement).width();

				if (e.type === "touchstart") {
					this.initialX = e.touches[0].clientX - this.xOffset;
					this.initialY = e.touches[0].clientY - this.yOffset;
				} else {
					this.initialX = e.clientX - this.xOffset;
					this.initialY = e.clientY - this.yOffset;
				}

				if (e.target === this.options.handle[0]) {

					this.options.containment.on("touchend", this.dragEnd);
					this.options.containment.on("touchmove", this.draging);
					this.options.containment.on("mouseup", this.dragEnd);
					this.options.containment.on("mousemove", this.draging);

					this.active = true;

				}

			};
			this.draging = (e) =>  {

				if (this.active) {

					e.preventDefault();

					this.options.drag(e, this.currentElement);

					if (e.type === "touchmove") {
						this.currentX = e.touches[0].clientX - this.initialX;
						this.currentY = e.touches[0].clientY - this.initialY;
					} else {
						this.currentX = e.clientX - this.initialX;
						this.currentY = e.clientY - this.initialY;
					}

					this.xOffset = this.currentX;
					this.yOffset = this.currentY;
					
					if(this.options.containment)
					{

						var deltaX, deltaY;

						if(this.currentX > this.maxLeft && (this.currentX + this.totalWidth) < this.maxRight) {
							deltaX = this.currentX;
						}

						if(this.currentY > this.maxTop && (this.currentY + this.totalHeight) < this.maxBottom) {
							deltaY = this.currentY;
						}

						$(this.currentElement).css({ transform: "translate(" + deltaX + "px," + deltaY + "px)", transition: "0s" });
						
					}
					else
					{

						$(this.currentElement).css({ transform: "translate(" + this.currentX + "px," + this.currentY + "px)", transition: "0s" });

					}

				}

			};
			this.dragEnd = (e) => {

				this.initialX = this.currentX;
				this.initialY = this.currentY;

				this.active = false;

				this.options.containment.off("touchend", this.dragEnd);
				this.options.containment.off("touchmove", this.draging);
				this.options.containment.off("mouseup", this.dragEnd);
				this.options.containment.off("mousemove", this.draging);
				this.options.containment.off("mousedown", this.dragStart);
				this.options.containment.off("touchstart", this.dragStart);

			};
		}
	};

	var resizableMemory = {
		startX: 0,
		startY: 0,
		startWidth: 0,
		startHeight: 0,
		currentElement: null,
		options: null,
		initDrag: function (e) {

			resizableMemory.currentElement = $(e.currentTarget).closest(".resizable")[0];
		
			if(resizableMemory.options) {

				resizableMemory.options.start(e, resizableMemory.currentElement);

			}

			resizableMemory.startX = e.clientX;

			resizableMemory.startY = e.clientY;

			resizableMemory.startWidth = parseInt(document.defaultView.getComputedStyle(resizableMemory.currentElement).width, 10);

			resizableMemory.startHeight = parseInt(document.defaultView.getComputedStyle(resizableMemory.currentElement).height, 10);

			document.documentElement.addEventListener('mousemove', resizableMemory.doDrag, false);

			document.documentElement.addEventListener('mouseup', resizableMemory.stopDrag, false);

		},
		doDrag: function (e) {
			
			if(resizableMemory.options) {

				resizableMemory.options.resize(e, resizableMemory.currentElement);

			}

			resizableMemory.currentElement.style.width = (resizableMemory.startWidth + e.clientX - resizableMemory.startX) + 'px';
			resizableMemory.currentElement.style.height = (resizableMemory.startHeight + e.clientY - resizableMemory.startY) + 'px';

		},
		stopDrag: function (e) {

			if(resizableMemory.options) {

				resizableMemory.options.stop(e, resizableMemory.currentElement);

			}

			document.documentElement.removeEventListener('mousemove', resizableMemory.doDrag, false);

			document.documentElement.removeEventListener('mouseup', resizableMemory.stopDrag, false);

		}		
	};

    $.inQuiry.generateUuid = function() {
        //uuid version 4
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
   
    };

    $.inQuiry.toTimeAgo = function(time) {

        switch (typeof time) {
            case 'number':
                break;
            case 'string':
                time = +new Date(time);
                break;
            case 'object':
                if (time.constructor === Date) time = time.getTime();
                break;
            default:
                time = +new Date();
        }

        var time_formats = [
            [60, 'seconds', 1],
            [120, '1 minute ago', '1 minute from now'],
            [3600, 'minutes', 60], 
            [7200, '1 hour ago', '1 hour from now'],
            [86400, 'hours', 3600],
            [172800, 'Yesterday', 'Tomorrow'], 
            [604800, 'days', 86400],
            [1209600, 'Last week', 'Next week'],
            [2419200, 'weeks', 604800],
            [4838400, 'Last month', 'Next month'],
            [29030400, 'months', 2419200],
            [58060800, 'Last year', 'Next year'],
            [2903040000, 'years', 29030400],
            [5806080000, 'Last century', 'Next century'],
            [58060800000, 'centuries', 2903040000]
        ];

        var seconds = (+new Date() - time) / 1000, token = 'ago', list_choice = 1;
       
        if (seconds == 0) { 

            return 'Just now'; 

        }
        
        if (seconds < 0) {

            seconds = Math.abs(seconds);

            token = 'from now';

            list_choice = 2;

        }
       
        var i = 0, format;
       
        while (format = time_formats[i++]) { 

            if (seconds < format[0]) { 
                
                if (typeof format[2] == 'string') { 

                    return format[list_choice]; 

                } else { 

                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token; 

                } 

            } 

        }
        
        return time;

    };

    $.inQuiry.formatXml = function(xml) {

        var formatted = '';

        var reg = /(>)(<)(\/*)/g;

        xml = xml.replace(reg, '$1\r\n$2$3');

        var pad = 0;

        $.each(xml.split('\r\n'), (idx, node) => {

            var indent = 0;

            if (node.match(/.+<\/\w[^>]*>$/)) {

                indent = 0;

            } else if (node.match(/^<\/\w/)) {

                if (pad != 0) { pad -= 1; }

            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {

                indent = 1;

            } else {

                indent = 0;

            }

            var padding = '';

            for (var i = 0; i < pad; i++) { 

                padding += '  '; 

            }

            formatted += padding + node + '\r\n';

            pad += indent;

        });

        return formatted;

    };

    $.inQuiry.insertAtCaret = function (element, text) {

        var txtarea = $(element)[0];

        var scrollPos = txtarea.scrollTop;

        var strPos = 0;

        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "ff" : (document.selection ? "ie" : false));

        if ($$.browser.msie) {

            txtarea.focus();

            var range = document.selection.createRange();

            range.moveStart('character', -txtarea.value.length);

            strPos = range.text.length;

        }
        else if (br == "ff") {
            
            strPos = txtarea.selectionStart;

        }

        var front = (txtarea.value).substring(0, strPos);

        var back = (txtarea.value).substring(strPos, txtarea.value.length);

        txtarea.value = front + text + back;

        strPos = strPos + text.length;

        if (br == "ie") {

            txtarea.focus();

            var range = document.selection.createRange();

            range.moveStart('character', -txtarea.value.length);

            range.moveStart('character', strPos);

            range.moveEnd('character', 0);

            range.select();

        }      
        else if (br == "ff") {

            txtarea.selectionStart = strPos;

            txtarea.selectionEnd = strPos;

            txtarea.focus();

        }

        txtarea.scrollTop = scrollPos;

    };

    $.inQuiry.getContrast = function (hexcolor) {

        hexcolor = hexcolor.replace("#", "");

        var r = parseInt(hexcolor.substr(0, 2), 16);

        var g = parseInt(hexcolor.substr(2, 2), 16);

        var b = parseInt(hexcolor.substr(4, 2), 16);

        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        return (yiq >= 128) ? '#000' : '#FFF';

    };

    $.inQuiry.isDescendant = function(ancestor, descendant){

        if(ancestor === descendant)
        {
            return true;
        }

        if((ancestor.compareDocumentPosition(descendant) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 && (ancestor.compareDocumentPosition(descendant) & Node.DOCUMENT_POSITION_DISCONNECTED) > 0)
        {
            return true;
        }

        if((ancestor.compareDocumentPosition(descendant) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 && (ancestor.compareDocumentPosition(descendant) & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0)
        {
            return true;
        }

        return ancestor.compareDocumentPosition(descendant) & Node.DOCUMENT_POSITION_CONTAINS > 0 ? true : false;

    };  

    $.inQuiry.isAncestor = function(descendant, ancestor){

        if(ancestor === descendant)
        {
            return true;
        }

        return (descendant.compareDocumentPosition(ancestor) & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0;
    };

    $.inQuiry.mouseIntersects = function(element, event, zoom) {

        if (!zoom) { zoom = 1; }

        var iele = $(element);

        var oSet = iele.offset();
        var oWidth = iele.width();
        var oHeight = iele.height();

        oSet.top = oSet.top * zoom;
        oSet.left = oSet.left * zoom;

        if (event.pageX >= oSet.left && event.pageY >= oSet.top && event.pageX <= (oSet.left + oWidth) && event.pageY <= (oSet.top + oHeight)) {
            return true;
        }
        else {
            return false;
        }

    };

    $.inQuiry.ajax = function (options) {
        
        //error can be either the general function "(e) => { alert(e.message); }" or an object with functions representing the statusCode and general.
        //{
        //  xhr: (xhr) => {  alert(xhr.message); },
        //  302: (xhr) => { }
        //}       
        
        if (!options) { 

            return; 

        }

        var defaults = {
            url: "",
            data: "",
            type: "GET",
            dataType: "string",
            mimeType: "text/html",
            contentType: "",
            headers: { },
            async: true,
            crossDomain: false,
            cache: false,
            xhr: null,
            beforeSend: (xhr, options) => { },
            success: (response, xhr, options) => { },
            error: { 
                xhr: (xhr, options) => { },
                500: (xhr, options) => { },
                302: (xhr, options) => { }
            },
        };

        options = inQuiry.merge(defaults, options)

        return new Promise((resolve, reject) => {

            var ajaxRequest;

            if (options.xhr && typeof options.xhr === 'function') {

                ajaxRequest = options.xhr();

            } else {

                try {
                    
                    ajaxRequest = new XMLHttpRequest();
                    
                    if (ajaxRequest.overrideMimeType)  { 

                        ajaxRequest.overrideMimeType(options.mimeType);

                    }

                } catch {

                    try {
                        
                        ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
                
                    } catch {
                        
                        try {
                            
                            ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                        
                        } catch {
                            
                            console.log({ message: "Your browser does not support AJAX (XMLHTTP)" });
                        
                        }
                    }

                }

            }
            
            if (!ajaxRequest) { 
                return;
            }

            var errorFunc;
        
            if (options.error && typeof options.error === 'function') {
        
                errorFunc = options.error;
        
            } else {
        
                errorFunc = options.error["xhr"];
            
            }

            ajaxRequest.onreadystatechange = function () {
        
                if (ajaxRequest.readyState !== 4) { return; }

                if (ajaxRequest.status == 200) {
                    
                    resolve(ajaxRequest);

                    if (options.success) {
                        
                        try {
                        
                            options.success(JSON.parse(ajaxRequest.responseText), ajaxRequest, options);
                            
                        } catch {
                    
                            options.success(ajaxRequest.responseText, ajaxRequest, options);
                            
                        }

                    }

                }
                else 
                {

                    reject(ajaxRequest);

                    if (options.error && typeof options.error === 'object') {
                        
                        var statusCodeMethod = options.error[ajaxRequest.status.toString()];
                
                        if (statusCodeMethod)  {

                            statusCodeMethod(ajaxRequest, options);

                        } else {

                            if(errorFunc) {
                            
                                errorFunc(ajaxRequest, options);
                        
                            } else {
                        
                                console.log("xhr error: " + ajaxRequest.status.toString() + " - " + ajaxRequest.responseText);
                            
                            }

                        }
                    }
                }

            };

            if(options.cache) {
                ajaxRequest.cache = options.cache;
            }

            ajaxRequest.open(options.type, options.url, options.async);

            if (options.contentType) {
            
                ajaxRequest.setRequestHeader("Content-type", options.contentType);
        
            }

            if (options.headers) {
                
                if (options.crossDomain != null && options.crossDomain && !options.headers["X-Requested-With"] ) {
                    options.headers["X-Requested-With"] = "XMLHttpRequest";
                }
                
                Object.keys(options.headers).forEach((property) => {
                    ajaxRequest.setRequestHeader(property, options.headers[property]);
                });

            } 

            if (options.type == 'GET') {
            
                if (options.beforeSend) {
                    options.beforeSend(ajaxRequest, options);
                }

                try {
            
                    ajaxRequest.send();
            
                } catch {
                
                    var message = { message: "There was an error with the ajax request." };
                
                    console.log(message);
                    if(errorFunc) {
                        errorFunc(ajaxRequest, message);
                    }
                }

            } else {
            
                try { 
                
                    var sendData = '';
                
                    if (options.dataType == 'string') {
                        sendData = options.data;
                    }
                
                    if (options.dataType == 'json') {
                        sendData = JSON.stringify(options.data);
                    }
            
                } catch {
                
                    var message = { message: "There was an error setting up the ajax request." };
                
                    console.log(message);
                    if(errorFunc) {
                        errorFunc(ajaxRequest, message);
                    }
                }
                
                if (options.beforeSend) {
                    options.beforeSend(ajaxRequest);
                }
            
                try {
                
                    ajaxRequest.send(sendData);
            
                } catch {
                
                    var message = { message: "There was an error with the ajax request." };
                
                    console.log(message);
                    if(errorFunc) {
                        errorFunc(ajaxRequest, message);
                    }
                }

            }

        });

    };

    $.inQuiry.socket = function (host, onOpen, onParse, onClose, onError) {
        this.socket = null;
        this.host = host;
        this.onOpenEvent = onOpen;
        this.onParseEvent = onParse;
        this.onCloseEvent = onClose;
        this.onErrorEvent = onError;

        var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
        
        if (support == null) { 
            console.log("Your browser does not support WebSockets")
            return; 
        }

        this.socket = new window[support]('ws' + (location.protocol.indexOf("s") > 0 ? 's' : '') + '://' + host);

        this.send = (data) =>
        {

            try {

                this.socket.send(data);

            } catch (ex) {

                if (this.onErrorEvent) {

                    this.onErrorEvent(this.socket, ex);

                }

                this.socket.close();

            }
            
        }

        this.socket.onopen = () => 
        {

            try {

                if (this.onOpenEvent) {

                    this.onOpenEvent(this.socket);

                }

            } catch (ex) {

                if (this.onErrorEvent) {

                    this.onErrorEvent(this.socket, ex);

                }

                this.socket.close();

            }

        };

        this.socket.onmessage = (evt) => {

            try {

                if (this.onParseEvent) {

                    this.onParseEvent(this.socket, evt);

                }

            } catch (ex) {

                if (this.onErrorEvent) {

                    this.onErrorEvent(this.socket, ex);

                }

                this.socket.close();

            }

        };

        this.socket.onclose = () =>  {

            try {

                if (this.onCloseEvent) {

                    this.onCloseEvent(this.socket);

                }

                this.socket.close();

            } catch (ex) {

                if (this.onErrorEvent) {

                    this.onErrorEvent(this.socket, ex);

                }

                this.socket.close();

            }

        };

        return this;

    };

	$.inQuiry.pjax = function() {

        this.stripSearchParams = function (url) {

            url.search = url.search.replace(/([?&])(_pjax|_)=[^&]*/g, '');

            return url.href.replace(/\?($|#)/, '$1');

        };

        this.parseHTML = function (html) {
           
            return new DOMParser().parseFromString(html, 'text/html');

        };

        this.extractContainer = function(data, xhr, options) {
            
            var obj = {}, fullDocument = /<html/i.test(data);

            // Prefer X-PJAX-URL header if it was set, otherwise fallback to using the original requested url.
            var serverUrl = xhr.getResponseHeader('X-PJAX-URL');

            if(options.requestUrl == "")
            {

                options.requestUrl = xhr.responseURL;

            }

            obj.url = serverUrl ? stripSearchParams(new URL(serverUrl)) : options.requestUrl;
          
            obj.url = new URL(obj.url);

            // Attempt to parse response html into elements
            if (fullDocument) {

              var $head = $(this.parseHTML(data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0]).head).contents();

              var $body = $(this.parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]).body).contents();

            } else {

              var $head = $body = $(this.parseHTML(data).body).contents();

            }
          
            // If response data is empty, return fast
            if ($body.length === 0) {

              return obj;

            }

            // If there's a <title> tag in the header, use it as the page's title.
            var titleNode = $head.find("title");

            if(titleNode.length <= 0)
            {

                var titleElement = document.createElement("title");

                titleElement.innerHTML = '';

                $head.push(titleElement);

                titleNode = $($head[$head.length - 1]);

            }

            obj.title = titleNode.text();
          
            if (fullDocument) {
                
                if(options.fragment == null)
                {
                    options.fragment = 'body';
                }

                // If they specified a fragment, look for it in the response and pull it out.
                if (options.fragment === 'body') {

                    var $fragment = $body;

                } else {

                    var $fragment = $body.filter((i, e) => {
                        
                        if(options.fragment.includes("[") && !options.fragment.startsWith("[")) {

                            var lookingForNode = options.fragment.substring(0, options.fragment.indexOf("["));
                            var lookingForKey = options.fragment.substring(options.fragment.indexOf("[") + 1).slice(0, -1).split("=")[0];
                            var lookingForVal = options.fragment.substring(options.fragment.indexOf("[") + 1).slice(0, -1).split("=")[1];

                            if(lookingForVal && (lookingForVal.includes("\"") || lookingForVal.includes("'"))) {
                                lookingForVal = lookingForVal.slice(1).slice(0, -1);
                            }
                            
                            if(e.nodeName.toLowerCase() != lookingForNode) {
                                return false;
                            }

                            if(lookingForVal){
                                if(e.hasAttribute(lookingForKey)) {
                                    return e.getAttribute(lookingForKey) == lookingForVal;
                                } else {
                                    return false;
                                }
                            } else {
                                return e.hasAttribute(lookingForKey);
                            }

                        }
                        
                        if(options.fragment.includes("[") && options.fragment.startsWith("[")) {

                            var lookingFor = options.fragment.slice(1).slice(0, -1);
                            var lookingForKey = lookingFor.split("=")[0];
                            var lookingForVal = lookingFor.split("=")[1];

                            if(lookingForVal && (lookingForVal.includes("\"") || lookingForVal.includes("'"))) {
                                lookingForVal = lookingForVal.slice(1).slice(0, -1);
                            }
                            
                            if(e.hasAttribute && lookingForVal){
                                if(e.hasAttribute && e.hasAttribute(lookingForKey)) {
                                    return e.getAttribute(lookingForKey) == lookingForVal;
                                } else {
                                    return false;
                                }
                            } else if(e.hasAttribute) {
                                return e.hasAttribute(lookingForKey);
                            } else {
                                return false;
                            }

                        }

                        if(options.fragment.startsWith("#")) {

                            var lookingFor = options.fragment.slice(1);

                            if(e.id)
                            {
                                return e.id == lookingFor;
                            }
                            else
                            {
                                return false;
                            }
                        }

                        if(options.fragment.startsWith(".")) {

                            var lookingFor = options.fragment.slice(1);
                           
                            if(e.classList)
                            {
                                return e.classList.contains(lookingFor);
                            }
                            else
                            {
                                return false;
                            }

                        }

                        return false;

                    });

                }
          
                if ($fragment.length) {
                
                    obj.contents = options.fragment === 'body' ? $fragment : $fragment.contents();
                
                    // If there's no title, look for data-title and title attributes on the fragment
                    if (!obj.title) {

                        obj.title = $fragment.attr('title') || $fragment.data('title');

                    }

                }

                obj.scripts = $body.filter((i, s) => s.nodeName.toLowerCase() == "script");
                obj.scripts.push(...$head.filter((i, s) => s.nodeName.toLowerCase() == "script"));
                obj.cssLinks = $body.filter((i, s) => s.nodeName.toLowerCase() == "link" && s.href != "");
                obj.cssLinks.push(...$head.filter((i, s) => s.nodeName.toLowerCase() == "link" && s.href != ""));

            } else {

                obj.contents = $body;
                obj.scripts = $body.filter((i, s) => s.nodeName.toLowerCase() == "script");
                obj.cssLinks = $body.filter((i, s) => s.nodeName.toLowerCase() == "link" && s.href != "");

            }
            
            // Clean up any <title> tags
            if (obj.contents) {
              
                // Remove any parent title elements
                obj.contents = obj.contents.not(function (i, element) { return element.nodeName.toLowerCase() == 'title'; });
          
                // Then scrub any titles from their descendants
                obj.contents.find('title').remove();
            
                obj.contents = obj.contents.not(obj.scripts);
          
            }
          
            // Trim any whitespace off the title
            if (obj.title) {

                obj.title = obj.title.trim(); 

            }
          
            return obj

        };

        this.renderTags = function(tags, onLoaded){

            if (!tags) { 
                
                return; 

            }

            var existingTags = [...$('script[src]'), ...$('link[href]')];

            var onLoadSet = false;

            if (tags.length > 0) {

                tags.filter(itm => { return itm.href && itm.href != ""; }).forEach((link) => {
                   
                    var matchedLinks = existingTags.filter(current => { return current.href && current.href === link.href; });

                    if (matchedLinks.length <= 0)
                    {

                        var newLink = document.createElement('link');
                        
                        newLink.href = $(link).attr('href');
                        
                        var type = $(link).attr('type');

                        var media = $(link).attr('media');

                        var rel = $(link).attr('rel');

                        if (type) { newLink.type = type; }

                        if (media) { newLink.media = media; }

                        if (rel) { newLink.rel = rel; }

                        document.head.appendChild(newLink);

                    }

                });

                tags.filter(itm => { return itm.src && itm.src != ""; }).forEach((script, index, array) => {
                
                    var matchedScripts = existingTags.filter(itm => { return itm.src && itm.src === script.src; });
                   
                    if (matchedScripts.length <= 0 ) {

                        var newScript = document.createElement('script');

                        var type = $(script).attr('type');

                        if (type) { newScript.type = type; }

                        newScript.src = $(script).attr('src');

                        if (index == (array.length - 1)) {

                            if (onLoaded) {

                                onLoadSet = true;

                                newScript.onload = newScript.onreadystatechange = function() {

                                    onLoaded();

                                };
                                
                            }

                        }

                        document.head.appendChild(newScript);

                    }

                });

            }

            if (!onLoadSet && onLoaded) {

                onLoaded(); 

            }

        };

		return this;

	};
    
    //Html binding helper for json objects
    $.inQuiry.dataBind = {
        elementsName: "input",
        elementsContainer: document,
        attributeJBound: "data-bound",
        attributeIsCustomSet: "data-customset",
        get: function (data, options, error, set) {
            
            var defaults = {
                elementsName: $.inQuiry.dataBind.elementsName,
                elementsContainer: $.inQuiry.dataBind.elementsContainer,
                attributeJBound: $.inQuiry.dataBind.attributeJBound,
                attributeIsCustomSet: $.inQuiry.dataBind.attributeIsCustomSet
            };

            var setup = $.extend({}, defaults, options);

            $(setup.elementsContainer).find(setup.elementsName + "[" + setup.attributeJBound + "]").each(function (i, item) {
               
                if (data.hasOwnProperty($(item).attr(setup.attributeJBound))) {
                   
                    if (set && $(item).attr(setup.attributeIsCustomSet) == "true") {

                        set($(item), $(item).attr(setup.attributeJBound), data[$(item).attr(setup.attributeJBound)]);

                    } else {
                        try {

                            var tagName = $(item)[0].tagName.toLowerCase();
                            
                            var propertyName = $(item).attr(setup.attributeJBound);
                            
                            var value = data[propertyName];

                            if (tagName == "input") {
                               
                                if ($(item).attr("type") == "checkbox") {
                                 
                                    $(item).prop("checked", value);
                                
                                } else {
                              
                                    $(item).val(value);
                              
                                }

                            } else if (tagName == "select") {
                            
                                $(item).find("option[value='" + value + "']").attr('selected', 'selected');
                           
                            } else if (tagName == "textarea") {

                                $(item).val(value);

                            } else if (tagName == "img") {

                                $(item).attr("src", value);

                            } else if (tagName == "div") {

                                $(item).html(value);

                            }
        
                        } catch {
                            if (error) {
                              
                                error($(item).attr(setup.attributeJBound), data[$(item).attr(setup.attributeJBound)]);
                            
                            }
                        }
                    }
                }
            });
        },
        set: function (data, options, error, load) {
           
            var defaults = {
                elementsName: $.inQuiry.dataBind.elementsName,
                elementsContainer: $.inQuiry.dataBind.elementsContainer,
                attributeJBound: $.inQuiry.dataBind.attributeJBound,
                attributeIsCustomSet: $.inQuiry.dataBind.attributeIsCustomSet
            };
           
            var setup = $.extend({}, defaults, options);
            
            $(setup.elementsContainer).find(setup.elementsName + "[" + setup.attributeJBound + "]").each(function (i, item) {
                
                if (data.hasOwnProperty($(item).attr(setup.attributeJBound))) {
                    
                    if (load && $(item).attr(setup.attributeIsCustomSet) == "true") {
                     
                        load($(item), $(item).attr(setup.attributeJBound), data[$(item).attr(setup.attributeJBound)]);
                    
                    } else {
                        try {

                            var tagName = $(item)[0].tagName.toLowerCase();
                                                        
                            var propertyName = $(item).attr(setup.attributeJBound);

                            if (tagName == "input") {
                            
                                if ($(item).attr("type") == "checkbox") {
                            
                                    data[propertyName] = $(item).prop("checked");
                            
                                } else {
                            
                                    data[propertyName] = $(item).val();
                            
                                }

                            } else if (tagName == "select") {
                        
                                data[propertyName] = $(item).find('option:checked').val();

                            } else if (tagName == "textarea") {
                        
                                data[propertyName] = $(item).val();
                        
                            } else if (tagName == "img") {
                            
                                data[propertyName] = $(item).attr("src");
                        
                            } else if (tagName == "div") {

                                data[propertyName] = $(item).text();

                            }

                        } catch {
                            if (error) {
                           
                                error($(item).attr(setup.attributeJBound), data[$(item).attr(setup.attributeJBound)]);
                            
                            }
                        }
                    }
                }
            });
        },
        clear: function(options, error, clear) {
            
            var defaults = {
                elementsName: $.inQuiry.dataBind.elementsName,
                elementsContainer: $.inQuiry.dataBind.elementsContainer,
                attributeJBound: $.inQuiry.dataBind.attributeJBound,
                attributeIsCustomSet: $.inQuiry.dataBind.attributeIsCustomSet
            };
           
            var setup = $.extend({}, defaults, options);

            $(setup.elementsContainer).find(setup.elementsName + "[" + setup.attributeJBound + "]").each(function (i, item) {
               
                if (clear && $(item).attr(setup.attributeIsCustomSet) == "true") {

                    clear($(item), $(item).attr(setup.attributeJBound), data[$(item).attr(setup.attributeJBound)]);

                } else {
                    try {

                        var tagName = $(item)[0].tagName.toLowerCase();

                        if (tagName == "input") {
                            
                            if ($(item).attr("type") == "checkbox") {
                                
                                $(item).prop("checked", false);
                            
                            } else {
                            
                                $(item).val("");
                            
                            }

                        } else if (tagName == "select") {
                        
                            $(item).find('option:nth-child(1)').prop("selected", true);
                            
                        } else if (tagName == "textarea") {
                            
                            $(item).html("");
                            $(item).val("");

                        } else if (tagName == "img") {

                            $(item).attr("src", "");

                        } else if (tagName == "div") {

                            $(item).html("");

                        }

                    } catch {
                        if (error) {
                            
                            error($(item).attr(setup.attributeJBound), data[$(item).attr(setup.attributeJBound)]);
                        
                        }
                    }
                }
                
            });

        }
    };

    //Display and screen codes
    $.inQuiry.screen = {
        size: function (width, height) {

            this.width = width;

            this.height = height;

        },
        point: function (x, y) {
           
            this.x = x;

            this.y = y;

            this.bottom = 0;

            this.right = 0;

            this.getpoint = function (element) {

                var e = new inQuiry.screen.point(0, 0);

                e.top = parseInt(element.style.top.replace('px', ''));

                e.left = parseInt(element.style.left.replace('px', ''));

                e.offsetheight = element.offsetHeight;

                e.offsetwidth = element.offsetWidth;

                return e;

            }

        },
        viewport: function () {

            this.width = $.inQuiry.screen.width();

            this.height = $.inQuiry.screen.height();

        },
        width: function () {

            return screen.width;

        },
        height: function () {

            return screen.height;

        },
        getaspect: function (currentSize, newSize) {
          
            if ((newSize.width < 0) && (newSize.height < 0)) {

                return currentSize;

            }
           
            var aspect = (parseFloat(currentSize.width) / parseFloat(currentSize.height));
           
            if ((parseFloat(newSize.width) / aspect > parseFloat(newSize.height) && newSize.height >= 0) || newSize.width < 0) {

                newSize.width = parseInt(Math.round(parseFloat(newSize.height) * aspect));

            } else {

                newSize.height = parseInt(Math.round(parseFloat(newSize.width) / aspect));

            }

            return new $.inQuiry.screen.size(newSize.width, newSize.height);

        },
        dimentions: function () {
            
            var ret = new $.inQuiry.screen.viewport;
            
            if (typeof window.innerWidth != 'undefined') {
                
                ret.width = window.innerWidth;
                
                ret.height = window.innerHeight;
            
            } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
               
                ret.width = document.documentElement.clientWidth;

                ret.height = document.documentElement.clientHeight;

            } else {

                ret.width = document.getElementsByTagName('body')[0].clientWidth;

                ret.height = document.getElementsByTagName('body')[0].clientHeight;

            }

            return ret;

        },
        isFullScreen: function () {
           
            if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
               
                return false;

            } else {

                return true;

            }

        },
        toggleFullScreen: function () {
            
            if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                
                if (document.documentElement.requestFullScreen) {

                    document.documentElement.requestFullScreen();

                } else if (document.documentElement.mozRequestFullScreen) {

                    document.documentElement.mozRequestFullScreen();

                } else if (document.documentElement.webkitRequestFullScreen) {

                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);

                }
           
            } else {
               
                if (document.cancelFullScreen) {

                    document.cancelFullScreen();

                } else if (document.mozCancelFullScreen) {

                    document.mozCancelFullScreen();

                } else if (document.webkitCancelFullScreen) {

                    document.webkitCancelFullScreen();

                }
            }

        }
    };

    //Cookie codes including collection class  
    $.inQuiry.cookie = {
        item: function (key, value, isJson) {
            
            this.isJson = (isJson == undefined || isJson == null ? false : isJson);
            
            this.key = key;
            
            this.value = this.isJson ? encodeURIComponent(JSON.stringify(value)) : String(value);
            
            this.toString = function() {

                return this.key + '=' + this.value;

            };

        },
        create: function (cookieName, period) {
            this.cookieExsits = false;
            this.cookieName = cookieName;
            this.period = period;
            this.path = "/";
            this.domain = "";
            this.secure = "";
            this.keys = new ICookieCollection();
            this.save = function() {
                
                var expires = '';
                var values = '';

                if (this.period != null || this.period != 0) {

                    var newdate = new Date();

                    newdate.setTime(newdate.getTime() + (period * 24 * 60 * 60 * 1000));

                    expires = newdate.toGMTString();

                }

                var oldvalues = this.read();

                if (oldvalues != null) {

                    this.cookieExsits = true;

                    var oldValuesArray = oldvalues.split('&');

                    for (var x = 0; x < oldValuesArray.length; x++) {

                        var thisSet = oldValuesArray[x].split('=');

                        if (!this.keys.exsits(thisSet[0])) {

                            this.keys.add(new $.inQuiry.cookie.item(thisSet[0], thisSet[1]));

                        }

                    }

                }

                this.keys = this.keys.removeDuplicates();

                if (this.keys.length != 0) {

                    for (var j = 0; j < this.keys.length; j++) {
                        
                        values += this.keys[j].toString() + '&'; 

                    }

                    values = values.slice(0, -1);

                }

                var strCookie = `${this.cookieName}=${values}; expires=${expires}; path=${this.path}`;

                if (this.domain != "") {
                    strCookie += `; domain=${this.domain}`;
                }

                if (this.secure != "") { 
                    strCookie += `; secure=${this.secure}`;
                }

                document.cookie = strCookie;

            };
            this.read = function() {
               
                var nameEQ = this.cookieName + "=";
               
                var ca = document.cookie.split(';');
               
                for (var i = 0; i < ca.length; i++) {
                   
                    var c = ca[i];
                    
                    while (c.charAt(0) == ' ') { 
                   
                        c = c.substring(1, c.length); 
                   
                    }

                    if (c.indexOf(nameEQ) == 0) { 
                   
                        return c.substring(nameEQ.length, c.length); 
                   
                    }

                }

                return null;
            };
            this.key = function (name) {

                var values = this.read();

                if (values != null) {

                    var valuesArray = values.split('&');

                    for (var i = 0; i < valuesArray.length; i++) {

                        var theSet = valuesArray[i].split('=');

                        if (theSet[0] == name) {

                            return theSet[1]; 

                        }

                    }

                }

            };
            this.remove = function() {
                new $.inQuiry.cookie.create(cookieName, -1).save();
            }
            this.toObject = function() {
               
                var output = {};

                var values = this.read();

                if (values != null) 
                {
             
                    var valuesArray = values.split('&');

                    for (var i = 0; i < valuesArray.length; i++) {

                        var theSet = valuesArray[i].split('=');

                        output[theSet[0]] = theSet[1];

                    }   

                }

                return output;
            }
        }
    };

    //Dynamically load resources for js and css
    $.inQuiry.resourceHelper = {
        loaded: [], 
        promise: false, 
        deferred: $.Deferred(),
        load: function (srcs) {
           
            srcs = $.isArray(srcs) ? srcs : srcs.split(/\s+/);
           
            if(!$.inQuiry.resourceHelper.promise)
            { 

                $.inQuiry.resourceHelper.promise = $.inQuiry.resourceHelper.deferred.promise(); 

            }

            $.each(srcs, function(idx, src) { 
                
                $.inQuiry.resourceHelper.promise = $.inQuiry.resourceHelper.promise.then(function() { 

                    return src.indexOf('.css') >= 0 ? $.inQuiry.resourceHelper.loadCSS(src) : $.inQuiry.resourceHelper.loadScript(src); 

                }); 
            
            });
            
            $.inQuiry.resourceHelper.deferred.resolve();
            
            return $.inQuiry.resourceHelper.promise;

        },
        fixUri: function (resource) {

            if (resource.startsWith("..")) {

                resource = resource.slice(2);

            }
    
            if (resource.startsWith("/")) {

                resource = location.protocol + '//' + location.host + resource;

            }
    
            return resource;

        },
        loadScript: function (src) {

            var abUrl = $.inQuiry.resourceHelper.fixUri(src)
    
            if ($.inQuiry.resourceHelper.loaded[abUrl]) { 

                return $.inQuiry.resourceHelper.loaded[abUrl].promise();; 

            }

            var deferred = $.Deferred();

            var script = document.createElement('script');

            script.src = abUrl;

            script.onload = function (e) { deferred.resolve(e); };

            script.onerror = function (e) { deferred.reject(e); };

            document.body.appendChild(script);

            $.inQuiry.resourceHelper.loaded[abUrl] = deferred;

            return deferred.promise();

        },
        loadCSS: function (href) {

            var abUrl = $.inQuiry.resourceHelper.fixUri(href)
    
            if ($.inQuiry.resourceHelper.loaded[abUrl]) { 

                return $.inQuiry.resourceHelper.loaded[abUrl].promise(); 
            
            }

            var deferred = $.Deferred();

            var style = document.createElement('link');

            style.rel = 'stylesheet';

            style.type = 'text/css';

            style.href = abUrl;

            style.onload = function (e) { 
                
                deferred.resolve(e); 
            
            };

            style.onerror = function (e) { 
                
                deferred.reject(e); 
            
            };

            document.head.appendChild(style);

            $.inQuiry.resourceHelper.loaded[abUrl] = deferred;

            return deferred.promise();

        }
    };

    //jQuery Extentions************************************************************************

    $.fn.cssTranslateValues = function() {

        if (this.length <= 0) { 
            
            return this; 

        }

        var element = this[0];

        const style = window.getComputedStyle(element);

        const matrix = style['transform'] || style.transform || style.mozTransform;

        if (matrix === 'none' || typeof matrix === 'undefined') {
            return {
              x: 0,
              y: 0,
              z: 0
            };
        }

        const matrixType = matrix.includes('3d') ? '3d' : '2d';
        const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
        
        if (matrixType === '2d') {
            return {
              x: matrixValues[4],
              y: matrixValues[5],
              z: 0
            };
        }
        
        if (matrixType === '3d') {
            return {
                x: matrixValues[12],
                y: matrixValues[13],
                z: matrixValues[14]
            };
        }

        return this;
        
    };

    $.fn.onClickOut = function(callBackOrParent, callback) {

        if(this.length <= 0) { 

            return this; 

        }

        const $element = this[0];

        var $parent = document;

        var $callBack = callback;

        if(typeof callBackOrParent !== 'function')
        {
            
            $parent = callBackOrParent;

        }
        else
        {

            $callBack = callBackOrParent;

        }

        const isVisible = (e) => {

            return !!e && !!( e.offsetWidth || e.offsetHeight || e.getClientRects().length );

        }

        const outsideClickListener = (evt) => {

            if (!inQuiry.isDescendant($element, evt.target) && isVisible($element)) 
            { 

                if($callBack)
                {

                    $callBack();

                }

                removeClickListener();

            }
        }

        const removeClickListener = () => {

            $parent.removeEventListener('mousedown', outsideClickListener);

        }
    
        setTimeout(() => { 

            $parent.addEventListener('mousedown', outsideClickListener); 

        }, 10);
    
    };

	$.fn.resizable = function(options)
	{ 
		
		if(typeof options === "string" || options instanceof String)
		{
			if(options.toLowerCase() == "destroy")
			{
				if(this[0].resizable)
				{

					var resizer = $(this[0]).find(".resizer");
					
					resizer.off("mousedown", this[0].resizable.initDrag);

					$(this[0]).removeClass("resizable");

					this[0].resizable == null;

				}
		 	}
			if(options.toLowerCase() == "enable")
			{
				if(this[0].resizable)
				{
					
					var resizer = $(this[0]).find(".resizer");
					
					resizer.on("mousedown", this[0].resizable.initDrag);

				}
			}
			if(options.toLowerCase() == "disable")
			{
				if(this[0].resizable)
				{
					
					var resizer = $(this[0]).find(".resizer");
					
					resizer.off("mousedown", this[0].resizable.initDrag)

				}
			}

			return this;
		}

		this[0].resizable = resizableMemory;

		if(options) {

			this[0].resizable.options = options;

		}

		$(this[0]).addClass("resizable");

		var resizer = $("<div />", { class: "resizer" });

		resizer.append("<i class=\"icon icon-link\"></i>");

		$(this[0]).append(resizer);

		resizer.on("mousedown", this[0].resizable.initDrag);
		
        return this;

	};

	$.fn.draggable = function(options)
	{ 		
		
		if(typeof options === "string" || options instanceof String)
		{
			
			if(options.toLowerCase() == "destroy")
			{
				if(this[0].draggableData)
				{

					$(this[0]).removeClass("draggable");
		
					this[0].draggableData.options.handle.off("mousedown", this[0].draggableData.dragInit);

					delete (this[0].draggableData);

				}
		 	}

			if(options.toLowerCase() == "enable")
			{
				if(this[0].draggableData)
				{

					this[0].draggableData.enabled = true;

				}
			}

			if(options.toLowerCase() == "disable")
			{
				if(this[0].draggableData)
				{

					this[0].draggableData.enabled = false;

				}
			}

			return this;
		}


		if(!options) {

			return this;

		}

		if(this[0].draggableData) {

			this[0].draggableData.options = $.extend({}, this[0].draggableData.options, options);

			return this;

		}

		if(!options.handle) {

			options.handle = this[0];

		}

		if(!options.containment) {

			options.containment = $("body")[0];

		}

		this[0].draggableData = new draggableMemory();
		
		this[0].draggableData.options = options;

		this[0].draggableData.currentElement = this[0];
			
		var transition = this.cssTranslateValues();

		this[0].draggableData.xOffset = parseInt(transition.x);

		this[0].draggableData.yOffset = parseInt(transition.y);

		$(this[0]).addClass("draggable");

		this[0].draggableData.options.handle.on("mousedown", this[0].draggableData.dragInit);

        return this;

	};

	var promise = false;
	var deferred = $.Deferred();

	$.fn.uiInclude = function() {
		
		if(!promise) 
		{ 

			promise = deferred.promise(); 

		}		
		
		compile(this);
		
		function compile(node)
		{

			node.find('[ui-include]').each((idx, item) => {
				
				var that = $(item),
				
				url = that.attr('ui-include');
				
				promise = promise.then(() => {

					var request = $.ajax({ url: url,  method: "GET",  dataType: "text" });
					
					var chained = request.then((data, status, xhr) => {
						
						var pjax = new $.inQuiry.pjax();
						
						var page = pjax.extractContainer(xhr.responseText, xhr, { fragment: "body", requestUrl: url });
						
						if (page.title) { 
							
							document.title = page.title; 

						}
						
						var context = that;
						
						var requesttwo = new Promise((resolve, reject) => {
							
							pjax.renderTags([...page.scripts, ...page.cssLinks], () => {
								
								try{

									context.html(page.contents);

									context.append(page.scripts.filter((i, s) => s.src == ""));

									context.find("script").each((idx, item) => {

										eval(item.text);

									});

									resolve(context);

								}
								catch(ex) {

									reject(ex);

								}

							});

						});

						var chainedtwo = requesttwo.then((result) => {
							
							result.find('[ui-include]').length && compile(result);	

						});

						return chainedtwo;

					});

					return chained;

				});

			});

		};

		deferred.resolve();

		return promise;

	}

    //Setup the window references to the framework*********************************************

    $.inQuiry.intiate = () => {

        //Lets set up the browser.
        var matched, browser;
        var uaMatch = function (ua) {
            ua = ua.toLowerCase();
            var match = /(edg)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie)[\s?]([\w.]+)/.exec(ua) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
            return { browser: match[1] || "", version: match[2] || "0" };
        };
        matched = uaMatch(navigator.userAgent);
        matched.browser = matched.browser == 'trident' ? 'msie' : matched.browser;
        browser = {};
        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }
        
        $.inQuiry.browser = browser;
        $.inQuiry.browser.uri = new URL(window.location.href);

        // Checks for ie
        if ( !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./) ){
            $("body").addClass("ie");
        }
        
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        var uab = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
        if( (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(uab) ){
            $("body").addClass("smart");
        } 

    };
    
    window.inQuiry = $.inQuiry;   

    $.inQuiry.intiate();

})(jQuery);
