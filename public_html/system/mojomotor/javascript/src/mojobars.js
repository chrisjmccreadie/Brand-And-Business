/**
 * MojoMotor - by EllisLab
 *
 * @package		MojoMotor
 * @author		MojoMotor Dev Team
 * @copyright	Copyright (c) 2003 - 2011, EllisLab, Inc.
 * @license		http://mojomotor.com/user_guide/license.html
 * @link		http://mojomotor.com
 * @since		Version 1.0
 * @filesource
 */
 
// ------------------------------------------------------------------------

// Create a void console.log if the browser does not support it
if (typeof console == "undefined" || ! console.log) {
	console = { log: function() { return false; }};
}

// Disable getScript's cache-busting parameter
jQuery.ajaxSetup({cache: true});

////////////////////////////////
//
// Editing Bars
//
////////////////////////////////

update_edit_mode_callback = function (edit_mode) {
	// Re-calibrate edit mode if they are editing themself
	Mojo.edit_mode = edit_mode;
};

mojoEditor = {
	revealed_page: '',
	breadcrumb_object: {},
	is_open: true,
	last_active_menu: '',
	active_menu: '',
	region_type: 'local',
	mojo_editor_ref: '',
	follow_link: true // used to detect if a link was followed, or the back/forward button used
};

// SimpleModal's autoResize doesn't expand width beyond the initial width at page load; annoying
$(window).resize(function() {
	$("#mojo-container").width($(this).width());
});

mojoEditor.setup_mojobars = function(role) {

	jQuery.address.init(function(){
		jQuery.address.strict(false);
	}).change(function(event)
	{
		if (event.path != '')
		{
			if ( ! mojoEditor.follow_link)
			{
				mojoEditor.reveal_page(event.path);
			}
		}
	});

	// load the CSS for MojoMotor and jQuery UI
	jQuery('head').append('<link type="text/css" rel="stylesheet" href="'+Mojo.URL.css_path+'/jqueryui" />'+"\n"+'<link type="text/css" rel="stylesheet" href="'+Mojo.URL.css_path+'" />');

	if (Mojo.Vars.additional_css != '')
	{
		jQuery('head').append('<link type="text/css" rel="stylesheet" href="'+Mojo.Vars.additional_css+'" />'+"\n");
	}

	// Do we want the bar closed? Mojo.Vars.bar_state is conditionally set up in the page controller
	if (Mojo.Vars.bar_state == false)
	{
		mojoEditor.is_open = false;
		bar_position = '-77px';
	}
	else
	{
		mojoEditor.is_open = true;
		bar_position = '0px';
	}

	jQuery('body').prepend('<div id="MojoMotorContentPusher" style="height:77px;margin-top:'+bar_position+';"></div>');

	// "role" is actually a view var for parsing, ie: {editorMarkup}
	jQuery.modal(role, {
		overlayId: 'mojo_editor_overlay',
		containerId: 'mojo-container',
		maxHeight: 77,
		containerCss: {top: bar_position, left:0, width: '100%'}, // start it hidden "over" the fold
		close: false,
		focus: false,
		autoResize: false,
		autoPosition: false,
		onOpen: function (dialog) {
			dialog.container.slideDown('fast', function () {
				dialog.data.show();
			});
		},
		onClose: function (dialog) {
			dialog.container.slideUp('fast');
		}
	});

	// The reveal page
	reveal_page = jQuery('<p id=\"mojo_reveal_page_notice\"></p><div id=\"mojo_breadcrumbs\"><div id=\"mojo_ajax_page_loader\"><img src=\"{cp_img_path}ajax-loader_dark.gif\" alt=\"\" height=\"24\" width=\"24\" /></div><a href="#" id="mojo_reveal_page_back" class="mojo_sub_page"></a><span id="mojo_reveal_current_page"></span></div><div id="mojo_reveal_page"><div id="mojo_reveal_page_content"></div></div><a href="#" class="mojo_reveal_page_close">'+Mojo.Lang.close+'</a>').css({
		overflow: 'auto',
		'max-height': (jQuery(window).height() - 150)+'px'
	});

	jQuery("#mojo-container").append(reveal_page);
	jQuery(reveal_page).hide();

	jQuery(".mojo_reveal_page_close").css({'left':(jQuery(document).width()/2-15)+"px"});

	jQuery(".mojo_reveal_page_close").click(function (e) {
		e.preventDefault();
		mojoEditor.unreveal_page();
	});

	mojoEditor.collapse_bar();

	mojoEditor.setup_logout();

	jQuery("#mojo-container").delegate(".mojo_page_refresh_trigger", "click", function (e) {
		window.location.reload();
	});

	// Setup main bar options
	jQuery("#mojo-container").delegate("#mojo_main_bar li a, .mojo_sub_page", "click", function (e) {
		e.preventDefault();
		mojoEditor.follow_link = true;

		// If a sub page isn't revealed, then reveal it, but if there is one
		// showing the user clicks the menu, collapase anything currently visible.
		mojoEditor.last_active_menu = mojoEditor.active_menu;
		mojoEditor.active_menu = jQuery(this).parent().attr('id');
		if (mojoEditor.active_menu == '')
		{
			mojoEditor.active_menu = mojoEditor.last_active_menu;
		}

		if (jQuery("#mojo_reveal_page").is(':visible') === false || mojoEditor.revealed_page != jQuery(this).attr('href'))
		{
			// Change the var that tracks which page is revealed
			mojoEditor.revealed_page = jQuery(this).attr('href');

			// There are some links that aren't main menu items that we still want to ACT as
			// if they were main menu items. These links have the class ".mojo_breadcrumb_supress"
			// so we'll fake it here
			if (jQuery(this).hasClass('mojo_sub_page') && ! jQuery(this).hasClass('mojo_breadcrumb_supress'))
			{
				mojoEditor.breadcrumb_object.seg_method = jQuery(this).attr('title');
			}
			else
			{
				// We know this is either a main menu page, or a link in the menu bar that isn't
				// from the main menu. If it isn't from the main menu, remove the "active page"
				// styling from the menu.
				if (jQuery(this).hasClass('mojo_breadcrumb_supress'))
				{
					mojoEditor.active_page(true);
				}

				// Breadcrumb setup
				mojoEditor.breadcrumb_object.seg_controller = [jQuery(this).attr('title'), jQuery(this).attr('href')];
				mojoEditor.breadcrumb_object.seg_method = '';
			}

			// Show the page
			mojoEditor.reveal_page(mojoEditor.revealed_page);
		}
		else
		{
			// toggle the revealed page closed now, but ensure that 
			// sub page links never unreveal a page
			if (jQuery(this).hasClass('mojo_sub_page') && ! jQuery(this).hasClass('mojo_breadcrumb_supress'))
			{

			}
			else
			{
				mojoEditor.unreveal_page();
			}
		}
	});

	jQuery("#mojo-container").delegate("#layout_name", "keyup", function () {
		mojoEditor.liveUrlTitle(this);
	});

	jQuery("#mojo-container").delegate("#page_title", "keyup", function () {
		// Don't go changing the url_title if the page already exists
		if ( ! jQuery("input[name=page_id]").length)
		{
			mojoEditor.liveUrlTitle(this, 'url_title');
		}
	});

	// We're done with the setup code. Now let's load up the CKEditor
	// code. We do this here to defer pushing its data around, thus
	// making the page appear to load faster.
	jQuery.getScript(Mojo.URL.site_path+'/javascript/load_ckeditor', function() {
		// Now that the editor is ready to roll, we can reveal the editable regions
		// to the user.
		if (mojoEditor.is_open)
		{
			mojoEditor.enable_page_regions();
		}
	});

	// Initialize editor plugins
	// I cut it up like a sous chef...
	jQuery.getScript(Mojo.URL.editor_plugin_path);
};

