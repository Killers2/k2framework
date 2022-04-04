/*!
 * PLUGIN inQuiry Animations V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: inQuiry.js, GSAP (https://greensock.com/gsap/) (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js)
 */
(function ($$) {
	"use strict";

    $$.fn.animate = function(options, speedOrTweenOut, easingOrHandler, handler) { 
        
        if(this.length <= 0)
        {
            return this;
        }

        if(options.duration == null)
        {

            if(typeof speedOrTweenOut !== "function")
            {

                options.duration = (speedOrTweenOut / 1000); // for ms

            }

        }

        if(options.ease == null)
        {

            if(typeof easingOrHandler === "string" || easingOrHandler instanceof String)
            {
                
                if(easingOrHandler == "easeInOut")
                {

                    easingOrHandler = Linear.EaseOut;

                }

                if(easingOrHandler == "easeOutIn")
                {

                    easingOrHandler = Linear.EaseIn;

                }

            }

            if(typeof easingOrHandler !== "function")
            {

                options.ease = easingOrHandler;

            }

        }

        if(options.onComplete == null)
        {

            options.onComplete = () => {    
                
                if(easingOrHandler != null && typeof easingOrHandler === "function")
                {

                    easingOrHandler(this);

                } 
                else if(handler != null && typeof handler === "function")
                {

                    handler(this);

                }

            }
        }

        this.each((idx, item) => {

            if($$(item)[0].tween)
            {
                $$(item)[0].tween.pause();
                $$(item)[0].tween.kill();
                $$(item)[0].tween = null;
            }

            $$(item)[0].tween = gsap.timeline();

            $$(item)[0].tween.to(this, options);
           
            if(typeof speedOrTweenOut === "function")
            {

                speedOrTweenOut($$(item)[0].tween);
                
            }

        });

        return this;

    };

    $$.fn.stop = function() { 
       
        if(this.length <= 0)
        {
            return this;
        }

        this.each((idx, item) => {

            if($$(item)[0].tween)
            {
                $$(item)[0].tween.pause();
                $$(item)[0].tween.kill();
                $$(item)[0].tween = null;
            }

        });

        return this;

    };

    $$.fn.fadeOut = function(timeOrOptions, callback) { 
        
        if(this.length <= 0)
        {
            return this;
        }

        var _opacity = 0;
        var _time = timeOrOptions;

        if(typeof timeOrOptions === "object" || timeOrOptions instanceof Object)
        {

            _opacity = timeOrOptions.alfa * .01;

            _time = timeOrOptions.delay;

        }

        if(typeof timeOrOptions === "string" || timeOrOptions instanceof String)
        {

            switch (timeOrOptions.toLowerCase()) 
            {
                case "slow": 
                    _time = 2000;
                    break;
                case "fast": 
                    _time = 600;
                    break;
                default:
                    _time = 1000;
                    break;
            }

        }


        this.each((idx, item) => {

            if($$(item)[0].tween)
            {
                $$(item)[0].tween.pause();
                $$(item)[0].tween.kill();
                $$(item)[0].tween = null;
            }

            $$(item)[0].tween = gsap.timeline();

            $$(item).css("opacity", "1");

            $$(item)[0].tween.to(this, { opacity: _opacity, duration: (_time / 1000), 
                onComplete: () => {    

                    this.css("display", "none").css("opacity", "");

                    if(callback != null && typeof callback === "function")
                    {

                        callback(this);

                    }
                    
                }, ease: Linear.EaseOut });

        });

        return this;

    };

    $$.fn.fadeIn = function(timeOrOptions, callback) { 

        if(this.length <= 0)
        {
            return this;
        }

        var _opacity = 1;
        var _time = timeOrOptions;

        if(typeof timeOrOptions === "object" || timeOrOptions instanceof Object)
        {

            _opacity = timeOrOptions.alfa * .01;

            _time = timeOrOptions.delay;

        }

        if(typeof timeOrOptions === "string" || timeOrOptions instanceof String)
        {

            switch (timeOrOptions.toLowerCase()) 
            {
                case "slow": 
                    _time = 2000;
                    break;
                case "fast": 
                    _time = 600;
                    break;
                default:
                    _time = 1000;
                    break;
            }

        }

        this.each((idx, item) => {

            if($$(item)[0].tween)
            {
                $$(item)[0].tween.pause();
                $$(item)[0].tween.kill();
                $$(item)[0].tween = null;
            }

            $$(item)[0].tween = gsap.timeline();

            $$(item).css("opacity", "0");

            $$(item)[0].tween.to(item, { opacity: _opacity, duration: (_time / 1000), 
                onComplete: () => {    
                    
                    $$(item).css("opacity", "").css("display", "block");
                    
                    if(callback != null && typeof callback === "function")
                    {

                        callback(this);

                    }

                }, ease: Linear.EaseOut });

        });


        return this;

    };

})(inQuiry);
