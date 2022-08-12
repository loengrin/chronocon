<script type="text/template" class="t-article">  
  <span class="b-textpanel-article__title" event_id='<%= eventId %>'><%- title %>  </span> 
  <span class="b-artiсle__edit-buttons" style="display: <%= editMode ? "block" : "none" %>" >
    <button event_id='<%= eventId %>' class="b-button_edit b-button b-edit-event"></button>
    <button event_id='<%= eventId %>' class="b-button_del b-button b-delete-event"></button>
    <button event_id='<%= eventId %>' style="display: <%= editMode ? "inline" : "none" %>" class="b-textpanel__button-set_screen b-button"></button>

    <button event_id='<%= eventId %>' style="display: <%= editMode && allowUp ? "inline" : "none" %>" class="b-textpanel__button-up b-button b-move-event_up"></button>
    <button event_id='<%= eventId %>' style="display: <%= editMode && allowDown ? "inline" : "none" %>;" class="b-textpanel__button-down b-button b-move-event_down"></button>
  </span>
  <div class="b-textpanel-article__text-container"><p style="display:none" class="b-textpanel-article__text" event_id ="<%= eventId %>"></p></div>
</script>

<script type="text/template" class="t-unit-popup">
  <div>

    <img style="display: <%= image ? "inline-block" : "none" %>" class="b-unit-popup__image" src="<%= image %>">
  <div class=': <%= image ? "b-tables-container" : "" %>'>
    <% if(hasDynamicTable || editMode){ %>
      <div class="b-unit-popup-dt"></div>
    <% } %>

     <% if(staticTable || editMode) {%>
      <h3 class="popup_header">{{ trans('messages.Table') }}
       <% if(editMode){ %>
          <img src='/img/edit.png' class='js-edit-table-button' alt='{{ trans('messages.Edit table') }}'>
        <% } %>
      </h3>
        <p><%= staticTable %></p>

     <% } %>
  </div>

    <% if(hasDynamicDescription || editMode){ %>
      <div class="b-unit-popup-dd"></div>
    <% } %> 

                
    <% if(text || editMode) {%>
      <h3 class="popup_header">{{ trans('messages.Description') }}
        <% if(editMode){ %>
          <img src='/img/edit.png' class='js-edit-button' alt='{{ trans('messages.Edit description') }}'>
        <% } %>
      </h3>
       <p><%= text %></p>
    <% } %>

  </div>
</script>

<script type="text/template" class="t-unit-popup-dl">
    <br>
    <h3 class='popup_header'>
      <%= header %>
      (<% _.each(dynamicLinks, function(item){ %>
          <% if(item.image){ %>
              <img src="<%= item.image%>" class="b-button popup-link <%= item.className%>" alt="<%= item.label%>">
          <% }else{ %>
              <span class="b-button popup-link <%= item.className%>"><%= item.label%></span>
          <% } %>
      <% }); %>
    )</h3>

    <p><%= content %></p>
</script>

<script type="text/template" class="t-index-popup">
  <% _.each(index, function(data){ %>
   <span class="b-textpanel__index-date"><%= data["date"] %></span>
    <% _.each(data["events"], function(event){ %>
    <span class="b-index_popup__title" event_id='<%= event.eventId %>'><%- event.title %>  </span><br>
	<% }); %>
  <% }); %>
</script>

<script type="text/template" class="t-import-block">
<div class="b-import-block">
  <div>
    <span class='b-chronomaps-select'></span>
    <span class="b-button js-show_objects">{{ trans('messages.Show') }}</span>
  </div><br>
  <div class='b-chronomaps-objects'></div>
</div>
</script>

<script type="text/template" class="t-import-objects">
<% _.each(objectsByTypes, function(objectsArray, objectsType){ %>
  <h3><%= typeNames[objectsType] %></h3>
  <% _.each(objectsArray, function(chronomapObject){ %>
    <input id="<%= chronomapObject.id %>" type="checkbox">
    <label for="<%= chronomapObject.id %>"><%= chronomapObject.name %></label><br>
  <% }); %>
<% }); %>
<span class="b-button js-import-submit">{{ trans('messages.Add') }}</span>
</script>