mojoEditor.collapse_bar = function () {
	// The collapse tab
	collapse_tab = jQuery('<div id="collapse_tab"></div>');

	jQuery("#mojo-container").append(collapse_tab);

	if (Mojo.Vars.bar_state == true)
	{
		jQuery(collapse_tab).hide();
	}

	jQuery("#mojo_bar_view_mode, #collapse_tab").click(function(){

		// Simplemodal isn't able to programmatically call an open, so we're
		// faking it by duplicating the opening animation. In this context, 
		// it makes sense to "fake" the close as well. We'll also need to set
		// the variable we're using to track open vs closed manually.

		if (mojoEditor.is_open)
		{
			mojoEditor.disable_page_region();

			jQuery(reveal_page).slideUp('fast');

			// This is the normal SimpleModal close, which we're ignoring as
			// per the above comment, but leaving here for reference.
			// jQuery.modal.close();

			jQuery("#collapse_tab").slideDown('fast');

			jQuery("#MojoMotorContentPusher").animate({
				'margin-top':'-77px'
			});

			jQuery("#mojo-container").animate({
				top:"-"+ (jQuery("#mojo-container").height())
			});

			mojoEditor.is_open = false;
		}
		else
		{
			mojoEditor.enable_page_regions();

			jQuery("#MojoMotorContentPusher").animate({
				'margin-top':0
			});

			jQuery("#mojo-container").animate({
				top: 0
			}, function () {
				jQuery("#collapse_tab").slideUp('fast');
			});

			mojoEditor.is_open = true;
		}

		// remember the state of the bar for next pageload
		jQuery.ajax({
			type: "POST",
			data:  Mojo.Vars.csrf_token+'='+Mojo.Vars.csrf,
			url: Mojo.URL.admin_path+"/editor/bar_state/"+mojoEditor.is_open
		});
	});
};


