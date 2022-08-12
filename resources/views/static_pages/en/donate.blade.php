@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
The Chronocon project is non-commercial. There is no advertising and paid content.
<br><br>
You can help the Project. It will make me more enthusiastic.
<br><br>
USD: 
<br>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick" />
<input type="hidden" name="hosted_button_id" value="K7WWPAX7SMF4Q" />
<input type="image" src="https://www.paypalobjects.com/en_US/RU/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_RU/i/scr/pixel.gif" width="1" height="1" />
</form>
<br><br>
EUR: 
<br>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick" />
<input type="hidden" name="hosted_button_id" value="9RGZC55R749KE" />
<input type="image" src="https://www.paypalobjects.com/en_US/RU/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_RU/i/scr/pixel.gif" width="1" height="1" />
</form>

@endsection
