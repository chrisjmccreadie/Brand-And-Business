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

function CKEDITOR_GETURL( resource )
{
	// This re-routes requests for lanugage files into MojoMotor's
	// language directory, allowing for easier i18n and language packs.
	if (resource.indexOf('lang') >= 0)
	{
		return Mojo.URL.editor_lang_path;
	}
}

// Since this function is unneeded by editors, we'll put it in the admin only file
function region_alter_callback(regions)
{
	var buttons = {};
		buttons.Cancel = function() { jQuery(".layout_edit_form_dialog").dialog("close"); };
		buttons.OK = function() {
			jQuery(".layout_edit_form_dialog").dialog("close");
			jQuery("#mojo_layout_edit_form").prepend('<input type="hidden" name="region_warning" value="accepted" />').submit();
		};

	jQuery("<div class='layout_edit_form_dialog'><p>"+regions+Mojo.Lang.layout_region_warning+"</p></div>").dialog({
		resizable: false,
		title: Mojo.Lang.layout_region_warning_title,
		modal: true,
		width: '400px',
		buttons: buttons
	});
}

jQuery(document).ready(function() {

	// common setup
	mojoEditor.setup_mojobars('{adminMarkup}');

	mojoEditor.delete_abstraction('layout_delete');
	mojoEditor.delete_abstraction('page_delete');
	mojoEditor.delete_abstraction('member_delete');

	// Any updating to do?
	if (Mojo.Vars.update_flag)
	{
		if (mojoEditor.is_open)
		{
			mojo_version_update();
		}
		else
		{
			// Mojo bar is collapsed, so delegate this for the next time the bar is opened
			jQuery("#mojo-container").delegate("#collapse_tab", "click", function () {
				mojo_version_update();
			});
		}
	}

	function mojo_version_update() {
		mojoEditor.add_notice('<a href="'+Mojo.URL.site_path+'/setup/update">'+Mojo.Lang.run_update+'</a>', 'system_notice');
		// jQuery("#mojo_reveal_page_notice").addClass("system_notice").html("asdf").show();
	}

});