mojoEditor.enable_page_regions = function () {
	
	jQuery(".mojo_page_region").each(function () {

		var bubble_name = jQuery(this).attr('id').replace("_", " ");

		mod_editable_layer = jQuery("<div class='mojo_editable_layer'></div>").css({opacity: '0.4', width: jQuery(this).width(), height: jQuery(this).outerHeight()}).fadeIn('fast');
		jQuery(this).prepend(jQuery("<div class='mojo_editable_layer_header'><p>"+Mojo.Lang.local+" : "+bubble_name+"</p></div>")).prepend(mod_editable_layer);
	});

	jQuery(".mojo_global_region").each(function () {

		var bubble_name = jQuery(this).attr('id').replace("_", " ");
		var r_id = jQuery(this).attr('data-mojo_id');
		var superized_name = (r_id != undefined && Mojo.Vars.layout_id != r_id) ? Mojo.Lang.super_global : Mojo.Lang.global;

		mod_editable_layer = jQuery("<div class='mojo_editable_layer mojo_global'></div>").css({opacity: '0.4', width: jQuery(this).width(), height: jQuery(this).outerHeight()+20}).fadeIn('fast');
		jQuery(this).prepend(jQuery("<div class='mojo_editable_layer_header'><p>"+superized_name+" : "+bubble_name+"</p></div>")).prepend(mod_editable_layer);
	});

	jQuery(".mojo_editable_layer, .mojo_editable_layer_header").click(function() {
		mojoEditor.init_editor(jQuery(this).parent());
	});
};


mojoEditor.upload_result = function (filename, alt_text) {

	var url_element, alt_element, dialog = CKEDITOR.dialog.getCurrent();

	// Just double check that we're on the Check if it is an Image dialog.
	if (dialog.getName() == 'image') {

		// Focus on the image info tab
		dialog.selectPage('info');

		// Get the reference to a alt and url fields
		url_element = dialog.getContentElement('info', 'txtUrl');
		alt_element = dialog.getContentElement('info', 'txtAlt');

		if (url_element)
		{
			url_element.setValue(filename);
		}

		if (alt_element)
		{
			alt_element.setValue(alt_text);
		}
	}
};

mojoEditor.disable_page_region = function () {
	jQuery(".mojo_editable_layer_header, .mojo_editable_layer").fadeOut('fast', function(){
		jQuery(this).remove();
	});
};

