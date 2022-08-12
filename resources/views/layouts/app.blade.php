<!DOCTYPE html>
<html lang="{{$lang}}">   
  <head>
  <meta charset="utf-8"> 
    
  <link href="/css/index_page.css?v=2" rel="stylesheet" type="text/css"/>    
  @if ($isMobile)
        <link href="/css/index_page_mobile.css?v=2" rel="stylesheet" type="text/css"/> 
  @endif
  
  <link href="/css/main.css?v=2" rel="stylesheet" type="text/css"/>    
  <meta name="description" content="{{ trans('messages.Free inreractive historical map editor, world history visualization.')}}">
  <meta name="keywords" content="{{ trans('messages.historical maps,historical context,map editor,history on the map')}}">
  <title>{{ $title && !isset($empty_title) ? $title.' - ' : ''}}{{ trans('messages.Chronocon - History on the map')}}</title>
  <meta property="og:title" content="{{ trans('messages.Chronocon - History on the map')}}"/>
  <meta property="og:description" content="{{ trans('messages.Free inreractive historical map editor, world history visualization.')}}"/>
  <meta property="og:image" content="https://chronocon.org/img/en_chronocon.png"/>
  <meta name="viewport" content="width=device-width, initial-scale=0.7">
  @if(isset($hreflangs))
    @foreach($hreflangs as $hrLang=>$hreflang)
       
        <link rel="alternate" href="https://chronocon.org{{$hreflang}}" hreflang="{{$hrLang}}" />
    @endforeach
  @endif
  <meta name="yandex-verification" content="84d93bf01e496c61" /> 
  </head>
  <body class='b-index-page'>
  <div class="b-logo"><img src='/img/new/logo_{{$lang}}.png'/></div>
  <div class="b-main-menu-wrapper">
    <div className="b-main-menu-area"> 
    <div class="b-main-menu-popup" style="{{$isMobile ? 'display:none' : ''}}">
          @include('headers.menu')
    </div>
    </div>
  </div>
  <div class='b-popup-area-wrapper'></div>

 
  @yield('content')


  <script type="text/javascript">
      module = {};
  </script>


  <script type="text/javascript">
      window.ToJS = {
          labels:{!! json_encode($labels, JSON_FORCE_OBJECT) !!},
          lang: '{{$lang}}',
          isMobile: {{$isMobile ? 1 : 0}},
          hreflangs:{!! isset($hreflangs) ? json_encode($hreflangs, JSON_FORCE_OBJECT): '' !!},
      }
  </script>
  <script src="https://ulogin.ru/js/ulogin.js"></script>
  <script type="text/javascript" src="/main.js?v=3"></script>

@include('headers/counter')
</body>
</html>
