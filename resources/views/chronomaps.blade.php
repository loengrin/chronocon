@extends('layouts.app')

@section('content')

<div class='page-header {{$isReady ? '' : 'page-header-left'}}'>
    <a href='/{{$lang}}/' class='{{ $isReady ? 'header-active' : ''}}'>{{trans('messages.Chronocons maps')}}</a>
    @if(!$isMobile)
        <a href='/{{$lang}}/users-maps' class='{{ !$isReady ? 'header-active' : ''}}'>{{trans('messages.Users maps')}}</a> 
    @endif
    @if($isMobile)
        <a href='/{{$lang}}/users-maps' class='right-align {{ !$isReady ? 'header-active' : ''}}'>{{trans('messages.Users')}}</a> 
    @endif
</div>
<div class='b-main-block {{ $isReady ? 'b-main-block-thin' : ''}}'>
    <div class='b-main-block-relative'>
    <div class='b-main-block-inner'>
    @foreach($chronomapsByCategories as $chronomapByCategory)
    <div className='b-map-category'>
        @if($chronomapByCategory['category'] !== 'users')
        <img class='b-map-category-img' src='/img/new/category_{{$chronomapByCategory['category']}}.png' />
        <div class='b-map-category-block'>
        <div class='b-map-category-name'>{{trans('messages.'.$chronomapByCategory['label'])}}</div>
        @endif
        <div class='b-map-category-maps'>
        @foreach($chronomapByCategory['maps'] as $chronomap)  
            <div class='b-chronomap-block'>
                <a href='{{$chronomap->getMapLink()}}'><span>{{$chronomap->name}}</span></a><br>
                <a href='{{$chronomap->getMapLink()}}'><img src='/uploads/{{$chronomap->image}}' alt="{{$chronomap->name}}" title="{{$chronomap->name}}"></a>
                    <p>{{$chronomap->description}} 
                        <a class="b-more-button" href='{{$chronomap->getLink()}}'> 
                            {{ $chronomapByCategory['category'] !== 'users' ? trans('messages.More')."..." : '' }}
                        </a>
                    </p>
            </div>
        @endforeach
        </div>
        </div>
    </div>
    @endforeach  
    </div>
    </div>
</div>    
@endsection
