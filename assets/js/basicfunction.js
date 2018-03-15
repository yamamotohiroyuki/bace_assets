// JavaScript Document

(function($) {

	$.bf = {
		// URIを解析したオブジェクトを返すfunction
		Uri: function(path){
			var self = this;
			this.originalPath = path;
			//絶対パスを取得
			this.absolutePath = (function(){
				var e = document.createElement('a');
				e.href = path;
				return e.href;
			})();
			//絶対パスを分解
			var fields = {'schema' : 2, 'username' : 5, 'password' : 6, 'host' : 7, 'path' : 9, 'query' : 10, 'fragment' : 11};
			var r = /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);
			for (var field in fields) {
				this[field] = r[fields[field]];
			}
			this.querys = {};
			if(this.query){
				$.each(self.query.split('&'), function(){
					var a = this.split('=');
					if (a.length == 2) self.querys[a[0]] = a[1];
				});
			}
		},
		//ユニークな配列を取得
		uniqueArray: function(array) {
			var storage = new Object;
			var uniqueArray = new Array();
			var i, value;
			for (var i=0;i<array.length;i++) {
				value = array[i];
				if (!(value in storage)) {
					storage[value] = true;
					uniqueArray.push(value);
				}
			}
			return uniqueArray;
		},
		//ユーザエージェント
		useragent: function(options) {
			var c = $.extend({
				mobileClass:'is_mobile',
				tabletClass:'is_tablet',
				pcClass:'is_pc'
			}, options);
			var ua = navigator.userAgent;
			if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
				$('body').addClass(c.mobileClass);
			} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
				$('body').addClass(c.tabletClass);
			} else {
				$('body').addClass(c.pcClass);
			}
		},
		//現在のページと親ディレクトリへのリンク
		selflink: function (options) {
			var c = $.extend({
				selfLinkAreaSelector:'body',
				selfLinkClass:'current-link',
				parentsLinkClass:'parents-link'
			}, options);
			$(c.selfLinkAreaSelector+((c.selfLinkAreaSelector)?' ':'')+'a[href]').each(function(){
				var href = new $.bf.Uri(this.getAttribute('href'));
				if ((href.absolutePath == location.href) && !href.fragment) {
					//同じ文書にリンク
					$(this).addClass(c.selfLinkClass);
				} else if (0 <= location.href.search(href.absolutePath)) {
					//親ディレクトリリンク
					$(this).addClass(c.parentsLinkClass);
				}
			});
		},
		//カテゴリー内表示
		category: function(options) {
			var c = $.extend({
				buttonSelector: '.same-category',
				selfCategoryClass: 'is_same'
			}, options);
			var bodyClasses = new Array();
			if ($('body').attr('class')) {
				bodyClasses = $('body').attr('class').split(' ');
			}
			for (var i=0;i<bodyClasses.length;i++) {
				$(c.buttonSelector).each(function(){
					if ($(this).hasClass(bodyClasses[i])) {
						//初期表示
						$(this).addClass(c.selfCategoryClass);
					}
				});
			}
		},
		//ページ内リンクはするするスクロール
		scroll: function(options) {
			var c = $.extend({
				duration: 500,
				scrollOffset: 0,
				scrollSelector: ".js-scroll"
			}, options);
			$(c.scrollSelector).click(function(event){
				var hrefdata = new $.bf.Uri(this.getAttribute('href'));
				var position = $('#'+hrefdata.fragment).offset().top;
				$(navigator.userAgent.match(/safari/i) ? 'body' : 'html').animate({
					scrollTop: position - c.scrollOffset
				}, {
					duration: c.duration
				});
				event.preventDefault();
				return false;
			});
		},
		// BiggerLink
		// jQuery.BiggerLink v2.0.1
		// http://www.ollicle.com/eg/jquery/biggerlink/
		biggerlink: function(options) {
			var c = $.extend({
				selector:'js-biggerlink',
				biggerclass:'bl-bigger', 	// class added to the first contained link and others that trigger it
				hoverclass:'bl-hover', 		// class added to parent element on hover/focus
				hoverclass2:'bl-hover2', 	// class added to parent element on hover/focus of other links
				clickableclass:'bl-hot', 	// class added to parent element with behaviour
				otherstriggermaster: true,	// will all links in containing biggerlink element trigger the first link
				follow: 'auto'				// follow master link on click? : 'auto',true,false
			}, options);
			$(c.selector).each(function(){
				
				$(this).filter(function(){
					return $('a',this).length > 0;
				}).addClass(c.clickableclass).css('cursor', 'pointer').each(function(i){
					// store element references
					var big = $(this).data('biggerlink',{hovered:false,focused:false,hovered2:false,focused2:false});
					var links = {
						all: $('a',this),
						big: $(this),
						master: $('a:first',this).data('biggerlink',{status:'master'}).addClass(c.biggerclass),
						other: $('a',this).not($('a:first',this)).data('biggerlink',{status:'other'})
					};
					$('a',this).andSelf().each(function(){
						var newdata = $.extend($(this).data('biggerlink'),links);
						$(this).data('biggerlink',newdata);
					});
					// Add title of first link with title to parent if not already set
					var thistitle = big.attr('title');
					var newtitle = big.data('biggerlink').master.attr('title');
					if(newtitle && !thistitle)
					{
						big.attr('title', newtitle);
					}
				// events on biggerlink element
				big
					.mouseover(function(event){
						window.status = $(this).data('biggerlink').master.get(0).href;
						$(this).addClass(c.hoverclass);
						$(this).data('biggerlink').hovered = true;
					})
					.mouseout(function(event){
						window.status = '';
						if(!$(this).data('biggerlink').focused)
						{
							$(this).removeClass(c.hoverclass);
						}
						$(this).data('biggerlink').hovered = false;
					})
					.bind('click',function(event){
						// if clicked direct or non-link
						if(!$(event.target).closest('a').length)
						{
							$(this).data('biggerlink').master.trigger({type:'click',source:'biggerlink'});
							event.stopPropagation();
						}
					});
					// focus/blur
					links.all
					.bind('focus',function(){
						$(this).data('biggerlink').big.addClass(c.hoverclass);
						$(this).data('biggerlink').big.data('biggerlink').focused = true;
					}).bind('blur',function(){
						if(!$(this).data('biggerlink').big.data('biggerlink').hovered)
						{
							$(this).data('biggerlink').big.removeClass(c.hoverclass);
						}
						$(this).data('biggerlink').big.data('biggerlink').focused = false;
					});
					// click/focus/blur event on master (first) link within biggerlink
					links.master
					.bind('click',function(event){
						if(event.source == 'biggerlink')
						{
							if(c.follow === true || c.follow == 'auto' && event.result !== false)
							{
								window.location = $(this).attr('href');
							}
							else
							{
								event.stopPropagation();
							}
						}
					});
					// links other than the first (master) link also within biggerlink
					// other links are independent
					if(c.otherstriggermaster)
					{
						links.other.addClass(c.biggerclass)
						.bind('click',function(event){
							// trigger click events on master link instead
							$(this).data('biggerlink').master.trigger({type:'click',source:'biggerlink'});
							// stop this link being followed
							event.preventDefault();
							// prevent events on parent elements being triggered
							event.stopPropagation();
						});
					}
					// other links are slaves of master link 
					else
					{
						links.other
						.bind('focus',function(){
							$(this).data('biggerlink').big.addClass(c.hoverclass2);
							$(this).data('biggerlink').big.data('biggerlink').focused2 = true;
						})
						.bind('blur',function(){
							if(!$(this).data('biggerlink').big.data('biggerlink').hovered2)
							{
								$(this).data('biggerlink').big.removeClass(c.hoverclass2);
							}
							$(this).data('biggerlink').big.data('biggerlink').focused2 = false;
						})
						.bind('mouseover',function(event){
							$(this).data('biggerlink').big.addClass(c.hoverclass2);
							$(this).data('biggerlink').big.data('biggerlink').hovered2 = true;
							event.stopPropagation();
						})
						.bind('mouseout',function(event){
							if(!$(this).data('biggerlink').big.data('biggerlink').focused2)
							{
								$(this).data('biggerlink').big.removeClass(c.hoverclass2);
							}
							$(this).data('biggerlink').big.data('biggerlink').hovered2 = false;
							event.stopPropagation();
						});
						if(!links.other.attr('title'))
						{
							links.other.attr('title','');
						}
					}
				});
				return this;
			});
		},
		
		//タブ機能
		tab: function(options) {
			var c = $.extend({
				tabNavWrapperSelector: '.js-tabs',
				tabNavSelector: '.js-tab',
				tabPanelWrapperSelector: '.js-panels',
				tabPanelSelector: '.js-panel',
				activeTabClass: 'is_active'
			}, options);
			
			$.each($(c.tabPanelSelector), function(i, val) {
				if ($(val).hasClass(c.activeTabClass)) {
					$(val).show();
				}
			});
			
			$(c.tabNavWrapperSelector+' a, '+c.tabNavWrapperSelector+' area').on('click', function (event) {
				// scroll cancell
				/*event.preventDefault();
				$("html, body").stop().animate();*/
				// panel check
				var target = $(this).attr('href');
				if (!$(target).length) return false;
				// hide tab
				$(c.tabNavWrapperSelector+' a, '+c.tabNavWrapperSelector+' area').removeClass(c.activeTabClass);
				// active tab
				var href = $(this).attr('href');
				$.each($(c.tabNavWrapperSelector+' a, '+c.tabNavWrapperSelector+' area'), function(i, val) {
					if ($(val).attr('href') == href) {
						$(val).addClass(c.activeTabClass);
					}
				});
				// hide panel
				$(c.tabPanelSelector, $(target).closest(c.tabPanelWrapperSelector)).removeClass(c.activeTabClass).hide();
				// active panel
				$(target).addClass(c.activeTabClass).fadeIn();
				
				return false;
			});
		},
		
		//トグル表示
		toggleBox: function(options) {
			var c = $.extend({
				selector: '.js-toggle',
				speed: 'normal'
			}, options);
			//要素を非表示
			$(c.selector).each(function(){
				$(this).parent().next().hide();
			});
			//クリックイベント
			$(c.selector).click(function(){
				$(this).parent().next().slideToggle(c.speed);
			});
		}
	};
})(jQuery);
