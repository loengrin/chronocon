<?php

namespace App\Services;

use App\Libs\SimpleImage;

/**
 * Class ImageService
 * @package App\Services
 */
class ImageService
{

    /**
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $type
     * @return array
     */
    public function saveImage(\Illuminate\Http\UploadedFile $file, $type)
    {
        $error = "";
        $msg = "";
        if (!empty($file->getError())) {
            switch ($file->getError()) {
                case '1': $error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
                    break;
                case '2': $error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
                    break;
                case '3': $error = 'The uploaded file was only partially uploaded';
                    break;
                case '4': $error = 'No file was uploaded.';
                    break;
                case '6': $error = 'Missing a temporary folder';
                    break;
                case '7': $error = 'Failed to write file to disk';
                    break;
                case '8': $error = 'File upload stopped by extension';
                    break;
                case '999':
                default: $error = 'No error code avaiable';
            }
        } elseif (empty($file->getPathname()) || $file->getPathname() == 'none') {
            $error = 'No file was uploaded..';
        } else {
            $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
            $filename = sha1(file_get_contents($file->getPathname()));
            $filepath = public_path() . "/uploads/" . $filename . "." . $ext;
            $filepathThumb = public_path() . "/uploads/" . $filename . "_min." . $ext;
            move_uploaded_file($file->getPathname(), $filepath);
            chmod($filepath, 0666);
            @unlink($file->getPathname());
            $msg = $filename . "." . $ext;

            $image = new SimpleImage();
            $image->load($filepath);
          
            if($type == 'unitImage') {
                $image->save($filepath);
                $image->resizeToWidth(400);
                $image->save($filepathThumb);
                $msg = $filename . "_min." . $ext;

            }
            if($type == 'chronomapImage') {
                $image->resizeToWidth(400);
                $image->save($filepath);
            }
                
            
        }

        return [
            'error' => $error,
            'msg' => $msg,
            'width'=>$image ? $image->getWidth() : '',
            'height'=>$image ? $image->getHeight() : ''
        ];
    }

    /**
     * @param string $type
     * @return array
     */
    public function getDefaultIcons($type)
    {
        $icons = array();
        if ($handle = opendir(public_path() . "/uploads/")) {
            while (false !== ($file = readdir($handle))) {
                if (substr($file, 0, 5 + strlen($type)) == '_def_' . $type) {
                    if (strpos($file, '_right') !== false)
                        continue;
                    if (strpos($file, '_left') !== false) {
                        $icons[] = array('left' => $file, 'right' => str_replace('_left', '_right', $file));
                    } else {
                        $icons[] = $file;
                    }
                }
            }
            closedir($handle);
        }
        sort($icons);
        return $icons;
    }

    /**
     * @param string $image
     * @param string|null $out
     * @return array
     */
    public function rotateIcon($image, $out = null)
    {
        if (!$out) {
            $ext = pathinfo($image, PATHINFO_EXTENSION);
            if (strpos($image, '_right'))
                $out = str_replace('_right', '_left', $image);
            else if (strpos($image, '_left'))
                $out = str_replace('_left', '_right', $image);
            else
                $out = str_replace('.' . $ext, '_right.' . $ext, $image);
        }
        $output = array();
        exec('convert -flop ' . public_path()."/uploads/" . $image . " " . public_path()."/uploads/" . $out, $output);
        return array('filename' => $out);
    }

    /**
     * Create tale images for custom map
     *
     * @param string $file
     * @param int$maxScale
     */
    public function createTales($file, $maxScale)
    {
        ini_set('memory_limit', '256M');
        $uploadsDir = public_path()."/uploads";
        $filepath = $uploadsDir . "/" . $file;
        $baseDir = $uploadsDir . "/" . substr($file, 0, strpos($file, '.'));
        if (!file_exists($baseDir)) {
            mkdir($baseDir);
        }
        $image = new SimpleImage();
        $image->load($filepath);

        $width = $image->getWidth();
        $height = $image->getHeight();       
        
        $maxStaleTitleCount = pow(2, $maxScale - 1);
        $maxStaleTileWidth = floor($width / $maxStaleTitleCount);
        $maxStaleTileHeight = floor($height / $maxStaleTitleCount);
        for ($scale = 1; $scale <= $maxScale; $scale++) {
            $currentTileCount = pow(2, $scale - 1);
            $currentTileWidth = $maxStaleTileWidth * $maxStaleTitleCount / $currentTileCount;
            $currentTileHeight = $maxStaleTileHeight * $maxStaleTitleCount / $currentTileCount;
            if (!file_exists($baseDir. "/" . $scale)) {
                mkdir($baseDir . "/" . $scale);
            }
            for ($i = 0; $i < $currentTileCount; $i++) {
                for ($j = 0; $j < $currentTileCount; $j++) {
                    $imageCut = $image->getCopy();

                    $imageCut->cut($i * $currentTileWidth, $j * $currentTileHeight, $currentTileWidth, $currentTileHeight);
                    $imageCut->resize($maxStaleTileWidth, $maxStaleTileHeight);
                    $imageCut->save($baseDir . "/" . $scale . "/" . $i . "_" . $j . ".jpg");
                }
            }
        }
    }
}

?>
