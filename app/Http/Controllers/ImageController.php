<?php   

namespace App\Http\Controllers;

use App\Services\ImageService;

use Illuminate\Http\Request;

/**
 * Class ImageController
 * @package App\Http\Controllers
 */
class ImageController extends Controller
{
    /**
     * @param string$type
     * @param ImageService $imageService
     * @return \Illuminate\Http\Response
     */
    public function getDefaultIcons(string $type, ImageService $imageService)
    {
        $icons = $imageService->getDefaultIcons($type);
        return response()->json($icons);
    }

    /**
     * @param Request $request
     * @param string $type
     * @param ImageService $imageService
     * @return \Illuminate\Http\Response
     */
    public function saveImage(Request $request,string $type, ImageService $imageService)
    {
        $response = $imageService->saveImage($request->file('fileToUpload'), $type);
        return response()->json($response) ->withHeaders(['Content-Type' => 'text/html']);
    }

    /**
     * @param string $image
     * @param ImageService $imageService
     * @return \Illuminate\Http\Response
     */
    public function rotateImage(string $image, ImageService $imageService)
    {
        $response = $imageService->rotateIcon($image);
        return response()->json($response);
    }
           
}
