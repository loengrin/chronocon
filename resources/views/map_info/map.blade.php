@extends('layouts.popup',['title'=>$chronomap->name, 'withLink'=>'with-link'])
@section('popup-content')
<div>
    <img class="map-info-image" src="/uploads/{{ $chronomap->image }}">
    <div>{!! $article ? $article : trans('messages.No description')!!}</div>
    
</div>


<div class='b-save-button' onclick="location.href='{{$chronomap->getMapLink()}}'">
        <a href='{{$chronomap->getMapLink()}}'>{{ trans('messages.View map')}}</a>
</div>

@endsection

