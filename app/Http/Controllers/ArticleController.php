<?php

namespace App\Http\Controllers;

use \App\Models\ArticleValue;

use Illuminate\Http\Request;

/**
 * Class ArticleController
 * @package App\Http\Controllers
 */
class ArticleController extends Controller
{
    /**
     * @param string $articleId
     * @return \Illuminate\Http\Response
     */
    public function get($articleId)
    {
        $value = ArticleValue::getArticle($articleId);
        return response()->json(['result'=>'SUCCESS','article'=>$value]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function set(Request $request)
    {
        $article = $request->json()->get('article');
        if(!$article){
            return response()->json(['result'=>'SUCCESS','articleId'=>null]);
        }
        $articleId = ArticleValue::createArticle($article);
        return response()->json(['result'=>'SUCCESS','articleId'=>$articleId]);
    }
}
