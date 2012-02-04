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
 * Upload Model
 *
 * @package		MojoMotor
 * @subpackage	Models
 * @author		EllisLab Dev Team
 * @link		http://mojomotor.com
 */
class Upload_model extends CI_Model {

	/**
	 * Get Upload
	 *
	 * Returns upload data
	 *
	 * @return	mixed
	 */
	public function get_upload()
	{
		return $this->db->get('upload_prefs');
	}

	// --------------------------------------------------------------------

	/**
	 * Get upload directories
	 *
	 * Lists all upload directories
	 *
	 * @return	array
	 */
	public function get_upload_directories()
	{
		$dirs = $this->db->get('upload_prefs');

		$dir_list = array();

		foreach($dirs->result() as $dir)
		{
			$dir_list[$dir->id] = $dir->name;
		}

		return $dir_list;
	}

	// --------------------------------------------------------------------

	/**
	 * Get files
	 *
	 * Lists all files in any 1 upload directory
	 *
	 * @param	int
	 * @return	mixed	FALSE on fail, array on success
	 */
	public function get_files($upload_dir_id = '')
	{
		$this->db->where('id', $upload_dir_id);
		$dir_info = $this->db->get('upload_prefs');

		$files = array();

		if ($dir_info->num_rows() > 0)
		{
			$this->load->helper('file');

			$files = get_dir_file_info($dir_info->row('server_path'));
		}

		return $files;
	}

}

/* End of file upload_model.php */
/* Location: system/mojomotor/models/upload_model.php */