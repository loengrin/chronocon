@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
  

There are 4 kind of objects: fixed units, movable unit, region and line
<ul>
<li>Fixed unit. Used for cities and battles, Showed as an icon on map.</li>
<li>Movable unit. Usually used for armies. Showed as an icon that move on map on a defined path.</li>
<li>Region. Usually used for countries, provinces.</li>
<li>Line. Usually used for rivers, roads, railroads, fronts.</li>
</ul>
You can add objects with a bottom panel on edit mode. 
<img width="100%" src="/img/doc_en/doc3screen1.png"/><br>
If you press one of the those buttons windows with object parameters will be shown.

<h2>General parameters:</h2>
Parameters which are common for all object types:
<ul>
<li>Name of object</li>
<li>Time frame then object will be visible on the map. It needs to specify first and last dates of object lifetime.</li>
<li>The minimum and maximum scale at which the object will be visible on the map. It can be in the range from 1 to 24. This setting is useful because it would be desirable that some of the objects (such as small towns) were not visible on a small scale. This option allow to avoid  overloading of the map. Objects appear when the map is get closer and became of minimum  scale. You can see current scale on the bottom  edit panel.</li>
<li>Show labels. It is also option to avoid overloading of the map. You could hide names of small or minor objects with this checkbox. Labels anyway would be visible when user hover the mouse over the object.</li>
</ul>

For region and line you can specify:
<ul>
<li>Width. For region it means width of the borders.</li>
<li>Color</li>
<li>Transparency. 0% means that object is absolutely transparent, 100% means that object is absolutely opaque.</li>
<li>The order of the overlay. If objects are overlap, the object with a large order placed over the object with a smaller order.</li>
</ul>

You can specify icon for fixed unit and movable unit. Object will be marked on map with this icon. It is possible to choose it from preset list or upload you image.
In order to change parameters of existed object you can use menu which open after mouse right button click.

<img width="100%" src="/img/doc_en/doc3screen2.png"/><br>
<h2>Dynamic parameters:</h2>
Some parameters should be changed during events of the map time frame. The mechanism for working with all those parameters is the same. I'll tell you the example of the region's borders. The region is typically used for making territory of the states. But it is changing over time. For example we have the region with lifetime from 1900 year to 1910 year the map with time step of 1 year. In 1900 year our region has some borders:
<img width="100%" src="/img/doc_en/doc3screen3.png"/><br>
but in 1905 it got other borders. In this case we should go to the 1905 year, press mouse right button and choose “New territory” in menu.
<img width="100%" src="/img/doc_en/doc3screen4.png"/><br>
After that we get two independent territories for this object. First one will show in 1900-1904 and second one in 1905-1910. Now you can edit them separately. You can move to 1900 and edit the first one then move to 1905 and edit the second one.
<img width="100%" src="/img/doc_en/doc3screen5.png"/><br>
If territory need to be changed again in 1908 year again, you should go to 1908 and press “New territory”. it will be 3 territories in periods of 1900-1904, 1905-1907, 1908-1910. You also can remove each territory (except first one). In this case previous territory will be shown except of removed one.
Also dynamic parameters are color of lines and regions and icon of fixed and movable units. You can specify color with menu items “New color”, “Edit current color”, “Remove color”, and icon with menu items  “New icon”, “Edit current icon”, “Remove icon”

<h2>Object description:</h2>
<img width="100%" src="/img/doc_en/doc3screen6.png"/><br>
When you click on an object, a object description window opens. It consists of four parts.
<ul>
<li>Table.  Table shows when you hover over the object and also in description window. It can contains any parameters of object, for example population of city, religion, name of ruler.</li>
<li>Current table. Some fields of the table may change over time, for example, “ruler”. Such fields can be placed in a dynamic table. Changes are configured in the same way as changing the territory of the region described above. To do this, use the icons ‘New table’, ‘Current table’, ‘Delete current table’ near the header “Current table”. When you hover over the object on the map, the combined table will show.</li>
<li>Object description. Text about the object. One image can be added. </li>
<li>Current events. Similarly to the table, you can fill in the dynamic part of the description, which will depend on the current date.</li>
</ul>
Each of these parts can be edited by clicking on the pencil icon near the title.

<img width="100%" src="/img/doc_en/doc3screen7.png"/><br>
<img width="100%" src="/img/doc_en/doc3screen8.png"/><br>

When you fill in the tables, sometimes it is necessary to copy the names of the parameters, which are the same for all objects (for example 'Form of Government', 'Ruler', 'Dynasty', 'Religion', ' Current position' for the states).
To speed up this work we made table templates. You can customize the template once and apply it on the table editing page. Templates are edited by reference in the editing panel. 

<h2>Editor information</h2>
For each object, you can fill in editor information- “sources”, “comment”, ”progress”, “need help”. These fields are not displayed in the view mode, they are necessary for the exchange of information between map editors.
<img width="100%" src="/img/doc_en/doc3screen9.png"/><br>

@include('static_pages/en/docs/navigation',['pageNumber'=>$pageNumber, 'countPages'=>count($docPages)])

@endsection

