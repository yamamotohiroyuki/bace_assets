/*
 * yuga.js 0.7.2 - 優雅なWeb制作のためのJS
 *
 * Copyright (c) 2009 Kyosuke Nakamura (kyosuke.jp)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since:     2006-10-30
 * Modified:  2012-02-04
 */

/*
 * yuga.js TT Custom
 *
 * Copyright (c) 2011 TAGAWA takao (dounokouno@gmail.com)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since:     2011-09-18
 * Modified:  2012-10-11
 */

/*
 * currentsetting.js BA Custom
 *
 * Copyright (c) 2019 Japan REIT (hiroyuki.yamamoto@japan-reit.co.jp)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since:     2019-01-07
 * Modified:  2019-01-07
 */

(function($) {
	$(function() {
		$.currentsetting.selflink();
		$.currentsetting.category();
	});
})(jQuery);


(function($) {

	$.currentsetting = {
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
		//現在のページと親ディレクトリへのリンク
		selflink: function (options) {
			var c = $.extend({
				selfLinkAreaSelector:'body',
				selfLinkClass:'is-current',
				parentsLinkClass:'is-parents'
			}, options);
			$(c.selfLinkAreaSelector+((c.selfLinkAreaSelector)?' ':'')+'a[href]').each(function(){
				var href = new $.currentsetting.Uri(this.getAttribute('href'));
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
				buttonSelector: '.js-same-category',
				selectClass: 'is-same-category'
			}, options);
			var bodyClasses = new Array();
			if ($('body').attr('class')) {
				bodyClasses = $('body').attr('class').split(' ');
			}
			for (var i=0;i<bodyClasses.length;i++) {
				$(c.buttonSelector).each(function(){
					if ($(this).hasClass(bodyClasses[i])) {
						//初期表示
						$(this).addClass(c.selectClass);
					}
				});
			}
		}
	};
})(jQuery);
