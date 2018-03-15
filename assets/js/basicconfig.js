// JavaScript Document
/* ===========================================================

	Title: basicconfig.js
	Version: 1.0
	Created: 2018-02-01

=========================================================== */

$(function bf($) {
	//ユーザエージェント
	$.bf.useragent({
		mobileClass:'is_mobile',
		tabletClass:'is_tablet',
		pcClass:'is_pc'
	});
	// 現在のページと親ディレクトリへのリンク
	$.bf.selflink({
		selfLinkAreaSelector: 'body',
		selfLinkClass: 'current-link',
		parentsLinkClass: 'parents-link'
	});
	// カテゴリー内表示
	$.bf.category({
		buttonSelector: '.js-same-category', 
		selfCategoryClass: 'is_same'
	});
	// ページ内リンクはするするスクロール
	$.bf.scroll({
		duration: 500,
		scrollOffset: 200,
		scrollSelector: ".js-scroll"
	});
	// Bigger Link
	$.bf.biggerlink({
		selector: '.js-biggerlink',
		biggerclass: 'bl-bigger', // class added to the first contained link and others that trigger it
		hoverclass: 'bl-hover', // class added to parent element on hover/focus
		hoverclass2: 'bl-hover2', // class added to parent element on hover/focus of other links
		clickableclass: 'bl-hot', // class added to parent element with behaviour
		otherstriggermaster: true, // will all links in containing biggerlink element trigger the first link
		follow: 'auto' // follow master link on click? : 'auto',true,false*/
	});
	// タブ
	$.bf.tab({
		tabNavWrapperSelector: '.js-tabs',
		tabNavSelector: '.js-tab',
		tabPanelWrapperSelector: '.js-panels',
		tabPanelSelector: '.js-panel',
		activeTabClass: 'is_active'
	});
	//トグル表示
	$.bf.toggleBox({
		selector: '.js-toggle',
		speed: 'normal'
	});
});


