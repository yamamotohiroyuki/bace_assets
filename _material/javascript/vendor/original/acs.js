/*
 * acs.js 0.0.1 - 出現したらaddclassするプラグイン
 *
 * Since:     2019-02-01
 * Modified:  2012-02-04
 */

(function($) {
  $.fn.acs = function(options) {
      var elements = this;
      var defaults = {
          screenPos: 0.8,
          className: 'is-show'
      };
      var setting = $.extend(defaults, options);
      $(window).on('load scroll', function() {
          add_class_in_scrolling();
      });
      function add_class_in_scrolling() {
          var winScroll = $(window).scrollTop();
          var winHeight = $(window).height();
          var scrollPos = winScroll + (winHeight * setting.screenPos);

          if(elements.offset().top < scrollPos) {
              elements.addClass(setting.className);
          }
      }
  }
})(jQuery);