<script type="text/template" class="t-saver-block">
<div>
  <input class='js-new-name' style="display: <%= saveAsMode ? "block" : "none" %>;width:35em" value=" <%= newName %>"><br>
  {{ trans('messages.Comment') }}:<br>
  <textarea class='js-user-commit-message' rows="5" cols="60"></textarea><br><br>
  <button class="b-button b-save-button js-saver-submit">{{ trans('messages.Save') }}</button><br>
  {{ trans('messages.Changes') }}:<br>
  <textarea disabled="disabled" rows="15" cols="60" class='js-commit-message'> <%= comment %></textarea>
</div>
</script>

   

<script type="text/template" class="t-versions-block">
<div>
<button class="b-button b-reload-button" style="display: none">{{ trans('messages.Reload page') }}</button><br>
<table class="b-versions">
 <% _.each(versions, function(version){ %>
  <tr>
    <td class="b-versions__version-cell">{{ trans('messages.Version') }} #<%= version.version %></td>
    <td class="b-versions__version-cell"><%= version.created_at.substring(0,16) %></td>
    <td class="b-versions__version-cell"><a class="b-link js-commit-user" opened='0'><%= version.login %></a><span></span></td>
    <td class="b-versions__version-cell"><a class="b-link js-comment">{{ trans('messages.Comment') }}</a></td>
    <td class="b-versions__version-cell"><button class="b-button b-save-button b-load-button" version="<%= version.version %>">{{ trans('messages.Load') }}</button></td>
    <td class="b-versions__version-cell">
      <% if(version.isLastVersion){ %>
        <button class="b-button_del b-button b-del-last-version" title="{{ trans('messages.Delete last version') }}"></button>
      <% } %>
    </td>
  </tr>
  <tr style='display:none' opened='0'><td class="b-versions__version-cell" colspan="5" >
    <%= (versions.user_description ? versions.user_description+"<br>" : "")+version.description.replace(/^\n/g, "").replace(/\n/g, "<br>") %></td></tr>
<% }); %>
</table>
</div>
</script>

<script type="text/template" class="t-event-form">
<div class="b-event-form" is_new="<%= (event.isNew() ? 1 : 0) %>">
  <h3>Описание</h3>
  <table class="show_object_table">
    <tr><td>{{ trans('messages.Title') }}</td><td><input class="b-text-input js-name-field" value="<%= event.getField("name") %>"></td></tr>
    <tr><td>{{ trans('messages.Date') }}</td><td><div class='js-event-date-block'></div></td></tr><tr>
    <tr><td>{{ trans('messages.Description') }}</td><td><textarea class="b-text-input js-description-field"><%= event.getField("description") %></textarea></td></tr>
    <tr><td>{{ trans('messages.Comment on map') }}</td><td><textarea class='js-event-box-text b-event-box-textarea'><%= event.getField("boxText") %></textarea></td></tr>
     <tr><td>{{ trans('messages.Event chains') }}</td><td><div class='js-event-chains-block'></div></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
  <span class="b-error-span js-error"></span>
</div>
</script>

