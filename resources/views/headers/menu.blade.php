<a href="/{{App::getLocale()}}">{{trans('messages.Maps')}}</a>
<span></span>
<a href="/{{App::getLocale()}}/about">{{trans('messages.About project')}}</a>
<a href="/{{App::getLocale()}}/docs">{{trans('messages.How to create a map')}}</a>
<span></span>
@if(isset($hreflangs))
    @foreach($hreflangs as $lang=>$hreflang)
        @if($lang != App::getLocale())
            <a href="{{$hreflang}}">{{$lang == 'ru' ? 'Russian' : 'English'}}</a>
        @endif
    @endforeach
@endif