mojoEditor.init_editor = function (region) {
	region = jQuery(region);

	// We'll need the region_id to save
	region_id = region.attr('id');
	region_layout_id = region.attr('data-mojo_id');

	mojoEditor.region_type = (region.hasClass('mojo_global_region')) ? 'global' : 'local';

	jQuery(".mojo_editable_layer_header, .mojo_editable_layer").remove();


	// We only want to redefine the dialogs once per page load, so we'll look to see if
	// mojo_editor_ref has been assigned, which happens the first time the Mojo Editor
	// is called.
	if (mojoEditor.mojo_editor_ref == '')
	{
		CKEDITOR.on('dialogDefinition', function(ev)
		{
			// Take the dialog name and its definition from the event data.
			var dialogName = ev.data.name;
			var dialogDefinition = ev.data.definition;

			dialogDefinition.onLoad = function () {
				// CKeditor currently provides no way to hide the image preview, so instead
				// of getting stabby, we hide it by default, and work around it (http://dev.ckeditor.com/ticket/3998)
				if ( ! Mojo.Vars.show_expanded_image_options)
				{
					jQuery(".mojopreview").hide();
				}
			};

			if (dialogName == 'image')
			{
				dialogDefinition.removeContents('advanced');
				dialogDefinition.removeContents('Link');
				dialogDefinition.removeContents('image');
				// dialogDefinition.removeContents('Upload');

				if ( ! Mojo.Vars.show_expanded_image_options)
				{
					infoTab = dialogDefinition.getContents('info');
					infoTab.remove('txtBorder');
					infoTab.remove('txtHSpace');
					infoTab.remove('txtVSpace');
					infoTab.remove('cmbAlign');
				}
			}
			else if (dialogName == 'link')
			{
				// dialogDefinition.removeContents('info');
				// dialogDefinition.removeContents('target');
				dialogDefinition.removeContents('advanced');
				dialogDefinition.removeContents('upload');

				infoTab = dialogDefinition.getContents('info');
				// infoTab.remove('url');
				infoTab.remove('linkType');
				// infoTab.remove('protocol');
				infoTab.remove('browse');

				infoTab.add({
					type : 'html',
					id : 'noAnchors',
					style: 'margin: 15px 0;',
					html : '<p>'+Mojo.Lang.or+'</p>'
				});

				infoTab.add({
					type : 'select',
					label : Mojo.Lang.or_choose_page,
					id : 'link',
					items: [],
					onLoad: function() {
						var page_list = this;

						page_list.add(Mojo.Lang.or_choose_page_dropdown, '0');

						jQuery.ajax({
							type: 'POST',
							dataType: 'json',
							url: Mojo.URL.admin_path+"/editor/list_pages/",
							success: function (data) {
								jQuery.each(data, function(i,item){
									page_list.add(item.page_title, item.url_title);
								});
							}
						});
					},
					onChange : function( data )
					{
						if (this.getValue() != '' && this.getValue() !== 0)
						{
							var dialog = CKEDITOR.dialog.getCurrent();

							if (dialog === null)
							{
								return;
							}

							// This var should actually hold {mojo:page:link}, but CKEditor disallows '{', '}', and ':' in
							// attribute values, so this workaround uses the full url
							var mojo_path = Mojo.URL.site_path+'/';
							dialog.setValueOf('info', 'url', mojo_path+this.getValue());  // Populates the URL field in the Links dialogue.
							dialog.setValueOf('info', 'protocol', 'http://');  // We can set the Link's Protocol to Other by leaving the 3rd argument blank, which loads the file from the same folder the link is on
						}
					}
				});

				infoTab.add({
					type : 'checkbox',
					id : 'targeta',
					label : Mojo.Lang.open_in_new_window,
					style: 'margin-top: 15px;',
					commit : function()
					{
						var dialog = CKEDITOR.dialog.getCurrent();

						if (dialog === null)
						{
							return;
						}

						if ( this.getValue() )
						{
							dialog.setValueOf('target', 'linkTargetType', '_blank');
						}
						else
						{
							dialog.setValueOf('target', 'linkTargetType', 'notSet');
						}
					}
				});
			}
		});
	}

	// launch CkEditor
	mojoEditor.original_contents = region.html();
	region.wrapInner('<div id="mojo-active-edit"></div>');

	mojoEditor.mojo_editor_ref = jQuery('#mojo-active-edit').ckeditor(function (editor) {},
		 {
			"skin": "mojo,"+Mojo.URL.editor_skin_path,
			"language": "en",
			"startupMode": Mojo.edit_mode,
			"toolbar": Mojo.toolbar,
			"extraPlugins": 'mojo_cancel,mojo_save',
			"removePlugins": 'scayt,bidi,iframe,save', //spell check as you type
			"toolbarCanCollapse": false,
			"toolbarStartupExpanded": true,
			"resize_enabled": true,
			"width": (region.width()) < 128 ? 128 : region.width(), //minimum width that avoids severe visual breakage
			"height": region.height() + 20, // 20 just ensures everything shows
			"minHeight": 80,
			// These styles are to match up ckeditor styles with existing MojoMotor styles
			"dialog_backgroundCoverColor": '#5C5C5C',
			"dialog_backgroundCoverOpacity": 0.8,
			linkShowTargetTab : false,
			// "protectedSource" : [/\{mojo.*?\}/gi], // {mojo } tags.
	
			// Asset Management
			filebrowserBrowseUrl : Mojo.URL.admin_path+'/editor/browse/',
			filebrowserWindowWidth : '780',
			filebrowserWindowHeight : '500',
			filebrowserUploadUrl : Mojo.URL.admin_path+'/editor/upload/'
		},
		jQuery('#mojo-active-edit').html()
	);
	
	// Fix for an FF4 bug where the editor was disappearing
	// when maximize was clicked. Needs to be revisited, but
	// this works for now.
	mojoEditor.mojo_editor_ref.data('ckeditorInstance').on('afterCommandExec', function(evt) {
		if (evt && evt.data && evt.data.name && evt.data.name == 'maximize') {
			$('html').css('overflow', '');
			$('#mojo-container').css('z-index', '');
		}
	});
	
	// for confirmation on exiting the editor. commented out as some
	// flakey behaviour needs to be sorted out.
	// var editor = jQuery(region).ckeditorGet();
	//
	// editor.on('blur', function() {
	// 	if (mojoEditor.is_active)
	// 	{
	// 		console.log('confirm you want to leave?');
	// 	}
	// });
};


mojoEditor.remove_editor = function (editor) {

	if ( ! editor)
	{
		return;
	}

	// detect if editor is maximized, and if it is, reduce it here
	if (editor.getCommand('maximize').state === 1)
	{
		editor.execCommand('maximize');
	}

	// Destroy the editor.
	editor.destroy();
	editor = null;

	// reinstate editable regions
	if (mojoEditor.is_open)
	{
		mojoEditor.enable_page_regions();
	}
};

