<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| Editor Configuration
| -------------------------------------------------------------------
| Specify your configuration options below as an array named "wysiwyg_toolbar". For example
| $config['wysiwyg_toolbar'] = array('Bold', 'Italic', 'Underline', 'Strike', 'Blockquote', 'Link', 'Image');
|
*/



// NOTE
// -------
// MojoMotor uses a modified "Image" plugin. Functionally, it is the same as the standard Image
// plugin, but with a more minimalistic dialog box. We recommend you use it instead of the default,
// however the standard "Image" plugin remains available to you if you want it as "image_original".

// Default configuration
$config['wysiwyg_toolbar'] = array('mojo_save', '-', 'Maximize', '-', 'Bold', 'Italic', 'BulletedList', 'NumberedList', '-', 'Link', 'Unlink', 'Image', 'Format', 'mojo_cancel');


// Default configuration, with the addition of the 'Source' tool, for manually editing HTML source code.
// $config['wysiwyg_toolbar'] = array('Source', '-', 'Bold', 'Italic', 'BulletedList', 'NumberedList', '-', 'Link', 'Unlink', 'Image', 'Format');


// This toolbar has lots of options enabled
// $config['wysiwyg_toolbar'] = array('Source','-','Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', '-', 'Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat','-','Bold','Italic','Underline','Strike', '-','Subscript','Superscript','NumberedList','BulletedList','-','Outdent','Indent','Blockquote' ,'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','Link','Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','/','-','Styles','Format','Font','FontSize','TextColor','BGColor','Maximize', 'ShowBlocks');


// This toolbar has every possible option enabled
// $config['wysiwyg_toolbar'] = array('Source','-','NewPage','Preview','-','Templates','Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker','Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat','Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField','/','Bold','Italic','Underline','Strike','-','Subscript','Superscript','NumberedList','BulletedList','-','Outdent','Indent','Blockquote','CreateDiv','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','Link','Unlink','Anchor','Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','/','Styles','Format','Font','FontSize','TextColor','BGColor','Maximize', 'ShowBlocks','-','About');


/* End of file ckeditor.php */
/* Location: system/mojomotor/config/ckeditor.php */