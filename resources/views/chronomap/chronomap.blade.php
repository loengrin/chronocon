<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Security-Policy" content="default-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src * data: 'unsafe-inline'">
    <link href="/chronocon.min.css?v=2" rel="stylesheet" type="text/css"/> 
    @if ($isMobile)
        <link href="/css/map_mobile.css?v=2" rel="stylesheet" type="text/css"/> 
    @endif
    <meta name="description" content="{{ $description }}">
    <meta property="og:description" content="{{ $description }}"/>
    <meta property="og:title" content="{{$title}} - {{ trans('messages.Interactive map')}}- {{ trans('messages.Chronocon')}}"/>
    <meta property="og:url" content="chronocon.org{{$base_url}}"/>
  
    <meta name="keywords" content="{{ $seo_keywords or trans('messages.historical maps,historical context,map editor,history on the map')}}">
    <title>{{$title}} - {{ trans('messages.Interactive map')}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=0.7">
</head>
<body class="b-page">
<div class="b-page-content">@include('chronomap/popup')</div>
    <script type="text/javascript">
        window.ToJS = {
            labels:{!! json_encode($labels, JSON_FORCE_OBJECT) !!},
            lang: '{{$lang}}',
            mapId: '{{$chronomapId}}',
            mapVersion: '{{$chronomapVersion}}',
            isXXage: '{{$isXXage}}',
            isMobile: {{$isMobile ? 1 : 0}},
            hreflangs:{!! isset($hreflangs) ? json_encode($hreflangs, JSON_FORCE_OBJECT): '' !!}
        }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCw_DEkq28zOKsF_32Xo8g9FZ6qZKUAKmU&sensor=false&libraries=places" type="text/javascript"></script>
    <script src="https://yastatic.net/es5-shims/0.0.2/es5-shims.min.js"></script>
    <script src="https://yastatic.net/share2/share.js"></script>
    @if (!$isXXage)
        <script src="https://ulogin.ru/js/ulogin.js"></script>
    @endif
    <script type="text/javascript" src="/map.js?v=4"></script>
    @if ($env == 'prod')
        @include('headers/counter')
    @endif
</body>
</html>
