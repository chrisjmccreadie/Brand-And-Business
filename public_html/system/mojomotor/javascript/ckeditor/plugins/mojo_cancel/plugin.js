/**
 * MojoMotor - by EllisLab
 *
 * @package		MojoMotor
 * @author		MojoMotor Dev Team
 * @copyright	Copyright (c) 2003 - 2011, EllisLab, Inc.
 * @license		http://mojomotor.com/user_guide/license.html
 * @link		http://mojomotor.com
 * @since		Version 1.0
 */
 
// ------------------------------------------------------------------------

(function()
{
	var cancel_command = {
		modes: {wysiwyg: 1, source: 1},
		exec: function (editor) {
			editor.setData('', function () {

			jQuery("#mojo-active-edit").replaceWith(function() {
			  return jQuery(this).contents();
			});

			mojoEditor.remove_editor(editor);
		});
	
		}
	};


	var pluginName = 'mojo_cancel';

	CKEDITOR.plugins.add(pluginName, {
		init: function(editor) {
			editor.addCommand(pluginName, cancel_command);
					
			editor.ui.addButton(pluginName, {
				label: 'Cancel',
				command: pluginName,
				icon: this.path+"cancel.png"
			});
     	}
	});
})();