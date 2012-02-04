<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
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

/**
 * Refresh String
 *
 * After an action has occurred inside MojoMotor that requires a page refresh
 * (for example, a layout change), this helper function just generates the
 * image and text that offers the user a chance to refresh the page.
 *
 * @access	public
 * @return	string
 */
function refresh_string()
{
	$CI =& get_instance();
	return ' <img class="mojo_page_refresh_trigger" src="'.site_url('assets/img/arrow_refresh_small.png').'" width="16" height="16" alt="'.$CI->lang->line('refresh').'" />';
}

// ------------------------------------------------------------------------

/**
 * Build Page List
 *
 * Used to construct the pages menu in the Mojo bar
 *
 * @access	public
 * @param	array
 * @param	array
 * @param	array
 * @param	integer
 * @return	string
 */
function build_page_list($pages, $attributes = array('id'=>'mojo_site_structure', 'class'=>'mojo_sub_structure'), $depth = 0)
{
	$CI =& get_instance();

	// Get Page names
	$page_names = $CI->page_model->get_all_pages();

	// Get page hidden status, include_in_page_list_y or include_in_page_list_n
	$page_status = $CI->page_model->get_page_list_status();

	$out = '';

	// If pages weren't submitted there's nothing to do...
	if ( ! is_array($pages))
	{
		return $pages;
	}

	// Set the indentation based on the depth
	$out .= str_repeat(" ", $depth);

	// Were any attributes submitted?  If so generate a string
	if (is_array($attributes))
	{
		$atts = '';
		foreach ($attributes as $att => $val)
		{
			$atts .= ' '.$att.'="'.$val.'"';
		}
		$attributes = $atts;
	}

	// Write the opening list tag
	$out .= "<ul".$attributes.">\n";

	$count = 1;

	// Cycle through the list elements.  If an array is
	// encountered we will recursively call build_page_list()
	foreach ($pages as $key => $page)
	{
		$page_id = (is_array($page)) ? $key : $page;

		if ( ! isset($page_names[$page_id]))
		{
			continue;
		}

		$out .= str_repeat(" ", $depth + 2);

		if($count == 1 && $depth == 0)
		{
			$out .= '<li id="mojo_first_drop_target"><div class="mojo_site_structure_placeholder"></div></li>';
			$count++;
		}

		if ($page_status[$page_id] == 'n')
		{
			$class = 'class="mojo_page_hidden" ';
		}
		else
		{
			$class = '';
		}

		$out .= '<li '.$class.'id="mojo_page_delete_'.$page_id.'">';

		$out .= '<div class="ie_fix">';

		$out .= $page_names[$page_id];

		$out .= '<div class="mojo_page_edit_delete">';

		// If the page is hidden, there are different styles and icons
		if ($page_status[$page_id] == 'n')
		{
			$out .= anchor('pages/edit/'.$page_id, '<img src="'.site_url('assets/img').'/page_edit_hidden.png" alt="'.$CI->lang->line('page_edit').'" height="29" width="23" />', 'class="mojo_sub_page" title="'.$CI->lang->line('page_edit').'"');
			$out .= '&nbsp;';
			$out .= anchor('pages/delete/'.$page_id, '<img src="'.site_url('assets/img').'/page_delete_hidden.png" alt="'.$CI->lang->line('page_delete').'" height="29" width="23" />', 'class="mojo_page_delete" title="'.str_replace('%', $page_names[$page_id], $CI->lang->line('delete_confirm')).'"');
		}
		else
		{
			$out .= anchor('pages/edit/'.$page_id, '<img src="'.site_url('assets/img').'/page_edit.png" alt="'.$CI->lang->line('page_edit').'" height="29" width="23" />', 'class="mojo_sub_page" title="'.$CI->lang->line('page_edit').'"');
			$out .= '&nbsp;';
			$out .= anchor('pages/delete/'.$page_id, '<img src="'.site_url('assets/img').'/page_delete.png" alt="'.$CI->lang->line('page_delete').'" height="29" width="23" />', 'class="mojo_page_delete" title="'.str_replace('%', $page_names[$page_id], $CI->lang->line('delete_confirm')).'"');
		}

		$out .= anchor($CI->page_model->get_page($page_id)->url_title, $CI->lang->line('visit_page'), 'class="mojo_page_link_inline" title="'.$CI->lang->line('link').'"');

		$out .= anchor('pages/add/', $CI->lang->line('page_add'), 'class="mojo_sub_page mojo_add_page_inline" title="'.$CI->lang->line('page_add').'"');

		$out .= '</div>';
		$out .= '</div>'; // close ie_fix div

		// droppable target. Its better to create it here vs inserting it via js.
		// I've found the results much more predictable, and the cycles not being
		// used by js seem to help.
		$out .= '<div class="mojo_site_structure_placeholder"></div>';

		if (is_array($page))
		{
			$out .= "\n".build_page_list($page, array('class'=>'mojo_sub_structure'), $depth + 4);
			$out .= str_repeat(" ", $depth + 2);
		}

		$out .= "</li>\n";
	}

	// Set the indentation for the closing tag
	$out .= str_repeat(" ", $depth);

	// Write the closing list tag
	$out .= "</ul>\n";

	return $out;
}

