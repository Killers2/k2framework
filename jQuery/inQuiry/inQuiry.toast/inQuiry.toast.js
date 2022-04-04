/*!
 * PLUGIN inQuiry uiToast  V1.2
 * @laguage: Javascript ES6
 * @Inspired by: https://github.com/WebDevSimplified/live-toast-notification-library/blob/main/Toast.js
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: JQuery, inQuiry.Extentions.js
 */
(function ($) {
	"use strict";

    class uiToast {

        toastElem;
        autoCloseInterval;
        progressInterval;
        removeBinded;
        timeVisible = 0;
        isPaused = false;
        unpause;
        pause;
        visibilityChange;
        shouldUnPause;
        autoCloseFrame;

        constructor(options) {
           
            this.toastElem = document.createElement("div");
           
            this.toastElem.classList.add("toast");
            
            requestAnimationFrame(() => {
              
                this.toastElem.classList.add("show");
            
            });
            
            this.removeBinded = this.remove.bind(this);
            
            this.unpause = () => (this.isPaused = false);
            
            this.pause = () => (this.isPaused = true);
            
            this.visibilityChange = () => {

                this.shouldUnPause = document.visibilityState === "visible";

            };

            Object.entries(options).forEach(([key, value]) => {

                this[key] = value;

            });

        }

        /**
         * @param {any} value
         */
        set autoClose(value) {

            this.autoCloseFrame = value;

            this.timeVisible = 0;

            if (value === false) 
            {

                return;

            }

            let lastTime;

            const func = time => {

                if (this.shouldUnPause) 
                {

                    lastTime = null;

                    this.shouldUnPause = false;

                }

                if (lastTime == null) {

                    lastTime = time;

                    this.autoCloseInterval = requestAnimationFrame(func);

                    return;

                }

                if (!this.isPaused) 
                {

                    this.timeVisible += time - lastTime;

                    if (this.timeVisible >= this.autoCloseFrame) 
                    {

                        this.remove();

                        return;

                    }

                }
        
                lastTime = time;

                this.autoCloseInterval = requestAnimationFrame(func);

            }
        
            this.autoCloseInterval = requestAnimationFrame(func);

        }

        /**
         * @param {string} value
         */
        set position(value) {

            const currentContainer = this.toastElem.parentElement;

            const selector = `.toast-container[data-position="${value}"]`;

            const container = document.querySelector(selector) || this.createContainer(value);

            container.append(this.toastElem);

            if (currentContainer == null || currentContainer.hasChildNodes()) 
            {

                return;

            }

            currentContainer.remove();
        }
        
        /**
         * @param {string} value
         */
        set text(value) {

            this.toastElem.textContent = value;

        }

        /**
         * @param {boolean} value
         */
        set canClose(value) {

            this.toastElem.classList.toggle("can-close", value);

            if (value) {

                this.toastElem.addEventListener("click", this.removeBinded);

            } else {

                this.toastElem.removeEventListener("click", this.removeBinded);

            }

        }

        /**
         * @param {boolean} value
         */
        set showProgress(value) {
           
            this.toastElem.classList.toggle("progress", value);
           
            this.toastElem.style.setProperty("--progress", 1);

            if (value) {

                const func = () => {

                    if (!this.isPaused) 
                    {

                        this.toastElem.style.setProperty("--progress", 1 - this.timeVisible / this.autoCloseFrame);
                    
                    }

                    this.progressInterval = requestAnimationFrame(func);

                }

                this.progressInterval = requestAnimationFrame(func);

            }

        }

        /**
         * @param {boolean} value
         */
        set pauseOnHover(value) {

            if (value) {

                this.toastElem.addEventListener("mouseover", this.pause);

                this.toastElem.addEventListener("mouseleave", this.unpause);

            } else {

                this.toastElem.removeEventListener("mouseover", this.pause);

                this.toastElem.removeEventListener("mouseleave", this.unpause);

            }

        }

        /**
         * @param {boolean} value
         */
        set pauseOnFocusLoss(value) {
            
            if (value) {
                
                document.addEventListener("visibilitychange", this.visibilityChange);
            
            } else {

                document.removeEventListener("visibilitychange", this.visibilityChange);
            }

        }

        remove() {

            cancelAnimationFrame(this.autoCloseInterval);

            cancelAnimationFrame(this.progressInterval);

            const container = this.toastElem.parentElement;

            this.toastElem.classList.remove("show");

            this.toastElem.addEventListener("transitionend", () => {
               
                this.toastElem.remove();

                if (container.hasChildNodes()) 
                { 
                    return; 
                }

                container.remove();

            });

            this.onClose();

        }

        createContainer = function(position) {

            const container = document.createElement("div");

            container.classList.add("toast-container");

            container.dataset.position = position;

            document.body.append(container);

            return container;

        }

    }

    $.uiToast = function(options)
    {

        const toast = new uiToast($.extend({}, {
            text: "Hello World!",
            position: "top-right",
            showProgress: false,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            canClose: true,
            autoClose: false,
            onClose: () => {}
        }, options));

    }

})(jQuery);