mojoEditor.setup_logout = function () {
	// Logout hijack
	jQuery("#mojo_logout").click(function (e) {
		e.preventDefault();

		var buttons = {};
			buttons.Cancel = function() { jQuery(this).dialog("close"); };
			buttons[Mojo.Lang.logout] = function() {
				jQuery.post(Mojo.URL.site_path+"/login/logout", function(data) {
					// logout sent, destroy the whole shebang
					jQuery.modal.close();
					// window.location.reload();
					window.location = Mojo.URL.site_path;
				});
				jQuery(this).dialog('close');
			};

		jQuery("<p>"+Mojo.Lang.logout_confirm+"</p>").dialog({
			resizable: false,
			title: Mojo.Lang.logout,
			modal: true,
			position: ['center', 110],
			buttons: buttons
		});
	});
};

mojoEditor.delete_abstraction = function(classname) {

	jQuery("#mojo-container").delegate(".mojo_"+classname, "click", function (e) {

		e.preventDefault();

		var href = jQuery(this).attr('href');
		var title = Mojo.Lang[classname];
		var extra_warnings = ''; // normally nothing, but allows for additional "WHATCHU DOIN!" notes

		if (classname == 'page_delete')
		{
			// If they are deleting pages, check for subs and issue a strong warning.
			if (jQuery(this).closest("li").find("li").length > 0)
			{
				extra_warnings += '<p class="error">'+Mojo.Lang.subpage_delete+'</p>';
			}
		}

		if ((classname == 'layout_delete' || classname == 'page_delete') && jQuery(".mojo_"+classname).length == 1)
		{
			extra_warnings += '<p class="error">'+Mojo.Lang.last_item_delete+'</p>';
		}

		var buttons = {};
			buttons.Cancel = function() { jQuery(".mojo_"+classname+"_dialog").dialog("close"); };
			buttons[title] = function() {
				jQuery.ajax({
					type: "POST",
					url: href,
					data: Mojo.Vars.csrf_token+'='+Mojo.Vars.csrf+'&'+'confirmed=true',
					dataType: "json",
					success: function (data) {
						if (data.result == 'success')
						{
							jQuery("#mojo_"+classname+"_"+data.id).slideUp(function(){
								jQuery(this).remove(); // Remove it from the screen

								// In event of a page removal, update the site_structure with
								// the new information.
								if (classname == 'page_delete')
								{
									mojoEditor.send_site_structure();
								}
							});
						}

						jQuery(".mojo_"+classname+"_dialog").dialog("close");
						mojoEditor.add_notice(data.message, data.result);
					}
				});
			};

		jQuery("<div class='mojo_"+classname+"_dialog'><p>"+jQuery(this).attr('title')+"</p>"+extra_warnings+"</div>").dialog({
			resizable: false,
			title: title,
			modal: true,
			width: '400px',
			buttons: buttons
		});
	});
};

mojoEditor.subpage_reinit = function() {
	// Because sub pages are pulled in after the fact via ajax.load(), the events
	// almost need to be re-instantiated.

	// Focus on the first visible input field of any form
	if (jQuery("#mojo_reveal_page_content form").length > 0)
	{
		jQuery("#mojo_reveal_page_content form input:visible").eq(0).focus();
	}

	if (jQuery("textarea.mojo_textbox").length)
	{
		// Load plugin dynamically
		jQuery.getScript(Mojo.URL.js_path+'/plugin/tabby', function() {
			jQuery("textarea.mojo_textbox").tabby();
		});
	}

	// Page Map Stuff
	if (jQuery("#mojo_site_structure").length)
	{
		mojoEditor.update_page_hierarchy();

		jQuery('#mojo_site_structure li').draggable({
			handle: ' > div', // IE fix
			opacity: 0.75,
			helper: 'clone' // Send in the clones. Send in those soulful and doleful, schmaltz-by-the-bowlful clones
		});

		jQuery('#mojo_site_structure div, .mojo_site_structure_placeholder').droppable({
			accept: '#mojo_site_structure li',
			tolerance: 'pointer',
			drop: function(event, ui) {

				var li = jQuery(this).parent();
				var child = !jQuery(this).hasClass('mojo_site_structure_placeholder');

				// First child will need a ul as a drop target
				if (child && li.children('ul').length === 0)
				{
					li.append('<ul />');
				}

				if (child)
				{
					li.children('ul').prepend(ui.draggable);
				}
				else
				{
					li.after(ui.draggable);
				}

				li.find('div.ie_fix').removeClass('ie_fix_hover');
				li.find('.mojo_site_structure_placeholder').css({'visibility':'hidden', 'opacity': '0', 'height': '10px'});

				mojoEditor.send_site_structure();
			},
			over: function() {
				jQuery(this).filter('div.ie_fix').addClass('ie_fix_hover');
				jQuery(this).filter('.mojo_site_structure_placeholder').css({'visibility':'visible', 'opacity': '1', 'height': '29px'});
			},
			out: function() {
				jQuery(this).filter('div.ie_fix').removeClass('ie_fix_hover');
				jQuery(this).filter('.mojo_site_structure_placeholder').css({'visibility':'hidden', 'opacity': '0', 'height': '10px'});
			}
		});

		mojoEditor.pages_line_tree();
	} // Page Map Stuff
};

