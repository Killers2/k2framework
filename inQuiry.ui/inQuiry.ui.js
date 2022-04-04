/*!
 * PLUGIN inQuiry DesktopWindows V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: inQuiry.js
 */
(function ($$) {
	"use strict";

	var resizableMemory = {
		startX: 0,
		startY: 0,
		startWidth: 0,
		startHeight: 0,
		currentElement: null,
		options: null,
		initDrag: function (e) {

			resizableMemory.currentElement = $$(e.currentTarget).closest(".resizable")[0];
		
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
	}

	$$.fn.resizable = function(options)
	{ 
		
		if(typeof options === "string" || options instanceof String)
		{
			if(options.toLowerCase() == "destroy")
			{
				if(this[0].resizable)
				{

					var resizer = $$(this[0]).find(".resizer");
					
					resizer.off("mousedown", this[0].resizable.initDrag);

					$$(this[0]).removeClass("resizable");

					this[0].resizable == null;

				}
		 	}
			if(options.toLowerCase() == "enable")
			{
				if(this[0].resizable)
				{
					
					var resizer = $$(this[0]).find(".resizer");
					
					resizer.on("mousedown", this[0].resizable.initDrag);

				}
			}
			if(options.toLowerCase() == "disable")
			{
				if(this[0].resizable)
				{
					
					var resizer = $$(this[0]).find(".resizer");
					
					resizer.off("mousedown", this[0].resizable.initDrag)

				}
			}

			return this;
		}

		this[0].resizable = resizableMemory;

		if(options) {

			this[0].resizable.options = options;

		}

		$$(this[0]).addClass("resizable");

		var resizer = $$("<div />", { class: "resizer" });

		resizer.append("<i class=\"icon icon-link\"></i>");

		$$(this[0]).append(resizer);

		resizer.on("mousedown", this[0].resizable.initDrag);
		
        return this;

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
				this.totalHeight = $$(this.currentElement).height();
				this.totalWidth = $$(this.currentElement).width();

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

						$$(this.currentElement).css({ transform: "translate(" + deltaX + "px," + deltaY + "px)", transition: "0s" });
						
					}
					else
					{

						$$(this.currentElement).css({ transform: "translate(" + this.currentX + "px," + this.currentY + "px)", transition: "0s" });

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
	}

	$$.fn.draggable = function(options)
	{ 		
		
		if(typeof options === "string" || options instanceof String)
		{
			
			if(options.toLowerCase() == "destroy")
			{
				if(this[0].draggableData)
				{

					$$(this[0]).removeClass("draggable");
		
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

			this[0].draggableData.options = $$.merge(this[0].draggableData.options, options);

			return this;

		}

		if(!options.handle) {

			options.handle = this[0];

		}

		if(!options.containment) {

			options.containment = $$("body")[0];

		}

		this[0].draggableData = new draggableMemory();
		
		this[0].draggableData.options = options;

		this[0].draggableData.currentElement = this[0];
			
		var transition = this.cssTranslateValues();

		this[0].draggableData.xOffset = parseInt(transition.x);

		this[0].draggableData.yOffset = parseInt(transition.y);

		$$(this[0]).addClass("draggable");

		this[0].draggableData.options.handle.on("mousedown", this[0].draggableData.dragInit);

        return this;

	};

	var promise = false;
	var deferred = $$.Deferred();

	$$.fn.uiInclude = function() {
		
		if(!promise) 
		{ 

			promise = deferred.promise; 

		}		
		
		compile(this);
		
		function compile(node)
		{

			node.find('[ui-include]').each((idx, item) => {
				
				var that = $$(item),
				
				url = that.attr('ui-include');
				
				promise = promise.then(() => {

					var request = $$.ajax({ url: url,  method: "GET",  dataType: "text" });
					
					var chained = request.then((xhr) => {
						
						
						var pjax = $$.pjax();
						
						var page = pjax.extractContainer(xhr.responseText, xhr, { fragment: "body", requestUrl: url });
						
						if (page.title) { 
							
							document.title = page.title; 

						}
						
						var context = that;
						
						var requesttwo = new Promise((resolve, reject) => {
							
							pjax.renderTags([...page.scripts, ...page.cssLinks], () => {
								
								try{

									context.html(page.contents);

									context.append(page.scripts.filter(s => s.src == ""));

									context.find("script").each((idx, item) => {

										eval(item.text());

									});

									$$(document).trigger("ready");

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

})(inQuiry);