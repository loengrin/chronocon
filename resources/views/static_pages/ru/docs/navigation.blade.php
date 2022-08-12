<br><br>
<div style="width: 100%; text-align: center">
    @if ($pageNumber != 1)
        <a href="/{{$lang}}/docs/{{$pageNumber-1}}">Назад</a> |
    @endif
    <a href="/{{$lang}}/docs">Содержание</a>
    @if ($pageNumber != $countPages)
        | <a href="/{{$lang}}/docs/{{$pageNumber+1}}">Вперёд</a>
    @endif
</div>