mojoEditor.pages_line_tree = function () {
	//@todo: this needs more if or switch statements. This is way too inefficient.

	jQuery("#mojo_site_structure li").css({'background': 'none'});

	jQuery("#mojo_site_structure ul > li").css({
		'background': 'url({cp_img_path}page_line_child_single.png) no-repeat left top'
	});

	jQuery("#mojo_site_structure > li").has("ul li").css({
		'background': 'url({cp_img_path}page_line_parent_children.png) no-repeat left top'
	});

	jQuery("#mojo_site_structure ul li").has("ul li").css({
		'background': 'url({cp_img_path}page_line_child_children.png) no-repeat left top'
	});

	jQuery("#mojo_site_structure ul").each(function() {
		jQuery(this).children("li:last").css({
			'background': '#202020 url({cp_img_path}page_line_child_last.jpg) no-repeat left top'
		});
	});

	// sub with sub
	jQuery("#mojo_site_structure ul li:last-child").has("ul li").css({
		'background': 'url({cp_img_path}page_line_sublast_children.png) no-repeat left top'
	});

};

mojoEditor.active_page = function (remove_all) {
	// Track active page (gets stripped if a new active page is in use, or in unreveal_page)
	if (remove_all)
	{
		jQuery("#mojo_main_bar li").removeClass();
		mojoEditor.active_menu = '';
	}
	else if (mojoEditor.last_active_menu != mojoEditor.active_menu && mojoEditor.active_menu != '')
	{
		jQuery("#mojo_main_bar li").removeClass();
		jQuery("#mojo-container #"+mojoEditor.active_menu).addClass(mojoEditor.active_menu+'_active');
	}
};

mojoEditor.reveal_page = function (view, remove_notice) {
	if (typeof remove_notice == "undefined")
	{
		remove_notice = true;
	}

	jQuery("#mojo_ajax_page_loader").fadeIn('fast');
	jQuery('body').css({'cursor':'wait'});

	mojoEditor.active_page();

	// History control
	jQuery.address.value(view);

	// Load content
	jQuery("#mojo_reveal_page_content").load(view, function () {

		jQuery("#mojo_ajax_page_loader").hide();
		jQuery(".mojo_reveal_page_close").show();
		jQuery('body').css({'cursor':'default'});
		

		// Over-ride any forms for ajax
		jQuery("#mojo_reveal_page_content form").submit(function (e) {
			e.preventDefault();
			mojoEditor.follow_link = true;

			jQuery.ajax({
				type: 'POST',
				url: jQuery(this).attr('action'),
				data: jQuery(this).serialize(),
				dataType: 'json',
				success: function(data) {
					// Render notices for the user
					if (data.message !== undefined && data.result !== undefined)
					{
						mojoEditor.add_notice(data.message, data.result);
					}

					if (data.reveal_page !== undefined)
					{
						// Breadcrumb setup
						mojoEditor.breadcrumb_object.seg_method = '';

						jQuery("#mojo_reveal_current_page").hide();
						mojoEditor.revealed_page = data.reveal_page;
						mojoEditor.reveal_page(data.reveal_page, false);
					}

					// callbacks?
					if (data.callback !== undefined)
					{
						// when passed, args must already have quotes if they are strings,
						// this function will not try to guess data type.
						args = (data.callback_args !== undefined) ? data.callback_args : "";
						window[data.callback](args);
					}
				}
			});
		});

		jQuery(reveal_page).slideDown('fast', function() {
			mojoEditor.breadcrumbs();
		});

		mojoEditor.subpage_reinit();
	});

	if (remove_notice === true)
	{
		mojoEditor.remove_notice();
	}

	mojoEditor.follow_link = false;
};

mojoEditor.unreveal_page = function () {
	// Any notices on the screen should be removed now
	mojoEditor.remove_notice();

	// Strip active page since we're hiding everything
	mojoEditor.active_page(true);

	jQuery("#mojo_breadcrumbs").slideUp('fast');
	jQuery("#mojo_reveal_page").slideUp('fast');
	jQuery(".mojo_reveal_page_close").hide();

	mojoEditor.follow_link = false;
};