// ------------------------------------------------------------------------

/**
 * Parser Page List
 *
 * Used to construct the output for the parser tag
 * {mojo:site:page_list}
 *
 * @access	public
 * @param	array
 * @param	array
 * @param	int
 * @param	string
 */
function parser_page_list($pages, $attributes = array(), $depth = 0)
{
	$CI =& get_instance();

	// If pages weren't submitted there's nothing to do...
	if ( ! is_array($pages))
	{
		// no sub pages, just get out
		return;
	}

	// Fetch the page names and url_titles
	if ( ! $page_info = $CI->page_model->get_all_pages_info())
	{
		return $pages;
	}

	// The first time through, run through the $pages array 
	// and knock out Child pages that don't belong there.
	// This is up here, because an empty <ul></ul> will be 
	// present if we don't do it before the next lines.
	if ($depth === 0)
	{
		foreach ($pages as $k => $v)
		{
			if (is_array($v))
			{
				foreach ($v as $val)
				{
					if ( ! is_array($val) && ! array_key_exists($val, $page_info))
					{
						unset($pages[$k][$val]);

						if ( empty($pages[$k]))
						{
							$pages[$k] = (string) $k;
						}
					}
				}
			}
		}
	}

	$out = '';

	// Set the indentation based on the depth
	$out .= str_repeat(" ", $depth);

	$atts = '';

	// Were any attributes submitted?  If so generate a string
	if (is_array($attributes))
	{
		foreach ($attributes as $att => $val)
		{
			$atts .= ' '.$att.'="'.$val.'"';

			// We only want id applied to the top level list, so we'll unset it here so children
			// don't inherit it. I wish I could have done with the big nose on my mothers side...
			if ($att == 'id')
			{
				unset($attributes[$att]);
			}
		}
	}

	$defaults = $CI->page_model->get_page($CI->site_model->get_setting('default_page'));

	$default_page = ($defaults) ? $defaults->url_title : '';
	
	// Write the opening list tag
	$out .= "<ul".$atts.">\n";

	// Before we loop through pages, we need to see if they've specified a "Start" page.

	// Cycle through the list elements.  If an array is
	// encountered we will recursively call build_page_list()
	$current_uri = trim($CI->uri->uri_string, '/');
	
	foreach ($pages as $key => $page)
	{
		$page_id = (is_array($page)) ? $key : $page;

		if ( ! isset($page_info[$page_id]))
		{
			continue;
		}

		// As of 1.1.0 we allow any URI, so convert any forward slashes to
		// underscores to ensure valid (X)HTML id's are generated
		$url_title = str_replace('/', '_', $page_info[$page_id]['url_title']);

		// Active page class?
		if (($current_uri == '' && $page_info[$page_id]['url_title'] == $default_page) OR
			$page_info[$page_id]['url_title'] == $current_uri)
		{
			$active_class = ' class="mojo_active"';
		}
		else
		{
			$active_class = '';
		}

		$out .= str_repeat(" ", $depth + 2);
		$out .= '<li id="mojo_page_list_'.$url_title.'"'.$active_class.'>';

		if ($page_info[$page_id]['url_title'] == $default_page)
		{
			$out .= anchor('', $page_info[$page_id]['page_title']);
		}
		else
		{
			$out .= anchor($page_info[$page_id]['url_title'], $page_info[$page_id]['page_title']);
		}

		if (is_array($page))
		{
			$out .= "\n".parser_page_list($page, $attributes, $depth + 4);
			$out .= str_repeat(" ", $depth + 2);
		}

		$out .= "</li>\n";
	}

	// Set the indentation for the closing tag
	$out .= str_repeat(" ", $depth);

	// Write the closing list tag
	$out .= "</ul>\n";

	return $out;
}


/* End of file page_helper.php */
/* Location: ./system/mojomotor/helpers/page_helper.php */