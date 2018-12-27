/* ===========================================================

  Title: global.js
  Created: 2018-12-10

=========================================================== */
$(document).ready(function(){

  $('.global-main').wrap('<div />').parent('div').addClass('global-main-wrapper');
  // header
  $('.global-main-wrapper').before('<header />').prev().addClass('global-header');
  $('.global-header').load('assets/include/header.html', function (data, status) { });
  // sidenavi
  $('.global-main').before('<nav />').prev().addClass('global-navigation');
  $('.global-navigation').load('assets/include/sidenavi.html', function (data, status) { });
  
});
