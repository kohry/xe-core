/* NHN (developers@xpressengine.com) */
jQuery(function($){
// iSO mobile device toolbar remove
	window.top.scrollTo(0,0);
// Skip to content
	$('.x .skipNav>a').click(function(){
		$($(this).attr('href')).attr('tabindex','0').css('outline','0').focus();
	});

// TARGET toggle
	$('.x [data-toggle]').click(function(){
		$($(this).attr('data-toggle')).toggle();
		return false;
	});
// TARGET show
	$('.x [data-show]').click(function(){
		$($(this).attr('data-show')).show();
		return false;
	});
// TARGET hide
	$('.x [data-hide]').click(function(){
		$($(this).attr('data-hide')).hide();
		return false;
	});

// Tab Navigation
	$('.x .x_tab-content>.x_tab-pane:not(".x_active")').hide();
	$('.x .x_nav-tabs').find('>li>a[href^="#"]').click(function(){
		var $this = $(this);
		$this.parent('li').addClass('x_active').siblings().removeClass('x_active');
		$this.closest('.x_nav-tabs').next('.x_tab-content').find($this.attr('href')).addClass('x_active').show().siblings().removeClass('x_active').hide();
		return false;
	});
// GNB Height 100%
	var $xBody = $('.x>.body');
	var $xContent = $xBody.find('>.content');
	var $xGnb = $xBody.find('>.gnb');
	var $xGnb_li = $xGnb.find('>ul>li');
	$(window).resize(function(){
		setTimeout(function(){
			if($(window).width() <= 980 || $(window).width() > 1240){
				$xBody.removeClass('wide');
			} else {
				$xBody.addClass('wide');
			}
		}, 100);
	}).resize();
// GNB Click toggle
	$xGnb_li.find('ul').prev('a')
		.bind('click focus', function(){
			var $this = $(this);
			// Submenu toggle
			$xGnb_li.not($this.parent('li')).removeClass('open');
			$(this).parent('li').toggleClass('open');
			$xGnb.trigger('mouseenter'); // GNB Hover
			return false;
		});
// GNB Hover toggle
	function contentBugFix(){ // Chrome browser rendering bug fix
		$xContent.width('99.99%');
		setTimeout(function(){
			$xContent.removeAttr('style');
		}, 0);
	}
	$xGnb
		.mouseenter(function(){ // Mouseenter
			if($(window).width() >= 980){
				$xBody.removeClass('wide');
				contentBugFix();
			}
		})
		.mouseleave(function(){ // Mouseleave
			if($(window).width() >= 980 && $(window).width() < 1240){
				$xBody.addClass('wide');
				contentBugFix();
			}
		});
// GNB Mobile Toggle
	$xGnb.find('>a[href="#gnbNav"]').click(function(){
		$(this).parent('.gnb').toggleClass('open');
		return false;
	});
// GNB Close
	$xGnb
		.prepend('<button type="button" class="close before" />')
		.append('<button type="button" class="close after" />');
	$xGnb.find('>.close').focus(function(){
		$xBody.addClass('wide');
		contentBugFix();
	});
// Multilingual
	var $mlCheck = $('.x .multilingual>label>input[type="checkbox"]');
	function multilingual(){
		$mlCheck.each(function(event){
			var $this = $(this);
			var $label = $this.parent('label'); // Checkbox label
			var $input = $label.siblings('input[type="text"]:first');
			var $select = $label.siblings('select:first');
			var $fieldset = $this.closest('.multilingual').siblings('.multilingual_item:first'); // Multilingual list
			if($this.is(':checked')){
				$input.hide();
				$select.show();
				$label.addClass('checked'); 
				$fieldset.show();
			} else {
				$input.show();
				$select.hide();
				$label.removeClass('checked');
				$fieldset.hide();
			}
		});
	}
	multilingual();
	$mlCheck.change(multilingual);
// Check All
	$('.x th>input[type="checkbox"]')
		.change(function() {
			var $this = $(this), name = $this.data('name');

			$this.closest('table')
				.find('input:checkbox')
					.filter(function(){
						var $this = $(this);
						return !$this.prop('disabled') && (($this.attr('name') == name) || ($this.data('name') == name));
					})
						.prop('checked', $this.prop('checked'))
					.end()
				.end()
				.trigger('update.checkbox', [name, this.checked]);
		});
// Pagination
	$('.x .x_pagination .x_disabled, .x .x_pagination .x_active').click(function(){
		return false;
	});
// Section Toggle
	$('.x .section>h1').append('<button type="button" class="snToggle x_icon-chevron-up">Toggle this section</button>');
	$('.x .section>h1>.snToggle').click(function(){
		var $this = $(this);
		var $section = $this.closest('.section');
		if(!$section.hasClass('collapse')){
			$section.addClass('collapse').children('h1:first').siblings().hide();
			$this.removeClass('x_icon-chevron-up').addClass('x_icon-chevron-down');
		} else {
			$section.removeClass('collapse').children('h1:first').siblings().show();
			$this.removeClass('x_icon-chevron-down').addClass('x_icon-chevron-up');
		}
	});
});

