@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
    
In this part I will describe the first step of map creation - general settings. I describe how to create an empty map, how to create copy of existed map and how you can import particular objects from other map to your map.
You can create map in two ways - from scratch or as a copy of existed map. Creating of maps is a quite difficult process and I’m trying to simplify it as much as possible.

Copying of existed map can be useful in following cases:
<ul>
    <li>When you going to make another version of existed map with other descriptions. Take a look for events from a different perspective, maybe change some objects. Changing of copy usually more easy than creating from scratch.</li>
    <li>When you going to make map of other events of close time interval. For example after the map “Russia Civil war(1917-1922)” I’m going to make the map “First World War(1914-1918)”. Most of objects(cities, countries, railroads) would the same. It is no need to put them one map one more time, I can make a copy of map about Russia Civil was, delete  redundant objects, put new ones and save the map with another name.</li>
    <li>When you want to understand  how to work with map. You can do anything you want with your copy.</li>
</ul>
    Besides, you can copy particular objects from one map to another. For example rivers and mountains not changed so much during the human history (although there are exceptions). 
I do not want to put them again on each map. They can be imported from another map. Below I'll show you how.

<h2>Creating of new map</h2>
At first I will describe how create map from scratch.
  <img width="100%" src="/img/doc_en/doc2screen1.png"/><br>
  
In order to make an empty map you should click on button “Create map” 
on the main page and fill the fields
<ul>
<li>Name of map.</li>
<li>Description and image for the list on the main page. Your map don’t shows in the list on the main page until you enable checkbox “Published” in settings(I will write about it below).</li>
<li>Time step and time frame (begin date and end date) of the map. Time on map is discrete. You can choose day, month, year, decade or age as a time step. It depend on how many details you want to show. Time step is common to whole map, you can’t make different parts of a map with different time steps in current realisation. Inspire of any other parameters you can’t change time step after creation of map.</li>
<li>Map type - ‘satellite’ or ‘map’. ‘Satellite’ more appropriate for historical events, ‘Map’ can be more appropriate for modern events. User can change those two types at anytime he want (with buttons in top right corner of the map)</li>
<li>Unknown area. If mankind haven’t  discovered whole planet yet in time of your map, you can turn on setting ‘Unknown area’. In this case part of he map will be hided by black area. In the middle of dark are will be window and you will be able to specify its borders. This window can change during the events of map (you can see map about Columbus discoveries as the example).
User will be able to disable black area (by button in bottom right corner).</li>
<li>Editors. If you want to fill the map with other people, enter logins of those people in this field. Use comma as a delimiter. They will be able to see your map on page  “My Map".</li>
</ul>

After you fill those setting system ask you for login or registration if you are not authorized. Link on your new map will be shown in page “My maps. You will be able to change all settings(except time step) on page "Map settings”.
<img width="100%" src="/img/doc_en/doc2screen2.png"/><br>
Also you can change additional settings in  "Map settings" page:
<ul>
<li>“Published”. When you enable this setting map will be shown on the main page and everybody will be able to see it.</li>
<li>“Open editing”. If you enable this setting every authorised user will be able to change your map. If it disabled only editors can edit the map. But anyway history of changes will be saved and it will be possible to revert to previous versions. Also only editors can delete map, change map rights and revert versions.</li>
</ul>


<h2>Copying of map</h2>
Now I will explain how to copy maps.
It needs to:
<ol>
<li>Open the map that you want to copy</li>
<li>Enter to the edit mode (click on button ‘edit’ on the right bottom corner)</li>
<li>Press the icon ‘Save copy’ in the bottom panel.</li>
<li>Sign in or register if you are unauthorised.</li>
<li>Fill the name of your new map and press ‘Save’ button.</li>
</ol>
New independent map will be created. Only you allowed to  edit this new map, but you could change rights in “Map settings”

<img width="100%" src="/img/doc_en/doc2screen3.png"/><br>

<h2>Objects import</h2>
You could copy particular objects form other maps with “Objects import”. It is useful because you no need to create the same objects each time. To do that you need:
<ol>
<li>Open your map</li>
<li>Enter to the edit mode (click on button ‘edit’ on the right bottom corner)</li>
<li>Press the icon ‘Import objects’ in the bottom panel.</li>
<li>Choose one of the other maps and press she button ‘Show’</li>
<li>Choose necessary objects with checkboxes and press the button ‘Add’ below the list.</li>
<li>Copies of the objects will be added on your map. Don’t forger save your map on server after those operations.</li>
</ol>    
    <img width="100%" src="/img/doc_en/doc2screen4.png"/><br>
    
    @include('static_pages/en/docs/navigation',['pageNumber'=>$pageNumber, 'countPages'=>count($docPages)])
@endsection