<script type="text/template" class="t-unit-form">
<div class="b-unit-form">
  <h3>Описание</h3>
  <table class="show_object_table">
    <tr><td>{{ trans('messages.Title') }}</td><td><input class="b-text-input js-name-field" value="<%= unit.getField("name") %>"></td></tr>
    <tr><td>{{ trans('messages.Event') }}</td><td class='js-unit-event'></td></tr>
    <tr><td>{{ trans('messages.Begin date') }}</td><td class='js-unit-date-begin'></td></tr><tr>
    <tr><td>{{ trans('messages.End date') }}</td><td class='js-unit-date-end'></td></tr><tr>
    <tr><td>{{ trans('messages.Bind to event') }}</td><td><input class='js-unit-bind-event' type="checkbox" <%= unit.getField("eventId") ? "checked" : "" %>></td></tr>      
    <tr><td>{{ trans('messages.Min scale') }}</td><td class='js-unit-size'></td></tr>
    <tr><td>{{ trans('messages.Max scale') }}</td><td class='js-unit-size-max'></td></tr>    
    <% if((unit.getType() === "region" || unit.getType() === "line")){ %>
      <tr><td>{{ trans('messages.Width') }}</td><td class='js-unit-width'></td></tr>
	<% } %>
    <% if((unit.getType() === "line")){ %>
      <tr><td>{{ trans('messages.Line style') }}</td><td class='js-unit-line_style'></td></tr>
     <% } %>
      <tr><td>{{ trans('messages.Show label') }}</td><td><input class='js-unit-has-label' type="checkbox" <%= unit.getField("staticStyle").hasLabel ? "checked" : "" %>></td></tr>      
   
    <% if(hasZIndex){ %>
      <tr><td>{{ trans('messages.Stacking order') }}</td><td class='js-unit-z-index'></td></tr>
    <% } %> 
    <% if((unit.getType() === "region" || unit.getType() === "line") && isNew){ %>
      <tr><td>{{ trans('messages.Color') }}</td><td><input class='js-unit-color' type="color" value="<%= color %>"></td></tr>
	  <tr><td>{{ trans('messages.Transparent') }}</td><td class='js-unit-transparent'></td></tr>
    <% } %>
  <table>
  <div class='b-editor-table'></div> 
  <% if(selectIcon){ %>
       {{ trans('messages.Select icon') }}<br>
      <div class='b-unit-icon'></div>
  <% } %> 
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
  <span class="b-error-span js-error"></span>
</div>
</script>


<script type="text/template" class="t-unit-menu">
<div class="b-unit-menu">
<% _.each(items, function(item){ %>
  <% if(item.className === "b-unit-menu__delmiter"){ %>
  <span class="b-unit-menu__item <%= item.className%>"></span>
  <% }else{ %> 
  <a class="b-unit-menu__item <%= item.className%>" href="#"><%= item.label%></a>
  <% }; %> 
 <% }); %> 
</div>
</script>


<script type="text/template" class="t-unit-popup-form">
<div class='b-unit-popup-form'>
  <table class="show_object_table">
  <tr><td>{{ trans('messages.Article') }}</td><td><div class='js-unit-article'></div></td></tr>
  <tr><td>{{ trans('messages.Picture') }}</td><td><div class="edit_image_block_div js-unit-image-block"></div></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
  &nbsp;&nbsp;<a href='#' class="b-cancel">{{ trans('messages.Cancel') }}</a>
</div>
</script>

<script type="text/template" class="t-unit-sources-form">
<div class='b-unit-sources-form'>
  <table class="show_object_table">
  <tr><td colspan=3><div class='js-unit-sources'></div></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
</div>
</script>

<script type="text/template" class="t-unit-comments-form">
<div class='b-unit-comments-form'>
  <table class="show_object_table">
  <tr><td colspan=3><div class='js-unit-comments'></div></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
</div>
</script>

<script type="text/template" class="t-unit-editor-form">
<h3>{{ trans('messages.Editor information') }}</h3>
<table class='b-unit-editor-form'>
  <tr><td>{{ trans('messages.Comment') }}</td><td><div class='js-unit-comments'></div></td></tr>
  <tr><td>{{ trans('messages.Sources') }}</td><td><div class='js-unit-sources'></div></td></tr>
  <tr><td>{{ trans('messages.Progress') }}</td><td><div class='js-unit-progress'></div></td></tr>
  <tr><td>{{ trans('messages.Need help') }}</td><td><div class='js-unit-need-help'></div></td></tr>
</table><br>
</script>


<script type="text/template" class="t-unit-dd-popup-form">
<div class='b-unit-dd-popup-form'>
  <table class="show_object_table">
  <tr><td>{{ trans('messages.Article') }}</td><td><div class='js-unit-dd-article'></div></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
  &nbsp;&nbsp;<a href='#' class="b-cancel">{{ trans('messages.Cancel') }}</a>