// Modal Window
jQuery(function($){

var ESC = 27;

$.fn.xeModalWindow = function(){
	this
		.not('.xe-modal-window')
		.addClass('xe-modal-window')
		.each(function(){
			$( $(this).attr('href') ).addClass('x').hide();
		})
		.click(function(){
			var $this = $(this), $modal, $btnClose, disabled;

			// get and initialize modal window
			$modal = $( $this.attr('href') );
			if(!$modal.parent('body').length) {
				$btnClose = $('<button type="button" class="x_close">&times;</button>');
				$btnClose.click(function(){ $modal.data('anchor').trigger('close.mw') });
				$modal.find('[data-hide]').click(function(){ $modal.data('anchor').trigger('close.mw') });
				$('body').append('<div class="x_modal-backdrop"></div>').append($modal); // append background
				$modal.prepend($btnClose); // prepend close button
			}

			// set the related anchor
			$modal.data('anchor', $this);

			if($modal.data('state') == 'showing') {
				$this.trigger('close.mw');
			} else {
				$this.trigger('open.mw');
			}

			return false;
		})
		.bind('open.mw', function(){
			var $this = $(this), before_event, $modal, duration;

			// before event trigger
			before_event = $.Event('before-open.mw');
			$this.trigger(before_event);

			// is event canceled?
			if(before_event.isDefaultPrevented()) return false;

			// get modal window
			$modal = $( $this.attr('href') );

			// get duration
			duration = $this.data('duration') || 'fast';

			// set state : showing
			$modal.data('state', 'showing');

			// workaroud for IE6
			$('html,body').addClass('modalContainer');

			// after event trigger
			function after(){ $this.trigger('after-open.mw') };

			$(document).bind('keydown.mw', function(event){
				if(event.which == ESC) {
					$this.trigger('close.mw');
					return false;
				}
			});

			$modal
				.fadeIn(duration, after)
				.find('button.x_close:first').focus();
			$('.x_modal-backdrop').show();
		})
		.bind('close.mw', function(){
			var $this = $(this), before_event, $modal, duration;

			// before event trigger
			before_event = $.Event('before-close.mw');
			$this.trigger(before_event);

			// is event canceled?
			if(before_event.isDefaultPrevented()) return false;

			// get modal window
			$modal = $( $this.attr('href') );

			// get duration
			duration = $this.data('duration') || 'fast';

			// set state : hiding
			$modal.data('state', 'hiding');

			// workaroud for IE6
			$('html,body').removeClass('modalContainer');

			// after event trigger
			function after(){ $this.trigger('after-close.mw') };

			$modal.fadeOut(duration, after);
			$('.x_modal-backdrop').hide();
			$this.focus();
		});
};
$('a.modalAnchor').xeModalWindow();
$('div.x_modal').addClass('x').hide();

});
