@extends('../layouts.app')

@section('content')
    @foreach($object_types as $object_type=>$label)
      @if(isset($objects[$object_type]))
        <h4 style='margin: 5px 0'>{{ trans('messages.'.$label)}}:</h4>
        <ul style='margin: 5px 0'>
        @foreach($objects[$object_type] as $object)
          <li><a href='/{{$lang}}/sitemap/id/{{$chronomapId}}/object/{{$object['timeObjectId'] }}'>{{ $object['value']['name'] }}</a></li>
        @endforeach
      </ul>
      @endif
  @endforeach
@endsection