@extends('../layouts.app')

@section('content')
    @if(isset($object['value']['image']))
      <img class="b-object-image" src="/uploads/{{$object['value']['image'] }}" alt="{{$object['value']['name']}}" title="{{$object['value']['name']}}" />
    @endif
    <p>{{ trans('messages.Object of chronomap')}} <a href='/{{$lang}}/sitemap/id/{{$chronomapId}}'>{{$chronomapName}}</a></p>
    <h4><a href='/{{$lang}}/id/{{$chronomapId}}#{{($object['type']=='event' ? 'loadEventId=' : 'loadUnitId=').$objectId }}'>
     {{ trans('messages.Watch on map')}}
    </a></h4>
    <p>{!!  strip_tags($article, '<br>');  !!}</p>
@endsection

