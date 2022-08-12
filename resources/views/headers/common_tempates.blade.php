<script src="https://ulogin.ru/js/ulogin.js"></script>
<script type="text/javascript">
    uLoginCallback = function(token){window.uLoginCallback(token);}
</script>
<script type="text/template" class="t-signin-form">
<div class="b-signin-form">
  <table class="show_object_table">
    <tr><td>{{ trans('messages.Login') }}</td><td><input class="b-text-input js-login-field"></td></tr>
    <tr><td>{{ trans('messages.Password') }}</td><td><input class="b-text-input js-password-field" type="password"></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Send') }}</button>
  <span class="b-error-span js-error"></span>

</div>
</script>

<script type="text/template" class="t-register-form">
<div class="b-register-form" is_my_data_form="<%= (myDataMode ? 1 : 0) %>">  
  <table class="show_object_table">
    <tr><td>{{ trans('messages.Login') }}</td><td><% if (myDataMode) { %><%= login %><% }else{ %><input class="b-text-input js-login-field" value="<%= login %>"><% } %></td></tr>
    <tr><td>{{ trans('messages.Your name') }}</td><td><input class="b-text-input js-name-field" value="<%= name %>"></td></tr>
    <tr><td>{{ trans('messages.Password') }}</td><td><input class="b-text-input js-password-field" type="password"></td></tr>
    <tr><td>{{ trans('messages.Password again') }}</td><td><input class="b-text-input js-password-again-field" type="password"></td></tr>
    <tr><td>{{ trans('messages.Email') }}</td><td><input class="b-text-input js-email-field" value="<%= email %>"></td></tr>
    <tr><td>{{ trans('messages.About me') }}</td><td><textarea class="b-descr-textarea js-about-field"><%- about %></textarea></td></tr>
    <tr><td colspan=2>{{ trans('messages.I want to receive e-mail newsletters') }}<input type='checkbox' class="js-is-subscribe-field" <%= (isSubscribe ? "checked" : "") %>></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Send') }}</button>
  <span class="b-error-span js-error"></span>
</div>
</script>

<script type="text/template" class="t-signin-register-table">
<table class="b-login-register-table">
  <tr><td>{{ trans('messages.Signin') }}:</td><td>{{ trans('messages.Registration') }}:</td></tr>
  <tr><td><%= signinForm %></td><td><%= registerForm %></td></tr>
</table>
</script>



<script type="text/template" class="t-chronomap-info-form">
<div class="b-chronomap-info-form">
  <h3>{{ trans('messages.Description') }}</h3>
  <table class="show_object_table">
    <tr><td>{{ trans('messages.Title') }} </td><td><input class="b-text-input js-name-field" value="<%= chronomap.getField("name") %>"></td></tr>
    <tr><td>{{ trans('messages.Description') }}</td><td><textarea class="b-text-input js-description-field" class="b-descr-textarea"><%= chronomap.getField("description") %></textarea></td></tr>
    <tr><td>{{ trans('messages.Picture') }}</td><td><div class='js-chronomap-image-block'></div></td></tr>
	<tr><td>{{ trans('messages.Discuss link') }} </td><td><input class="b-text-input js-discuss-field" value="<%= chronomap.getField("discussHref") %>"></td></tr>
    <tr><td>{{ trans('messages.Language') }}</td><td><div class='js-chronomap-lang-block'></div></td></tr>
  </table>
  <h3>{{ trans('messages.Chronomap settings') }}</h3>
  <table class="show_object_table">
    <tr><td>{{ trans('messages.Time step') }}</td><td><div class='js-chronomap-date-mode-block'></div></td></tr>
    <tr><td>{{ trans('messages.Begin date') }}</td><td><div class='js-chronomap-date-begin-block'></div></td></tr>
    <tr><td>{{ trans('messages.End date') }}</td><td><div class='js-chronomap-date-end-block'></div></td></tr>
    <tr><td>{{ trans('messages.Map type') }}</td><td><div class='js-chronomap-map-type-block'></div></td></tr>
    <tr style="display: none;"><td>{{ trans('messages.Map area file') }}</td><td><div class='js-map-area-image-block'></div></td></tr>
    <tr style="display: none;"><td>{{ trans('messages.Max scale') }}</td><td><div class='js-max-scale-field'></div></td></tr>
    <tr><td>{{ trans('messages.Unknown area') }}</td><td><input type="checkbox" class='js-has-fog-field' <%= (chronomap.getField("hasFog") ? "checked" : "") %>></td></tr>
  </table>

 <h3 <%= isNew ? "style='display: none;'" : "" %>>{{ trans('messages.Introduction') }}</h3>
  <table class="show_object_table" <%= isNew ? "style='display: none;'" : "" %>>
    <tr ><td>{{ trans('messages.Article') }}</td><td><div class='js-chronomap-article'></div></td><tr>
  </table>

  <h3 <%= isNew || isOwner ? "" : "style='display: none;'" %>>{{ trans('messages.Rights') }}</h3>
  <table class="show_object_table" <%= isNew || isOwner ? "" : "style='display: none;'" %>>
    <tr ><td>{{ trans('messages.Editors (comma separated)') }}</td><td><textarea class="b-descr-textarea js-editors-field" style="width: 20em;"><%= chronomap.getField("editors") %></textarea></td><tr>
    <tr <%= isNew ? "style='display: none;'" : "" %>><td>{{ trans('messages.Published') }}</td><td><input class='js-published-field' type="checkbox" <%= (chronomap.getField("published") ? "checked" : "") %>></td></tr>
    <tr <%= isNew ? "style='display: none;'": "" %>><td>{{ trans('messages.Open editing') }}</td><td><input class='js-open-editing-field' type="checkbox" <%= (chronomap.getField("openEditing") ? "checked" : "") %>></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
  <span class="b-error-span js-error"></span>
</div>
</script>

<script type="text/template" class="t-my-maps">
<div class="b-my-maps">
<% _.each(chronomaps, function(chronomap){ %>
  <div class="b-chronomap-block">
    <a href="/<%= chronomap.lang %>/id/<%= chronomap.id %>"><img class="b-chronomap-block__img" src="/uploads/<%= chronomap.image %>"></a>
    <a href="/<%= chronomap.lang %>/id/<%= chronomap.id %>"><span class="b-chronomap-block__name"><%= chronomap.name %></span></a><br>
    <p class="b-chronomap-block__descr"><%= chronomap.description %></p>
    <button class="b-button_del b-button js-del-chronomap" title="{{ trans('messages.Delete chronomap') }}" chronomapId="<%= chronomap.id %>"></button>
  </div>
  <div class="b-map-split"></div>
<% }); %>

</div>
</script>
