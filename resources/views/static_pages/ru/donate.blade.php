@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
Проект некоммерческий, делается на энтузиазме. Основные расходы - хостинг и иногда реклама.
<br><br>
<iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/donate.xml?account=410011849949203&quickpay=donate&payment-type-choice=on&mobile-payment-type-choice=on&default-sum=500&targets=%D0%9D%D0%B0+%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5+%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0&project-name=%D0%A5%D1%80%D0%BE%D0%BD%D0%BE%D0%BA%D0%BE%D0%BD&project-site=chronocon.org&button-text=05&successURL=chronocon.org" width="508" height="91"></iframe>
@endsection
