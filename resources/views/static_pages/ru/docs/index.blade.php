@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
    <h1>{{trans('messages.Index')}}</h1>
    <ol>
        @foreach($docPages as $number=>$label)
            <li class='b-main-menu__link'>
                <a href='/{{$lang}}/docs/{{$number}}'>{{trans('messages.'.$label)}}</a>
            </li>
        @endforeach
    </ol>
@endsection