mojoEditor.add_notice = function (notice, css_class) {
	if (typeof css_class == "undefined")
	{
		css_class = 'notice';
	}

	jQuery("#mojo_reveal_page_notice").html(notice);
	// addClass isn't suitable, as we need the class *replaced* not added to
	jQuery("#mojo_reveal_page_notice").attr('class', css_class);
	jQuery("#mojo_reveal_page_notice").css({visibility:'visible', 'margin-left': "-"+(jQuery("#mojo_reveal_page_notice").outerWidth()/2)+'px'});
	jQuery("#mojo_reveal_page_notice").hide().fadeIn('fast');
};

mojoEditor.remove_notice = function () {
	jQuery("#mojo_reveal_page_notice").fadeOut('fast', function () {
		jQuery(this).css({visibility:'hidden'});
	});
};

mojoEditor.breadcrumbs = function () {
	jQuery("#mojo_reveal_page_back").hide();
	jQuery("#mojo_reveal_current_page").hide();

	// If we don't have a method, assume its 'index'
	jQuery("#mojo_reveal_page_back").html(mojoEditor.breadcrumb_object.seg_controller[0]).show();
	jQuery("#mojo_reveal_page_back").attr('href', mojoEditor.breadcrumb_object.seg_controller[1]);

	// Is there a sub page?
	if (mojoEditor.breadcrumb_object.seg_method != '')
	{
		jQuery("#mojo_reveal_current_page").html(mojoEditor.breadcrumb_object.seg_method).show();
	}
};

mojoEditor.update_page_hierarchy = function() {
	jQuery(".mojo_add_page_inline").each(function(e){
		var segs = '';

		jQuery(this).parents("li").each(function() {
			segs = jQuery(this).attr('id').substring(17)+"/"+segs;
		});

		var modified_href = jQuery(this).attr('href').substring(0, jQuery(this).attr('href').indexOf('add')+3);

		jQuery(this).attr('href', modified_href +"/"+ segs);
	});
};

mojoEditor.send_site_structure = function() {
	jQuery.ajax({
		type: "POST",
		url: Mojo.URL.admin_path+"/pages/page_reorder/",
		data: Mojo.Vars.csrf_token+'='+Mojo.Vars.csrf+'&'+jQuery('#mojo_site_structure').serializeTree('site_structure', '.ui-draggable-dragging'), // don't want the clone now do we?
		dataType: 'json',
		success: function (data) {
			mojoEditor.add_notice(data.message, data.result);
			mojoEditor.update_page_hierarchy();
			mojoEditor.pages_line_tree();
		}
	});
};

