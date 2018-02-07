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
				mobileClass:'mobile',
				tabletClass:'tablet',
				pcClass:'pc'
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
				selfCategoryClass: 'selected'
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
				duration: 500
			}, options);
			$('a[href^="#"], area[href^="#"]').not('a[href="#"], area[href="#"]').click(function(event){
				var hrefdata = new $.bf.Uri(this.getAttribute('href'));
				var position = $('#'+hrefdata.fragment).offset().top;
				$(navigator.userAgent.match(/safari/i) ? 'body' : 'html').animate({scrollTop: position}, {
					duration: c.duration,
					complete: function(){
						location.href = hrefdata.absolutePath;
					}
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
				tabNavSelector: '.tabnav',
				activeTabClass: 'active'
			}, options);
			$(c.tabNavSelector).each(function(){
				var tabNavList = $(this).find('a[href^=#], area[href^=#]');
				var tabBodyList;
				tabNavList.each(function(){
					this.hrefdata = new $.bf.Uri(this.getAttribute('href'));
					var selecter = '#'+this.hrefdata.fragment;
					if (tabBodyList) {
						tabBodyList = tabBodyList.add(selecter);
					} else {
						tabBodyList = $(selecter);
					}
					$(this).unbind('click');
					$(this).click(function(){
						tabNavList.removeClass(c.activeTabClass);
						$(this).addClass(c.activeTabClass);
						tabBodyList.hide();
						$(selecter).show();
						return false;
					});
				});
				tabBodyList.hide()
				tabNavList.filter(':first').trigger('click');
			});
		},
		//ボックスの高さを揃える
		heightLine: function(options) {
			var c = $.extend({
				parentSelector: '.heightline-parent',
				groupClassPrefix: 'heightline-'
			}, options);
			//heightline-parent
			$(c.parentSelector).each(function(){
				var height = 0;
				$(this).children().each(function(){
					if (height < parseInt($(this).height())) {
						height = parseInt($(this).height());
					}
				});
				$(this).children().height(height);
			});
			//heightline-group
			var classes = new Array();
			$('body *').not(c.parentSelector+',script,style,br').each(function(){
				if ($(this).attr('class') && $(this).attr('class').match(new RegExp(c.groupClassPrefix))) {
					var ary = $(this).attr('class').split(' ');
					for (var i=0;i<ary.length;i++) {
						if (ary[i].match(new RegExp(c.groupClassPrefix))) {
							classes.push(ary[i]);
						}
					}
				}
			});
			classes = $.bf.uniqueArray(classes);
			for (var i=0;i<classes.length;i++) {
				height = 0;
				$('.'+classes[i]).each(function(){
					if (height < parseInt($(this).height())) {
						height = parseInt($(this).height());
					}
				});
				$('.'+classes[i]).height(height);
			}
		},
		//トグル表示
		toggleBox: function(options) {
			var c = $.extend({
				selector: '.toggle',
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
	/*
	 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
	*/
	(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
	if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
	u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
	h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
	a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
	y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);
})(jQuery);
