
  <!-- VENDOR LIB-->  
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script> 
  <script src="http://maps.googleapis.com/maps/api/js?key={{ config('app.google_api_key') }}&sensor=false&libraries=places" type="text/javascript"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.js"></script>

  <script type="text/javascript" src="/js/libs/vendor/underscore-min.js"></script>
  <script type="text/javascript" src="/js/libs/vendor/jquery.jscrollpane/jquery.mousewheel.js"></script>
  <script type="text/javascript" src="/js/libs/vendor/jquery.jscrollpane/jquery.jscrollpane.min.js"></script>  
  <script src="/js/libs/vendor/ajaxfileupload.js" type="text/javascript"></script>
  <script src="/js/libs/vendor/sha1_generator.js" type="text/javascript"></script>

  <!-- COMMON LIB-->
  <script src="/js/libs/common/common_lib.js" type="text/javascript"></script>
  <script src="/js/server/server.js" type="text/javascript"></script>

  <!-- TIME LIB-->  
  <script src="/js/libs/time/calendar.js" type="text/javascript"></script>
  <script src="/js/libs/time/time.js" type="text/javascript"></script>
  <script src="/js/libs/time/time_index.js" type="text/javascript"></script>
  <script src="/js/libs/time/time_object.js" type="text/javascript"></script>
  <script src="/js/libs/time/time_object_field.js" type="text/javascript"></script>

  <!-- HTML ELEMENTS-->  
  <script src="/js/libs/custom_tags/popups_lib.js" type="text/javascript"></script>
  <script src="/js/libs/custom_tags/date_select.jsx" type="text/babel"></script>
  <script src="/js/libs/custom_tags/image_select.js" type="text/javascript"></script>
  <script src="/js/libs/custom_tags/parameters_table.js" type="text/javascript"></script>
 
  <!-- MAP API LIB--> 
  <script src="/js/libs/map_api/label.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/overlay.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/unit_marker.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/region.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/line.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/army.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/info_box.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/event_arrow.js" type="text/javascript"></script>
  <script src="/js/libs/map_api/map.js" type="text/javascript"></script>
  
  <!-- MAP MODULE--> 
  <script src="/js/map/map_controller.js" type="text/javascript"></script>  
     
  <script src="/js/object_libs/chronomap_lib.js" type="text/javascript"></script>     
  <script src="/js/object_libs/events_lib.js" type="text/javascript"></script>
  <script src="/js/object_libs/units_lib.js" type="text/javascript"></script>


  <!-- STORE-->
  <script src="/js/store/index_store.js" type="text/javascript"></script>
  <script src="/js/store/event_chain_store.js" type="text/javascript"></script>
  <script src="/js/store/event_store.js" type="text/javascript"></script>

  <!-- MAIN--> 
  <script src="/js/modules/panels/popup_area.js" type="text/javascript"></script>
  <script src="/js/modules/panels/message.js" type="text/javascript"></script>
  <script src="/js/modules/panels/timeline.js" type="text/javascript"></script>
  <script src="/js/modules/panels/map_settings.js" type="text/javascript"></script>
  <script src="/js/modules/panels/edit_mode_panel.js" type="text/javascript"></script>
  <script src="/js/modules/panels/search.js" type="text/javascript"></script>
  <script src="/js/modules/panels/unit_menu.js" type="text/javascript"></script>
  <script src="/js/modules/panels/user_menu.js" type="text/javascript"></script>
  
    
  <script src="/js/modules/popups/chronomap_info.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_info.js" type="text/javascript"></script>
  <script src="/js/modules/popups/my_maps.js" type="text/javascript"></script>
  <script src="/js/modules/popups/import.js" type="text/javascript"></script>
  <script src="/js/modules/popups/saver.js" type="text/javascript"></script>
  <script src="/js/modules/popups/chronomap_versions.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_form.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_table.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_info_edit.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_coordinates.js" type="text/javascript"></script>
  <script src="/js/modules/popups/signin_and_register.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_table_templates.js" type="text/javascript"></script>
  <script src="/js/modules/popups/unit_dynamic_description_edit.js" type="text/javascript"></script>
  <script src="/js/modules/popups/sources_edit.js" type="text/javascript"></script>
  <script src="/js/modules/popups/comments_edit.js" type="text/javascript"></script>
  <script src="/js/modules/popups/object_list.js" type="text/javascript"></script>


  <script src="/js/components/events_edit.jsx" type="text/babel"></script>
  <script src="/js/components/event_text_area.jsx" type="text/babel"></script>
  <script src="/js/components/event_index.jsx" type="text/babel"></script>
  <script src="/js/components/chain_edit.jsx" type="text/babel"></script>
  <script src="/js/components/event_edit.jsx" type="text/babel"></script>
  <script src="/js/components/date_navigation_panel.jsx" type="text/babel"></script>

  <!-- CONTROLLERS-->
  <script src="/js/controllers/base_controller.js" type="text/javascript"></script>
  <script src="/js/controllers/index_controller.js" type="text/javascript"></script>
  <script src="/js/controllers/chronomap_controller.js" type="text/javascript"></script>
  <script src="/js/controllers/timer.js" type="text/javascript"></script>
  <script src="/js/controllers/migrations.js" type="text/javascript"></script>
  <script src="/js/controllers/listeners.js" type="text/javascript"></script>
