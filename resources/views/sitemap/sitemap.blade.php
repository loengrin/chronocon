@extends('../layouts.app')

@section('content')

<h1>{{ trans('messages.Pages')}}</h1>
<ul>  
    @foreach($pages as $sitemapPage=>$page_title)
    <li><a href='{{ strpos($sitemapPage,'http') === false ? '/'.$lang."/".$sitemapPage : $sitemapPage}}'>{{ trans('messages.'.$page_title)}}</a></li>
    @endforeach
</ul>

<h1>{{ trans('messages.Chronomaps')}}</h1>
<ul>
    @foreach($chronomaps as $chronomap)
    <li>
      <a href='{{$chronomap->getLink()}}'>{{$chronomap->name}}</a><br>
      (<a href='/{{$lang}}/sitemap/id/{{$chronomap->id}}'>{{ trans('messages.Map texts')}}</a>)
    </li>
    @endforeach
</ul>
@endsection