<br><br>
<div style="width: 100%; text-align: center">
    @if ($pageNumber != 1)
        <a href="/{{$lang}}/docs/{{$pageNumber-1}}">Bach</a> |
    @endif
    <a href="/{{$lang}}/docs">Index</a>
    @if ($pageNumber != $countPages)
        | <a href="/{{$lang}}/docs/{{$pageNumber+1}}">Forward</a>
    @endif
</div>
