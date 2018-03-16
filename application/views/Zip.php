<?php
// application/controllers/Zip.php
defined('BASEPATH') OR exit('No direct script access allowed');
 
class Zip extends CI_Controller {
    private function _load_zip_lib()
    {
        $this->load->library('zip');
    }
     
    private function _archieve_and_download($filename)
    {
        // create zip file on server
        $this->zip->archive(FCPATH.'/uploads/'.$filename);
         
        // prompt user to download the zip file
        $this->zip->download($filename);
    }
 
    public function data()
    {
        $this->_load_zip_lib();
         
        $this->zip->add_data('name.txt', 'Sajal Soni');
        $this->zip->add_data('profile.txt', 'Web Developer');
         
        $this->_archieve_and_download('my_info.zip');
    }
 
    public function data_array()
    {
        $this->_load_zip_lib();
         
        $files = array(
                'name.txt' => 'Sajal Soni',
                'profile.txt' => 'Web Developer'
        );
         
        $this->zip->add_data($files);
         
        $this->_archieve_and_download('my_info.zip');
    }
 
    public function data_with_subdirs()
    {
        $this->_load_zip_lib();
         
        $this->zip->add_data('info/name.txt', 'Sajal Soni');
        $this->zip->add_data('info/profile.txt', 'Web Developer');
         
        $this->_archieve_and_download('my_info.zip');
    }
 
    public function files()
    {
        $this->_load_zip_lib();
         
        // pass second argument as TRUE if want to preserve dir structure
        $this->zip->read_file(FCPATH.'/uploads/1.jpg');
        $this->zip->read_file(FCPATH.'/uploads/2.jpg');
         
        $this->_archieve_and_download('images.zip');
    }
     
    public function dir()
    {
        $this->_load_zip_lib();
         
        // pass second argument as FALSE if want to ignore preceding directories
        $this->zip->read_dir(FCPATH.'/uploads/images/');
         
        $this->_archieve_and_download('dir_images.zip');
    }
}