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

// Javascript that gets loaded if the user isn't logged in

var mojoLogin = {
	success: false,
	container: null,
	open: function (dialog) {
		dialog.overlay.fadeIn('fast');
		dialog.container.fadeIn('fast');
		dialog.data.fadeIn('fast', function () {
			jQuery("#mojo_email").select();
		});
	},
	close: function ( dialog ) {
		dialog.overlay.fadeOut('fast');
		dialog.container.fadeOut('fast');
		dialog.data.fadeOut(function() {
			if (! mojoLogin.success)
			{
				// re-inserts our form back into the DOM (hidden) with the state saved
				jQuery.modal.close();	
			}
		});
	}
};

jQuery(document).ready(function() {

	// load the CSS for this
	jQuery('head').append('<link type="text/css" rel="stylesheet" href="'+Mojo.URL.css_path+'/modal_login" />');

	jQuery("a.mojo_activate_login").click(function(e) {
		e.preventDefault();

		jQuery('div.mojo_login').modal({
			persist: true,
			overlayId: 'mojo-overlay',
			containerId: 'mojo-container',
			opacity:35,
			overlayClose:true,
			onOpen:mojoLogin.open,
			onClose:mojoLogin.close
		});

		// Focus events
		jQuery(".mojo_login_field input").focus(function() {
			if (jQuery(this).val() == Mojo.Lang.email)
			{
				jQuery(this).val('');
			}
		});
	});

	jQuery(".mojo_login form").submit(function(e) {

		if (mojoLogin.success) {
			return true;
		}
		
		e.preventDefault();

		// First thing we do is validate on the client end to ensure there's no honest inputting mistake
		// We aren't paranoid here, just make sure its not an honest error
		if (
				jQuery("#mojo_email").val().indexOf("@") == -1 || // its got an "@"
				jQuery("#mojo_email").val().indexOf(".") == -1 || // its got a "."
				jQuery("#mojo_email").val().length < 5 || // its at least 5 chars
				jQuery("#mojo_password").val() == "" // password isn't blank
			) {

			jQuery('#mojo_login_error').addClass('error').html(Mojo.Lang.email_password_warning);
			
			return false;
		}

		// What page to submit to?
		var submit_url = jQuery(".mojo_login form").attr('action') + '_ajax';

		jQuery.ajax({
			type: "POST",
			url: submit_url,
			dataType: "json",
			data: jQuery(".mojo_login form").serialize(),
			success: function( result ){
				if (result == null)
				{
					jQuery('#mojo_login_error').addClass('error').html(Mojo.Lang.login_result_failure);
				}
				else
				{
					if (result.login_status === 'success')
					{
						group_name = result.group_name;
						mojoLogin.success = true;

						jQuery(".mojo_activate_login").remove();
						jQuery('#mojo_login_error').removeClass('error').html(result.message);
						jQuery.modal.close();

						/* Now, fire the "real" (non-AJAX) submit as a courtesy so that browsers will
						prompt to remember the credentials. Yes, we're submitting twice for now. */
						jQuery(".mojo_login form").submit();
					}
					else
					{
						jQuery('#mojo_login_error').addClass('error').html(result.message);
					}
				}
			}
		});
	});
});