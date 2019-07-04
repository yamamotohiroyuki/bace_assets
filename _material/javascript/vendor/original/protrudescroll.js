/*
 * protrudescroll.js 0.0.1 - 指定範囲を越えるとスクロールバーが出現
 *
 * Since:     2019-04-04
 * Modified:  2012-04-04
 */

(function($) {
  $.fn.protrudescroll = function(options) {
      var elements = this;
      var defaults = {
        trigger: 'a[href^="#"]',
        offset_boolean: true,
        offset_target: '',
        offset_number: 0,
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

$(function(){
  $(trigger).click(function(){
    var speed = 500;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
});