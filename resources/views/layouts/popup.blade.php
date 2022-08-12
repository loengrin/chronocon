@extends($layout ?? 'layouts.app',['custom_layout'=>$customLayout ?? null,'empty_title'=>$emptyTitle ?? null])

@section('content')
<div class='page-header page-header-left page-header-mob-artile'>
    <span class='span-title'>{{$title}}</span>
</div>
<div class='b-main-block'>
    <div class='b-main-block-article'>
        @yield('popup-content')
    </div>
</div>
@endsection

           