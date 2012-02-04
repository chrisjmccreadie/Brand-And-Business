<?php if (!defined('BASEPATH')) exit('No direct script access allowed');
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
 * Site Parser
 *
 * Handles all MojoMotor tags that begin {mojo:site:...}
 *
 * @package		MojoMotor
 * @subpackage	Libraries
 * @category	Parser
 * @author		EllisLab Dev Team
 * @link		http://mojomotor.com
 */
class Mojomotor_parser_site extends CI_Driver {

	private $CI;

	/**
	 * Constructor
	 *
	 * @return	void
	 */
	public function __construct()
	{
		$this->CI =& get_instance();
		$this->CI->load->model(array('site_model'));
	}

	// --------------------------------------------------------------------

	/**
	 * Site Name
	 *
	 * Returns the site name
	 *
	 * @return	string
	 */
	public function site_name()
	{
		return $this->CI->site_model->get_setting('site_name');
	}

	// --------------------------------------------------------------------

	/**
	 * Site Name
	 *
	 * Returns the site name
	 *
	 * @return	string
	 */
	public function site_url()
	{
		return base_url();
	}

	// --------------------------------------------------------------------

	/**
	 * Site Path
	 *
	 * Returns the site path
	 *
	 * @return	string
	 */
	public function site_path()
	{
		return trim($this->CI->site_model->get_setting('site_path'), '/').'/';
	}

	// --------------------------------------------------------------------

	/**
	 * Link
	 *
	 * Creates a link within the MojoMotor URL structure
	 *
	 * @param	array
	 * @return	string
	 */
	public function link($tag)
	{
		$page = '';

		if (isset($tag['parameters']['page']))
		{
			$page = $tag['parameters']['page'];
		}

		return site_url($page).'/';
	}

	// --------------------------------------------------------------------

	/**
	 * Login
	 *
	 * Generates an in-page login form to be revealed dynamically
	 *
	 * @param	array
	 * @return	string
	 */
	public function login($tag)
	{
		// They only get the form if (i) in_page_login pref is set, (i++) they
		// aren't already logged in
		if ($this->CI->site_model->get_setting('in_page_login') != 'y' OR $this->CI->session->userdata('group_id'))
		{
			return '';
		}

		$login_text = isset($tag['parameters']['text']) ? $tag['parameters']['text'] : $this->CI->lang->line('login');

		return anchor('login', $login_text, 'class="mojo_activate_login"');
	}

	// --------------------------------------------------------------------

	/**
	 * Page list
	 *
	 * Creates an unordered list of all pages in the site that haven't been
	 * opted out of appearing in the page_list.
	 *
	 * @param	array
	 * @return	string
	 */
	public function page_list($tag)
	{
		$this->CI->load->helper(array('page', 'array'));
		$this->CI->load->model(array('page_model'));

		// Get the site structure
		$site_structure = $this->CI->site_model->get_setting('site_structure');

		$attributes = array();

		// Gather up parameters
		foreach (array('class', 'id') as $param)
		{
			if (isset($tag['parameters'][$param]))
			{
				$attributes[$param] = trim($tag['parameters'][$param]);
			}
		}

		// If there is a secific page requested, then we'll start there
		// otherwise, start from the homepage.
		if (isset($tag['parameters']['page']))
		{
			$page_id = 0;

			if ($page = $this->CI->page_model->get_page_by_url_title($tag['parameters']['page']))
			{
				$page_id = $page->id;
			}

			$site_structure = array_find_element_by_key($page_id, $site_structure);
		}

		return parser_page_list($site_structure, $attributes);
	}

}

/* End of file Mojomotor_parser_site.php */
/* Location: system/mojomotor/libraries/Mojomotor_parser/Mojomotor_parser_site.php */