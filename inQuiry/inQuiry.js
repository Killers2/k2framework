/*!
 * inQuiry V4.2.5 (Based on K2Framework V4.2.5)
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 11 December 2021)
 */
(function (window, undefind) {
    "use-strict"
    
    //Global Storage object here managing inQuiry abstracts.
    window.inQuiryCache = { events: [], domQueue: [], domQueueProcessed: false };  
    
    //Execute or add functions to window.inQuiryCache.domQueue for ready 
    const handleDOMReady = (func) => {
        return document.readyState === "complete" ? func.call(document) : inQuiryCache.domQueue.push(func);
    }

    //Execute ready functions after browser is ready 
    const processDOMReady = () => {
        
        if(inQuiryCache.domQueueProcessed) { 
            return; 
        }
        
        inQuiryCache.domQueueProcessed = true;

        intiate();

        while(inQuiryCache.domQueue.length) {

            inQuiryCache.domQueue.shift().call(document);

        }

    }

    //Set the event checks for the browser being ready.
    if (document.addEventListener)  {
      
        document.addEventListener("DOMContentLoaded", function onDOMReady() {
          
            document.removeEventListener("DOMContentLoaded", onDOMReady);
          
            window.removeEventListener("load", onDOMReady);
          
            processDOMReady();
       
        });
       
        window.addEventListener("load", function onDOMReady() {
          
            document.removeEventListener("DOMContentLoaded", onDOMReady);
          
            window.removeEventListener("load", onDOMReady);
          
            processDOMReady();
        });

    } else {
      
        document.attachEvent("onreadystatechange", function onDOMReady(evt) {
            
            evt.target.detachEvent("onreadystatechange", onDOMReady);
            
            if (document.readyState !== "loading") {
            
                processDOMReady();
            
            }

        });

    }

    //The inQuiry class which will contain all the extention methods for the selector
    class IQueryable extends Array {
        //Extention methods for the framework here.
        ready(handler)
        {
           
            if(this[0] != document) { 
           
                return this; 
           
            }

            return handleDOMReady(handler);

        };
        on(name, handlerOrSelector, handler) {

            if (typeof handlerOrSelector === "function") {

                this.forEach((element) => { 

                    if (typeof name === 'string') {

                        name = name.split(" ");

                    }

                    inQuiry.each(name, (idx, funcName) => {

                        var inQuiryEvent = {
                            element: element, 
                            name: name, 
                            handler: handlerOrSelector
                        };

                        if(element != document) { 

                            window.inQuiryCache.events.push(inQuiryEvent); 
                        
                        }

                        element.addEventListener(name, inQuiryEvent.handler);

                    });

                 });

            } else {

                this.forEach((element) => { 

                    var inQuiryEvent = {
                        element: element, 
                        name: name, 
                        handler: function (event) { 

                            if(event.target.matches(handlerOrSelector)) { 

                                handler(event); 

                            } 

                        }
                    };

                    window.inQuiryCache.events.push(inQuiryEvent);

                    element.addEventListener(name, inQuiryEvent.handler);

                });

            }

            return this;

        };
        off(name, handler) {
            
            if(name == null && handler == null)  {
                
                this.forEach((e) => {
                    
                    var inQuiryEvent = window.inQuiryCache.events.filter(evt => evt.element == e)[0];
                    
                    if(inQuiryEvent) {
                   
                        e.removeEventListener(inQuiryEvent.name, inQuiryEvent.handler);
                   
                    }
                    
                    for (const attribute of e.attributes) {
                        
                        if(attribute.name.startsWith("on")) { 
                        
                            e.removeAttribute(attribute.name); 

                        }

                    }
                    
                    window.inQuiryCache.events = window.inQuiryCache.events.grep(evt => evt.element != e);
               
                });

            } else if(name && handler == null) {
                
                this.forEach((e) => { 
                    
                    var inQuiryEvent = window.inQuiryCache.events.filter(evt => evt.element == e && evt.name == name)[0];
                    
                    if(inQuiryEvent) {
                    
                        e.removeEventListener(name, inQuiryEvent.handler);
                       
                        window.inQuiryCache.events = window.inQuiryCache.events.grep(evt => evt.element != e);
                    
                    }

                });
            
            } else {
                
                this.forEach((e) => {
                  
                    window.inQuiryCache.events = window.inQuiryCache.events.grep(evt => evt.element != e);
                  
                    e.removeEventListener(name, handler); 
                
                });

            }

            return this;
        };
        data(name, value) {

            if(!name && value == null)  {

                return this[0].dataset;

            }

            if(name && value == null)  {


                if(this[0][name]) {

                    return this[0][name];

                } else {

                    return this[0].dataset[name];

                }

            }

            if(this[0][name]) {

                this[0][name] = value;

            } else {

                this[0].dataset[name] = value;

            }

            return this;

        };
        cache(name, value) {

            if(!name && value == null)  {
          
                return window.localStorage;
         
            }
    
            if(name && value == null)  {
               
                var output = window.localStorage.getItem(name);
               
                try {
               
                    return JSON.parse(output);
                
                } catch { 
                
                    return output;
                
                }

            }

            if (typeof value === "object" || value instanceof Object) {
            
                value = JSON.stringify(value);
            
            }

            window.localStorage.setItem(name, value);
    
            return this;
    
        };
        first() {
           
            if(this.length <= 0) { 

                return this; 

            }

            return inQuiry(this[0].firstElementChild);

        };
        last() {

            if(this.length <= 0) { 

                return this; 

            }

            return inQuiry(this[0].lastElementChild);

        };
        even() {

            if(this.length <= 0) { 

                return this; 

            }

            return IQueryable.from(inQuiry.grep((item, i ) => {

                return (i + 1) % 2;

            }));

        };
        odd() {

            if(this.length <= 0) { 

                return this; 

            }

            return IQueryable.from(inQuiry.grep((item, i ) => {

                return i % 2;

            }));

        };
        next() {

            if(this.length <= 0) { 

                return this; 

            }
            
            return inQuiry(this.map(e => e.nextElementSibling).filter(e => e != null));

        };
        prev() {

            if(this.length <= 0) { 

                return this; 

            }

            return inQuiry(this.map(e => e.previousElementSibling).filter(e => e != null));

        };
        parent() {
           
            if(this[0] == document) { 

                return this; 

            }
            
            return inQuiry(this[0].parentElement);

        };
        children() {

            return inQuiry(this[0].children);

        };
        childNodes() {

            return inQuiry(this[0].childNodes);

        };
        closest(selector) {

            if(selector.indexOf(' ') >= 0)
            {
                
                selector = selector.split(/(\s+)/).filter(e => e.trim().length > 0)

                return inQuiry(this[0].closest(selector[0]));

            }
            else
            {

                return inQuiry(this[0].closest(selector));

            }

        };
        each(handler) {

            for (let i = 0; i < this.length; i++) {

                handler(i, inQuiry(this[i]), this);

            }

            return this;

        };
        addClass(name) {

            if(name.indexOf(' ') >= 0)
            {
                
                name = name.split(/(\s+)/).filter(e => e.trim().length > 0)

                inQuiry.each(name, (idx, item) => {

                    this.forEach(e => e.classList.add(item));

                });

            }
            else
            {

                this.forEach(e => e.classList.add(name));

            }

            return this;

        };
        removeClass(name) {

            if(name.indexOf(' ') >= 0)
            {
                
                name = name.split(/(\s+)/).filter(e => e.trim().length > 0)

                inQuiry.each(name, (idx, item) => {

                    this.forEach(e => e.classList.remove(item));

                });

            }
            else
            {

                this.forEach(e => e.classList.remove(name));

            }            

            return this;

        };
        hasClass(name) {

            if(this[0] == document) { 
                
                return this; 

            }

            return this[0].classList.contains(name);

        };
        toggleClass(name) {
        
            this.forEach(e => e.classList.toggle(name));

            return this;

        };
        attr(name, val) {

            if (val == null) { 
                
                if (this[0].hasAttribute(name)) 
                { 

                    return this[0].getAttribute(name); 

                } 
                else
                {

                    return null;

                }

            }

            this.forEach(e => { 

                e.setAttribute(name, val); 

            });

            return this;

        };
        removeAttr(name) {

            if (name == null) { 
                
                return this; 

            }

            this.forEach(e => e.removeAttribute(name));

            return this;

        };
        css(nameOrOptions, val) {
            
            if (typeof nameOrOptions === "object" && val == null) {
               
                this.forEach((e) => { 
                   
                    for (const [key, value] of Object.entries(nameOrOptions)) {

                        e.style[key] = value;

                    } 

                });

                return this;

            } 
            else 
            {

                const jspn = nameOrOptions.replace(/(-[a-z])/, g => {
               
                    return g.replace("-", "").toUpperCase();
               
                });

                if(nameOrOptions && val == null)
                {
                    
                    var output = this[0].style[jspn];

                    if(window.getComputedStyle)
                    {
                        
                        output = getComputedStyle(this[0])[jspn];

                    }

                    if(output == null || output == ""){
                                               
                        output = "0px";

                    }

                    return output;

                }
                else
                {
                    
                    this.forEach((e) => { 

                        e.style[jspn] = val;

                    });

                    return this;

                }
            }
        };
        cssTranslateValues() {

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
        width() {

            return this[0].offsetWidth;

        };
        height() {

            return this[0].offsetHeight;

        };
        html(val) {       
            
            if (val == null) { 
                
                return this[0].innerHTML; 

            }
      
            this.forEach(e => { 
                
                if (typeof val === 'string' || val instanceof String)
                {
                    e.innerHTML = val; 
                }

                if(val instanceof HTMLElement)
                {
                    e.append(val);
                }

                if(val instanceof Array)
                {
                    
                    val.forEach((node) => {  
                        
                        e.appendChild(node);

                    });

                }

            });
            
            return this;

        };
        text(val) {
            
            if (val == null) { 
                
                return this[0].textContent;

             }
            
            this.forEach(e => { 
                
                e.textContent = val; 

            });
            
            return this;

        };
        val(val) {

            if (val == null) { 
                
                return this[0].value;

            }

            this.forEach(e => { 

                e.value = val;

            });

            return this;

        };
        prop(name, valOrhandler) {
                
            if (valOrhandler == null) { 

                if(name.toLowerCase() == "tagname")
                {
                    return this[0].tagName; 
                }

                return this[0][name].value; 

            }

            this.forEach(e => { 

                e[name] = valOrhandler; 

            });

            return this;

        };
        append(htmlOrIQueryable) {         
           
            var content = [];

            if (typeof htmlOrIQueryable === "string" || htmlOrIQueryable instanceof String) {

                content.push(new DOMParser().parseFromString(htmlOrIQueryable, 'text/html').body.firstChild);

            } else { 

                content = htmlOrIQueryable;

            }

            this.forEach(e => { 
                    
                e.appendChild(content[0]);

            });

            return this;

        };
        prepend(htmlOrIQueryable) {

            var content = [];

            if (typeof htmlOrIQueryable === "string" || htmlOrIQueryable instanceof String) {

                content.push(new DOMParser().parseFromString(htmlOrIQueryable, 'text/html').body.firstChild);

            } else { 

                content = htmlOrIQueryable;

            }

            this.forEach(e => {  

                e.insertBefore(content[0], e.firstChild); 

            });
           
            return this;

        };
        hide() {
            
            this.forEach((e) => { 

                e.style.display = 'none'; 

            });
            
            return this;

        };
        show() {
            
            this.forEach(e => { 

                e.style.display = 'inherit'; 

            });
            
            return this;

        };
        click() {

            this.forEach(e => { 

                e.click();

            });

            return this;
        };
        find(selector) {

            return inQuiry(selector, this[0]);

        };
        clone(deep) {

            if(deep == null)
            {
                deep = false;
            }

            return inQuiry(this[0].cloneNode(deep));

        };
        empty() {

            if(this[0] == document) { 
                
                return this; 

            }

            while (this[0].firstChild) {
           
                this[0].removeChild(this[0].firstChild);
            
            }

            return this;    

        };
        trigger(name) {

            inQuiry.trigger(this[0], name);

            return this;

        };
        remove() {

            //Compat won't work in any version of Internet Explorer (IE)

            this.forEach(e => { 
                    
                e.remove();

             });

            return this;

        };
        replaceWith(selector) {

            if(this[0] == document) { 
                
                return this; 

            }

            if (typeof selector === 'string' || selector instanceof String || selector instanceof HTMLElement) {
                
                var temp = inQuiry(selector);

                this[0].replaceWith(temp[0]);

            } else if (selector instanceof IQueryable) {

                this[0].replaceWith(selector[0]);

            } 

            return this;
            
        };
        where(expressionCallback) {

            if(expression == null)
            {

                return this;

            }

            return IQueryable.from(this.filter(expressionCallback));

        };
        firstOrDefault(expressionCallback) {

            if(expressionCallback == null)
            {

                return inQuiry(this[0]);

            }

            return inQuiry(this.filter(expressionCallback)[0]);

        };
        take(number){
           
            if(number == null)
            {

                return this;

            }

            return IQueryable.from(this.filter((x, i) => { 
                if(i <= (number-1))
                {
                    return true; 
                } 
            }));

        };
        skip(number){
            
            if(number == null)
            {

                return this;

            }

            return IQueryable.from(this.filter((x, i) => { 
                
                if(i > (number-1))
                {

                    return true;

                } 

            }));

        };
        offset() {

            if (!this[0].getClientRects().length ) 
            {

                return { 
                    top: 0, 
                    left: 0 
                };

            }
    
            var bounds = this[0].getBoundingClientRect();

            var view = this[0].ownerDocument.defaultView;
            
            return {
                top: bounds.top + view.pageYOffset,
                left: bounds.left + view.pageXOffset
            };

        };
        position() {

            if (!this[0])
            {

                return this;

            }

            var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };

		    if (inQuiry(this[0]).css("position") === "fixed") 
            {
			    
                offset = elem.getBoundingClientRect();

		    } 
            else 
            {
			    offset = this.offset();

                doc = elem.ownerDocument;
			    
                offsetParent = elem.offsetParent || doc.documentElement;
               
                while ( offsetParent && ( offsetParent === doc.body || offsetParent === doc.documentElement ) && inQuiry(offsetParent).css("position") === "static") 
                {

                    offsetParent = offsetParent.parentNode;

                }

                if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

                    parentOffset = inQuiry(offsetParent).offset();

                    parentOffset.top += inQuiry(offsetParent).css("borderTopWidth");

                    parentOffset.left += inQuiry(offsetParent).css("borderLeftWidth");

                }
            }

            return {
                top: offset.top - parentOffset.top - inQuiry(elem).css("marginTop"),
                left: offset.left - parentOffset.left - inQuiry(elem).css("marginLeft")
            };

        };
        contents() {

            if (this[0].contentDocument != null && Object.getPrototypeOf(this[0].contentDocument)) 
            {
    
                return this[0].contentDocument;

            }

            if (this[0].nodeName.toLowerCase() === "template") 
            {

                this[0] = this[0].content || this[0];

            }
    
            return inQuiry.combine([], this[0].childNodes);

        };
        wrapAll(htmlOrHandler) {
            
            var wrap;

            if (this[0]) 
            {
                
                if (typeof htmlOrHandler === "function") {

                    htmlOrHandler = htmlOrHandler(this[0]);

                }

                wrap = inQuiry(htmlOrHandler, this[0].ownerDocument).eq(0).clone(true);
    
                if (this[0].parentNode) {

                    wrap.insertBefore(this[0]);

                }
    
                wrap.map((element, idx, arg) => {

                    while (element.firstElementChild ) 
                    {
                        element = element.firstElementChild;
                    }
    
                    return element;

                }).append(this);
            }
    
            return this;

        };
        wrapInner(htmlOrHandler) {
            
            if (typeof htmlOrHandler === "function") {
               
                return this.each((index, item) => {
               
                    inQuiry(item).wrapInner(htmlOrHandler(index, item));
               
                });

            }
    
            return this.each((index, item) => {

                var me = inQuiry(item);

                var contents = me.contents();

                if (contents.length) {

                    contents.wrapAll( html );
    
                } else {

                    me.append( html );

                }

            });

        };
        wrap(htmlOrHandler) {

            var htmlIsFunction = typeof htmlOrHandler === "function";
    
            return this.each((index, item) => {
                
                inQuiry(item).wrapAll(htmlIsFunction ? htmlOrHandler(index, item) : htmlOrHandler);
            
            });

        }
        unwrap(selector) {

            this.parent(selector)
                .not("body")
                .each((index, item) => {

                    inQuiry(item).replaceWith(item.childNodes);

                });

            return this;

        };
        is(selectorOrElement) { 
            
            return !!inQuiry.where(
                this,
                typeof selectorOrElement === "string" && selectorOrElement instanceof String ? inQuiry(selectorOrElement) : selectorOrElement || [],
                false
            ).length;

        };
        not(selector) {
 
            return IQueryable.from(inQuiry.where(this, selector || [], true));

        };
        eq(idx) {

            if(idx > this.length || idx < 0)
            {

                return this;

            }

            return IQueryable.from([this[idx]]);

        };
        has(target) {
            
            var targets = inQuiry(target, this);

            var l = targets.length;
    
            return this.filter(function() {
                  
                for (var i = 0; i < l; i++ ) {

                    if (inQuiry.contains(this, targets[i])) {

                        return true;

                    }

                }
            });

        };
        hover(handlerMouseIn, handlerMouseOut) {

            if(handlerMouseIn) {

                this[0].addEventListener("mouseenter", (evt) => { 

                    handlerMouseIn(evt); 

                });

                if(handlerMouseOut) {

                    this[0].addEventListener("mouseleave", (evt) => { 

                        handlerMouseOut(evt); 
                            
                    });

                }
            }
            return this;
        };
        outerHeight() {

            return this[0].offsetHeight;

        };
        outerWidth() {

            return this[0].offsetWidth;


        };
        scrollTop() {

            this[0].scrollTop = this[0].offsetTop;

            return this;

        };
        siblings(element) {

            return inQuiry.siblings((element.parentNode || {}).firstChild, element);

        };
        insertBefore(newNode) {

            //TODO: this works backwards. ?

            newNode.parentNode.insertBefore(this[0], newNode);
            //this[0].parentNode.insertBefore(newNode, this[0]);

            return this;

        };
        map(handler, arg) {
           
            var output = [];

            this.each((idx, item) => {
                
                var value = handler(item[0], idx, arg);

                if (value != null) 
                {

                    output.push(value);

                }

            });

            return IQueryable.from(output);

        };
        onClickOut(callBackOrParent, callback) {

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
        delay(duration) {
            return inQuiry.sleep(duration);
        };
    };
    
    //The framework object selector assigned to the window.
    function inQuiry(selector, attributesOrContext) {
        
        if (typeof selector === 'function') {
           
            return handleDOMReady(selector);
        
        } else if (typeof selector === "string" || selector instanceof String) {
           
            if (selector[0] === "<" && selector[selector.length - 1] === ">") {
                
                var output = new DOMParser().parseFromString(selector, 'text/html').body.firstChild;
               
                if(attributesOrContext != null && selector.slice(-2) === "/>") {
                    
                    Object.entries(attributesOrContext).forEach(([key, value]) => {

                        if (key === "class") {

                            value = value.split(" ");
                
                            inQuiry.each(value, (i, className) => {
        
                                output.classList.add(className);
        
                            });

                            return;

                        }

                        if (key === "dataset") {
                           
                            Object.entries(value).forEach(([dataKey, dataValue]) => {
                               
                                output.dataset[dataKey] = dataValue;
                            
                            });

                            return;
                        }

                        if (key === "text") {

                            output.textContent = value;

                            return;

                        }

                        if (key === "html") {

                            if(typeof value === 'string')
                            {
                                output.innerHTML = value;
                            } 

                            if(value instanceof IQueryable)
                            {

                                $$(output).append(value)
                
                            } 

                            if(value instanceof HTMLElement)
                            {

                                output.appendChild(value);
                
                            } 

                            return;

                        }

                        output.setAttribute(key, value);

                    });

                }
              
                return new IQueryable(output);
            
            } else {

                var cherryPick = document;
                
                if (attributesOrContext != null && attributesOrContext instanceof HTMLElement) {
                
                    cherryPick = attributesOrContext;
                
                }    

                try 
                {

                    return new IQueryable(...cherryPick.querySelectorAll(selector));

                } catch {

                    var output = null;

                    var index = selector.indexOf(":");

                    if (index > -1) {

                        var pseudoSelector = selector.substring(index + 1);

                        selector = selector.substring(0, index);
                        
                        var results = [];

                        if(inQuiry.pseudo[pseudoSelector]) {
                        
                            results = inQuiry.pseudo[pseudoSelector](inQuiry(cherryPick));
                        
                        }

                        output = IQueryable.from(results);

                    }   
 
                    return output;

                }

            }

        } else if (selector instanceof HTMLCollection || selector instanceof NodeList || selector instanceof Array) {

            return IQueryable.from(selector);

        } else if (selector instanceof IQueryable) {

            return selector;

        } else {

            return new IQueryable(selector);

        }

    };

    //Local variables
    inQuiry.version = '4.2.5';

    //Setup shorthand for prototyping and pseudo selector extentions. 
    inQuiry.fn = IQueryable.prototype;
    inQuiry.pseudo = { };

    //************************************************************************************************************************************
    //Extention methods for the IQueryable object here.
    //************************************************************************************************************************************
    inQuiry.fn.toArray = function () {
       
        let output = [];
      
        this.forEach((e) => { 
            output.push(e); 
        });

        return output;

    };

    //************************************************************************************************************************************
    //Add more inQuiry framework or and functions.
    //************************************************************************************************************************************
    inQuiry.grep = function (array, callback){     
       
        return array.grep(callback);

    };
    inQuiry.clone = function (obj, deepClone = false){
        
        if(obj === null || typeof(obj) !== 'object')
        {
            return obj;
        }

        if(deepClone)
        {

            if(obj instanceof Date) {

                return new Date(obj.getTime());

            }
            
            if(obj instanceof Array) {

                return obj.reduce((arr, item, i) => {

                    arr[i] = inQuiry.clone(item, deepClone);

                    return arr;

                }, []);

            }

            if(obj instanceof Object) {

                return Object.keys(obj).reduce((newObj, key) => {

                    newObj[key] = inQuiry.clone(obj[key], deepClone);

                    return newObj;

                }, {});

            }

        }
        else
        {
            return inQuiry.merge({}, obj);
        }
    };
    inQuiry.merge = function (input, obj){
        
        Object.assign(input, obj);
        
        return input;

    };
    inQuiry.combine = function(array1, array2) 
    {
        return IQueryable.from([...array1, ...array2]);
    };
    inQuiry.uuid = function() {
        //uuid version 4
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    };
    inQuiry.each = function (array, handler) {

        if(typeof array === "array" || array instanceof Array) {

            for (let i = 0; i < array.length; i++) {

                handler(i, array[i], array);

            }

        } else if (typeof array === "object" || array instanceof Object) {
            
            Object.keys(array).forEach((property) => {

                handler(property, array[property]);

            });
            
        } else if (typeof array === "iqueryable" || array instanceof IQueryable) {
            

            for (let i = 0; i < array.length; i++) {

                handler(i, inQuiry(array[i]), array);

            }

        }

    };
    inQuiry.isArray = function(input) {
       
        if(typeof input == "array" || input instanceof Array)
        {
           
            return true;

        }

        return false;

    };
    inQuiry.contains = function(container, target) {


        if(typeof container === HTMLElement)
        {       
            if(typeof target === HTMLElement)
            {
            
                return container.contains(target);
            
            }

            if(typeof target === IQueryable)
            {

                target.each((idx, item) => {
                  
                    return container.contains(item);
               
                });

            }

        }

        if(typeof container === IQueryable)
        {

            if(typeof target === HTMLElement)
            {

                return container.filter(e => e == target).length > 0;
            
            }

            if(typeof target === IQueryable)
            {

                target.each((idx, item) => {
                  
                    var boolCheck = container.filter(e => e == item).length > 0;

                    if(boolCheck)
                        return true;
               
                });

            }
            
        }

        return false;

    };    
    inQuiry.where = function(elements, selectorOrFunction, not) {

        if (typeof selectorOrFunction === "function") {
           
            return inQuiry.grep(elements, function(element, i) {
            
                return !!selectorOrFunction(element, i, element) !== not;
            
            });

        }
    
        if (selectorOrFunction.nodeType) 
        {
            
            return inQuiry.grep(elements, function(element) {
            
                return (element === selectorOrFunction) !== not;
            
            });

        }
    
        if (typeof selectorOrFunction !== "string") {

            return inQuiry.grep(elements, function(element) {

                return (Array.prototype.indexOf.call(selectorOrFunction, element) > -1) !== not;

            });

        }
    
        return elements.filter(selectorOrFunction);


    };
    inQuiry.siblings = function(cur, dir) {

        while ((cur = cur[dir]) && cur.nodeType !== 1) 
        {

        }

        return cur;

    };
    inQuiry.Deferred = function() {
        
        let resolve, reject;
        
        const promise = new Promise((res, rej) => {

            [resolve, reject] = [res, rej];

        });

        return {promise, reject, resolve};

    };
    inQuiry.isPlainObject = function(obj) {
        
        return Object.prototype.toString.call(obj) === '[object Object]';

    };
    inQuiry.mouseIntersects = function(element, event, zoom) {

        if (!zoom) { zoom = 1; }

        var iele = $$(element);

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
    inQuiry.isDescendant = function(ancestor, descendant){

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
    inQuiry.isAncestor = function(descendant, ancestor){

        if(ancestor === descendant)
        {
            return true;
        }

        return (descendant.compareDocumentPosition(ancestor) & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0;
    };
    inQuiry.toTimeAgo = function(time) {

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
    inQuiry.isNumber =  function(val) {

        var isTypeNumber = (n) => { 
            return typeof n === 'number' && isFinite(n); 
        }

        var isNumberObject = (n) => { 
            return (Object.prototype.toString.apply(n) === '[object Number]'); 
        }

        return isTypeNumber(val) || isNumberObject(val);

    };
    inQuiry.formatXml = function(xml) {

        var formatted = '';

        var reg = /(>)(<)(\/*)/g;

        xml = xml.replace(reg, '$1\r\n$2$3');

        var pad = 0;

        inQuiry.each(xml.split('\r\n'), (idx, node) => {

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
    inQuiry.insertAtCaret = function (element, text) {

        var txtarea = $$(element)[0];

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
    inQuiry.getContrast = function (hexcolor) {

        hexcolor = hexcolor.replace("#", "");

        var r = parseInt(hexcolor.substr(0, 2), 16);

        var g = parseInt(hexcolor.substr(2, 2), 16);

        var b = parseInt(hexcolor.substr(4, 2), 16);

        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        return (yiq >= 128) ? '#000' : '#FFF';

    };
    inQuiry.sleep = function (duration) {
        return new Promise(resolve => {

            setTimeout(resolve, duration);

        });
    };
    inQuiry.memoize = function (func) {

        const cache = new Map();

        return (...args) => {
            
            const key = JSON.stringify(args);
            
            if (cache.has(key)) {

                return cache.get(key);

            }
      
            const result = func(...args);

            cache.set(key, result);

            return result;
        }
    };
    inQuiry.trigger = function(element, eventName) {

        if(eventName.toLowerCase() == "ready")
        {
            
            inQuiryCache.domQueueProcessed = false;

            processDOMReady();

            return this;

        }

        element.dispatchEvent(new Event(eventName));

        return element;

    };
    inQuiry.ajax = function (options) {
        
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
            progress: (xhr, percent) => { },
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

            try 
            {

                ajaxRequest.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = ((evt.loaded / evt.total) * 100);
                        options.progress(ajaxRequest, percentComplete);
                    }
                }, false);

                ajaxRequest.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = ((evt.loaded / evt.total) * 100);
                        options.progress(ajaxRequest, percentComplete);
                    }
                }, false);

            } catch{}

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
    inQuiry.socket = function (host, onOpen, onParse, onClose, onError) {
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
	inQuiry.pjax = function() {

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

              var $head = $$(this.parseHTML(data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0]).head).contents();

              var $body = $$(this.parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]).body).contents();

            } else {

              var $head = $body = $$(this.parseHTML(data).body).contents();

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

                titleNode = $$($head[$head.length - 1]);

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

                    var $fragment = $body.filter((e) => {
                        
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

                obj.scripts = $body.filter(s => s.nodeName.toLowerCase() == "script");
                obj.scripts.push(...$head.filter(s => s.nodeName.toLowerCase() == "script"));
                obj.cssLinks = $body.filter(s => s.nodeName.toLowerCase() == "link" && s.href != "");
                obj.cssLinks.push(...$head.filter(s => s.nodeName.toLowerCase() == "link" && s.href != ""));

            } else {

                obj.contents = $body;
                obj.scripts = $body.filter(s => s.nodeName.toLowerCase() == "script");
                obj.cssLinks = $body.filter(s => s.nodeName.toLowerCase() == "link" && s.href != "");

            }
            
            // Clean up any <title> tags
            if (obj.contents) {
              
                // Remove any parent title elements
                obj.contents = obj.contents.not(function (element, i) {  return element.nodeName.toLowerCase() == 'title'; });
          
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

            var existingTags = [...$$('script[src]'), ...$$('link[href]')];

            var onLoadSet = false;

            if (tags.length > 0) {

                tags.filter(itm => { return itm.href && itm.href != ""; }).forEach((link) => {
                   
                    var matchedLinks = existingTags.filter(current => { return current.href && current.href === link.href; });

                    if (matchedLinks.length <= 0)
                    {

                        var newLink = document.createElement('link');
                        
                        newLink.href = $$(link).attr('href');
                        
                        var type = $$(link).attr('type');

                        var media = $$(link).attr('media');

                        var rel = $$(link).attr('rel');

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

                        var type = $$(script).attr('type');

                        if (type) { newScript.type = type; }

                        newScript.src = $$(script).attr('src');

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
    inQuiry.dataBind = {
        elementsName: "input",
        elementsContainer: document,
        attributeJBound: "data-bound",
        attributeIsCustomSet: "data-customset",
        get: function (data, options, error, set) {
            
            var defaults = {
                elementsName: inQuiry.dataBind.elementsName,
                elementsContainer: inQuiry.dataBind.elementsContainer,
                attributeJBound: inQuiry.dataBind.attributeJBound,
                attributeIsCustomSet: inQuiry.dataBind.attributeIsCustomSet
            };
           
            var setup = inQuiry.merge(defaults, options);

            inQuiry(setup.elementsContainer).find(setup.elementsName + "[" + setup.attributeJBound + "]").each(function (i, item) {
               
                if (data.hasOwnProperty(inQuiry(item).attr(setup.attributeJBound))) {
                   
                    if (set && inQuiry(item).attr(setup.attributeIsCustomSet) == "true") {

                        set(inQuiry(item), inQuiry(item).attr(setup.attributeJBound), data[inQuiry(item).attr(setup.attributeJBound)]);

                    } else {
                        try {

                            var tagName = inQuiry(item)[0].tagName.toLowerCase();
                            
                            var propertyName = inQuiry(item).attr(setup.attributeJBound);
                            
                            var value = data[propertyName];

                            if (tagName == "input") {
                               
                                if (inQuiry(item).attr("type") == "checkbox") {
                                 
                                    inQuiry(item).prop("checked", value);
                                
                                } else {
                              
                                    inQuiry(item).val(value);
                              
                                }

                            } else if (tagName == "select") {
                            
                                inQuiry(item).find("option[value='" + value + "']").attr('selected', 'selected');
                           
                            } else if (tagName == "textarea") {

                                inQuiry(item).val(value);

                            } else if (tagName == "img") {

                                inQuiry(item).attr("src", value);

                            } else if (tagName == "div") {

                                inQuiry(item).html(value);

                            }
        
                        } catch {
                            if (error) {
                              
                                error(inQuiry(item).attr(setup.attributeJBound), data[inQuiry(item).attr(setup.attributeJBound)]);
                            
                            }
                        }
                    }
                }
            });
        },
        set: function (data, options, error, load) {
           
            var defaults = {
                elementsName: inQuiry.dataBind.elementsName,
                elementsContainer: inQuiry.dataBind.elementsContainer,
                attributeJBound: inQuiry.dataBind.attributeJBound,
                attributeIsCustomSet: inQuiry.dataBind.attributeIsCustomSet
            };
           
            var setup = inQuiry.merge(defaults, options);
            
            inQuiry(setup.elementsContainer).find(setup.elementsName + "[" + setup.attributeJBound + "]").each(function (i, item) {
                
                if (data.hasOwnProperty(inQuiry(item).attr(setup.attributeJBound))) {
                    
                    if (load && inQuiry(item).attr(setup.attributeIsCustomSet) == "true") {
                     
                        load(inQuiry(item), inQuiry(item).attr(setup.attributeJBound), data[inQuiry(item).attr(setup.attributeJBound)]);
                    
                    } else {
                        try {

                            var tagName = inQuiry(item)[0].tagName.toLowerCase();
                                                        
                            var propertyName = inQuiry(item).attr(setup.attributeJBound);

                            if (tagName == "input") {
                            
                                if (inQuiry(item).attr("type") == "checkbox") {
                            
                                    data[propertyName] = inQuiry(item).prop("checked");
                            
                                } else {
                            
                                    data[propertyName] = inQuiry(item).val();
                            
                                }

                            } else if (tagName == "select") {
                        
                                data[propertyName] = inQuiry(item).find('option:checked').val();

                            } else if (tagName == "textarea") {
                        
                                data[propertyName] = inQuiry(item).val();
                        
                            } else if (tagName == "img") {
                            
                                data[propertyName] = inQuiry(item).attr("src");
                        
                            } else if (tagName == "div") {

                                data[propertyName] = inQuiry(item).text();

                            }

                        } catch {
                            if (error) {
                           
                                error(inQuiry(item).attr(setup.attributeJBound), data[inQuiry(item).attr(setup.attributeJBound)]);
                            
                            }
                        }
                    }
                }
            });
        },
        clear: function(options, error, clear) {
            
            var defaults = {
                elementsName: inQuiry.dataBind.elementsName,
                elementsContainer: inQuiry.dataBind.elementsContainer,
                attributeJBound: inQuiry.dataBind.attributeJBound,
                attributeIsCustomSet: inQuiry.dataBind.attributeIsCustomSet
            };
           
            var setup = inQuiry.merge(defaults, options);

            inQuiry(setup.elementsContainer).find(setup.elementsName + "[" + setup.attributeJBound + "]").each(function (i, item) {
               
                if (clear && inQuiry(item).attr(setup.attributeIsCustomSet) == "true") {

                    clear(inQuiry(item), inQuiry(item).attr(setup.attributeJBound), data[inQuiry(item).attr(setup.attributeJBound)]);

                } else {
                    try {

                        var tagName = inQuiry(item)[0].tagName.toLowerCase();

                        if (tagName == "input") {
                            
                            if (inQuiry(item).attr("type") == "checkbox") {
                                
                                inQuiry(item).prop("checked", false);
                            
                            } else {
                            
                                inQuiry(item).val("");
                            
                            }

                        } else if (tagName == "select") {
                        
                            inQuiry(item).find('option:nth-child(1)').prop("selected", true);
                            
                        } else if (tagName == "textarea") {
                            
                            inQuiry(item).html("");
                            inQuiry(item).val("");

                        } else if (tagName == "img") {

                            inQuiry(item).attr("src", "");

                        } else if (tagName == "div") {

                            inQuiry(item).html("");

                        }

                    } catch {
                        if (error) {
                            
                            error(inQuiry(item).attr(setup.attributeJBound), data[inQuiry(item).attr(setup.attributeJBound)]);
                        
                        }
                    }
                }
                
            });

        }
    };
    //Display and screen codes
    inQuiry.screen = {
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

            this.width = inQuiry.screen.width();

            this.height = inQuiry.screen.height();

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

            return new inQuiry.screen.size(newSize.width, newSize.height);

        },
        dimentions: function () {
            
            var ret = new inQuiry.screen.viewport;
            
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
    inQuiry.cookie = {
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

                    cookieexsits = true;

                    var oldValuesArray = oldvalues.split('&');

                    for (var x = 0; x < oldValuesArray.length; x++) {

                        var thisSet = oldValuesArray[x].split('=');

                        if (!this.keys.exsits(thisSet[0])) {

                            this.keys.add(new inQuiry.cookie.item(thisSet[0], thisSet[1]));

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
                new inQuiry.cookie.create(cookieName, -1).save();
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
    inQuiry.resourceHelper = {
        loaded: [], 
        promise: false, 
        deferred: inQuiry.Deferred(),
        load: function (srcs) {
           
            srcs = inQuiry.isArray(srcs) ? srcs : srcs.split(/\s+/);
           
            if(!inQuiry.resourceHelper.promise) { 

                inQuiry.resourceHelper.promise = inQuiry.resourceHelper.deferred.promise;
                 
            }

            inQuiry.each(srcs, function(idx, src) { 
                
                inQuiry.resourceHelper.promise = inQuiry.resourceHelper.promise.then(function() { 
                    
                    return src.indexOf('.css') >= 0 ? inQuiry.resourceHelper.loadCSS(src) : inQuiry.resourceHelper.loadScript(src); 
                
                }); 
            
            });
            
            inQuiry.resourceHelper.deferred.resolve();
            
            return inQuiry.resourceHelper.promise;

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

            var abUrl = inQuiry.resourceHelper.fixUri(src)
    
            if (inQuiry.resourceHelper.loaded[abUrl]) { 

                return inQuiry.resourceHelper.loaded[abUrl].promise; 

            }

            var deferred = inQuiry.Deferred();

            var script = document.createElement('script');

            script.src = abUrl;

            script.onload = function (e) {

                deferred.resolve(e);

            };

            script.onerror = function (e) { 

                deferred.reject(e);

            };

            document.body.appendChild(script);

            inQuiry.resourceHelper.loaded[abUrl] = deferred;

            return deferred.promise;

        },
        loadCSS: function (href) {

            var abUrl = inQuiry.resourceHelper.fixUri(href)
    
            if (inQuiry.resourceHelper.loaded[abUrl]) { 

                return inQuiry.resourceHelper.loaded[abUrl].promise; 
            
            }

            var deferred = inQuiry.Deferred();

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

            inQuiry.resourceHelper.loaded[abUrl] = deferred;

            return deferred.promise;

        }
    }

    //************************************************************************************************************************************
    //Extention methods for general js.
    //************************************************************************************************************************************
    Array.prototype.grep = function (callback){     
        
        var filtered = [];
       
        for (let i = 0; i < this.length; i++) {
           
            var item = this[i];
           
            if (callback(item, i)) { 
                filtered.push(item);
            }

        }

        return filtered;
    };
    String.prototype.isEmptyOrNull = function (value) {     

        if(value == null || value == "") {

            return true;

        }

        return false;  

    };

    //************************************************************************************************************************************
    //Framework Startup code
    //************************************************************************************************************************************
    intiate = () => {

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
        inQuiry.browser = browser;
        inQuiry.browser.uri = new URL(window.location.href);

        // Checks for ie
        if ( !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./) ){
            inQuiry("body").addClass("ie");
        }
        
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        var uab = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
        if( (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(uab) ){
            inQuiry("body").addClass("smart");
        } 

    };

    //Setup the window references to the framework
    window.inQuiry = inQuiry;   
    window.$$ = window.inQuiry;

})(window);