mojoEditor.liveUrlTitle = function(calling_field, target_field) {

	var caret_pos = jQuery(calling_field).getCaretPos();

	var NewText = jQuery(calling_field).val().toLowerCase();

	var separator = Mojo.URL.separator;

	// Foreign Character Attempt

	var NewTextTemp = '';
	for(var pos=0; pos<NewText.length; pos++)
	{
		var c = NewText.charCodeAt(pos);

		if (c >= 32 && c < 128)
		{
			NewTextTemp += NewText.charAt(pos);
		}
		else
		{
			if (c == '223') {NewTextTemp += 'ss'; continue;}
			if (c == '224') {NewTextTemp += 'a'; continue;}
			if (c == '225') {NewTextTemp += 'a'; continue;}
			if (c == '226') {NewTextTemp += 'a'; continue;}
			if (c == '229') {NewTextTemp += 'a'; continue;}
			if (c == '227') {NewTextTemp += 'ae'; continue;}
			if (c == '230') {NewTextTemp += 'ae'; continue;}
			if (c == '228') {NewTextTemp += 'ae'; continue;}
			if (c == '231') {NewTextTemp += 'c'; continue;}
			if (c == '232') {NewTextTemp += 'e'; continue;}
			if (c == '233') {NewTextTemp += 'e'; continue;}
			if (c == '234') {NewTextTemp += 'e'; continue;}
			if (c == '235') {NewTextTemp += 'e'; continue;}
			if (c == '236') {NewTextTemp += 'i'; continue;}
			if (c == '237') {NewTextTemp += 'i'; continue;}
			if (c == '238') {NewTextTemp += 'i'; continue;}
			if (c == '239') {NewTextTemp += 'i'; continue;}
			if (c == '241') {NewTextTemp += 'n'; continue;}
			if (c == '242') {NewTextTemp += 'o'; continue;}
			if (c == '243') {NewTextTemp += 'o'; continue;}
			if (c == '244') {NewTextTemp += 'o'; continue;}
			if (c == '245') {NewTextTemp += 'o'; continue;}
			if (c == '246') {NewTextTemp += 'oe'; continue;}
			if (c == '249') {NewTextTemp += 'u'; continue;}
			if (c == '250') {NewTextTemp += 'u'; continue;}
			if (c == '251') {NewTextTemp += 'u'; continue;}
			if (c == '252') {NewTextTemp += 'ue'; continue;}
			if (c == '255') {NewTextTemp += 'y'; continue;}
			if (c == '257') {NewTextTemp += 'aa'; continue;}
			if (c == '269') {NewTextTemp += 'ch'; continue;}
			if (c == '275') {NewTextTemp += 'ee'; continue;}
			if (c == '291') {NewTextTemp += 'gj'; continue;}
			if (c == '299') {NewTextTemp += 'ii'; continue;}
			if (c == '311') {NewTextTemp += 'kj'; continue;}
			if (c == '316') {NewTextTemp += 'lj'; continue;}
			if (c == '326') {NewTextTemp += 'nj'; continue;}
			if (c == '353') {NewTextTemp += 'sh'; continue;}
			if (c == '363') {NewTextTemp += 'uu'; continue;}
			if (c == '382') {NewTextTemp += 'zh'; continue;}
			if (c == '256') {NewTextTemp += 'aa'; continue;}
			if (c == '268') {NewTextTemp += 'ch'; continue;}
			if (c == '274') {NewTextTemp += 'ee'; continue;}
			if (c == '290') {NewTextTemp += 'gj'; continue;}
			if (c == '298') {NewTextTemp += 'ii'; continue;}
			if (c == '310') {NewTextTemp += 'kj'; continue;}
			if (c == '315') {NewTextTemp += 'lj'; continue;}
			if (c == '325') {NewTextTemp += 'nj'; continue;}
			if (c == '352') {NewTextTemp += 'sh'; continue;}
			if (c == '362') {NewTextTemp += 'uu'; continue;}
			if (c == '381') {NewTextTemp += 'zh'; continue;}
		}
	}

	var multiReg = new RegExp(separator + '{2,}', 'g');

	NewText = NewTextTemp;

	NewText = NewText.replace('/<(.*?)>/g', '');
	NewText = NewText.replace(/\s+/g, separator);
	NewText = NewText.replace(/\//g, separator);
	NewText = NewText.replace(/[^a-z0-9\-\._]/g,'');
	NewText = NewText.replace(/\+/g, separator);
	NewText = NewText.replace(multiReg, separator);
	NewText = NewText.replace(/^_/g,'');
	NewText = NewText.replace(/^-/g,'');
	NewText = NewText.replace(/\./g,'');

	if (typeof target_field == "undefined")
	{
		target_field = calling_field;
	}
	else
	{
		target_field = jQuery("#"+target_field);
	}

	jQuery(target_field).val(NewText);
	jQuery(calling_field).setCaretPos(caret_pos);
};

jQuery.fn.getCaretPos = function () {
	var input = this[0];
	if (input.selectionStart)
	{
		return input.selectionStart > 0 ? input.selectionStart : 0; 
	}
	else if (input.createTextRange)
	{
		input.focus();
		var temp_range = document.selection.createRange();
		var orig_range = input.createTextRange();
		var new_range = orig_range.duplicate();
		orig_range.moveToBookmark(temp_range.getBookmark());
		new_range.setEndPoint('EndToStart', orig_range);
		return new_range.text.length;
	}
	return '0';
};

jQuery.fn.setCaretPos = function (position) {
	var input = this[0];
	if (input.setSelectionRange)
	{
		input.focus();
		input.setSelectionRange(position, position);
	}
	else if (input.createTextRange)
	{
		input.createTextRange().collapse(true).moveStart('character', position).moveEnd('character', position).select();
	}
};

jQuery.fn.serializeTree = function (level_string, exclude) {

	var query_string = '';
	var elems;

	elems = (exclude === undefined) ? this.children() : this.children().not(exclude);

	if (elems.length > 0)
	{
		elems.each(function()
		{
			if (this.id.indexOf('drop_target') !== -1)
			{
				return;
			}
			
			var id = jQuery(this).attr('id').substring(17);
			var toAdd = '';

			if (jQuery(this).find('ul li').length > 0)
			{
				level_string += '['+id+']';
				toAdd = jQuery('ul:first', jQuery(this)).serializeTree(level_string, exclude);
				level_string = level_string.replace(/\[[^\]\[]*\]$/, '');
			}
			else
			{
				query_string += '&'+level_string+'['+id+']='+id;
			}

			if (toAdd != '')
			{
				query_string += toAdd;
			}
		});
	}
	else
	{
		query_string += '&'+level_string+'['+this.attr('id')+']=';
	}

	return (query_string != '') ? query_string : false;
};
