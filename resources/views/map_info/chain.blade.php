@extends('layouts.popup',['title'=>$chain['name']])
@section('popup-content')
<div>
    <img class="b-unit-popup__image" src="/uploads/{{ $chain['image'] ?? '' }}">
    <div>{!! $article !!}</div>
 </div>
@endsection