</div>
</script>

<script type="text/template" class="t-unit-color-form">
<div class='b-unit-color-form'>
  <table class="show_object_table">
  <tr><td>{{ trans('messages.Color') }}</td><td><input type='color' class='js-color-field' value="<%= color%>"></td></tr>
  <tr><td>{{ trans('messages.Transparent') }}</td><td class='js-unit-transparent'></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
</div>
</script>


<script type="text/template" class="t-unit-icon-form">
<div class='b-unit-icon-form'>
  <div class='js-icon-field-block'></div>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
</div>
</script>


<script type="text/template" class="t-unit-coordinates-form">
<div class='b-unit-coordinates-form'>
  <table class="show_object_table">
  <tr><td>{{ trans('messages.Coordinates') }}</td><td><textarea class='b-coordinates-textarea js-unit-coordinates'><%= coordinates%></textarea></td></tr>
  </table>
  <button class="b-button b-save-button js-submit">{{ trans('messages.Save') }}</button>
  <span class="b-error-span js-error"></span>
</div>
</script>

<script type="text/template" class="t-no-right-message">
<div class='t-no-right-message'>
  {{ trans('messages.You have no right to change this map. You can write to info@chronocon.org or ') }}
  <a class='b-copy_link' href='#'> {{ trans('messages.save copy of map') }}</a>
</div>
</script>



<script type="text/template" class="t-objects-popup">
<div class='b-objects-popup'>
    <input class='js-object-search b-object-search' placeholder:"{{ trans('messages.Enter object name') }}"><br>
    <div class='b-objects-list'></div>
</div>
</script>



<script type="text/template" class="t-objects-list">
<br><span>Всего объектов: <%= totalObjects %></span>, <span>Прогресс по объектам: <%= totalProgress.toFixed(2) %> %</span><br>
    <% _.each(objectsByTypes, function(objectsArray, objectsType){ %>
      <h3><%= typeNames[objectsType] %> (<%= objectsArray.length %>):</h3>
      <table>
      <% _.each(objectsArray, function(chronomapObject){ %>
        <tr>
	  <td class='t-objects-list-table-object-name'>
		<span class='b-objects_popup__title js-objects-select-unit' object_id="<%= chronomapObject.getId() %>">
		  <%= chronomapObject.getField('name') %>
		</span><br>
 		<% if(chronomapObject.getField('sources')){ %>
        		<span class='sources_text' style='display:none'>{{ trans('messages.Sources') }}: <%= chronomapObject.getField('sources') %></span><br>
		<% } %> 
	  </td>
	  <td>
           <div style='display:inline-block;height:1em;width:<%= chronomapObject.getField('progress')/100*5 %>em;background-color:<%= chronomapObject.getField('progress') > 60 ? 'green' : (chronomapObject.getField('progress') > 20 ? 'yellow' : 'red')  %>'></div>
<span><%= chronomapObject.getField('progress') ? chronomapObject.getField('progress') : 0 %>%</span>
	  </td>
	<td style='color:red;padding-left:1em'><%= chronomapObject.getField('needHelp') ? '{{ trans('messages.Need help') }}' : '' %></td>
	<tr>
         <% if(chronomapObject.getField('comments')){ %>        
              <tr><td colspan=3><span class='comments_text'>{{ trans('messages.Comments') }}: <%= chronomapObject.getField('comments') %></span></td></tr>
                <% } %>      
      


	 <% }); %>
      </table>
    <% }); %>
</script>


<script type="text/template" class="t-event-popup">
  <div>

    <img style="display: <%= image ? "inline-block" : "none" %>" class="b-unit-popup__image" src="<%= image %>">

    <% if(text || editMode) {%>
      <h3 class="popup_header">{{ trans('messages.Description') }}
        <% if(editMode){ %>
          <img src='/img/edit.png' class='js-edit-event-button' alt='{{ trans('messages.Edit description') }}'>
        <% } %>
      </h3>
       <p><%= text %></p>
    <% } %>

  </div>
</script>
