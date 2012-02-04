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

jQuery(document).ready(function() {

	// common setup
	mojoEditor.setup_mojobars('{editorMarkup}');

	mojoEditor.delete_abstraction('page_delete');
});