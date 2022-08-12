@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
   
In this part I will explain how to set up objects on the map. To start editing the position of an object, select it by mouse clicking in edit mode. If you can not find the object on the map, you can use the search by objects.
<img width="100%" src="/img/doc_en/doc4screen1.png"/><br>
<h2>Fixed unit</h2>
A fixed unit is simply dragged over the map. Current coordinates of the icon are displayed on the bottom panel.
<img width="100%" src="/img/doc_en/doc4screen2.png"/><br>
Often It is convenient in the editing mode to switch the map from the satellite mode to the map mode with modern borders. Many cities have the same position as now.
<img width="100%" src="/img/doc_en/doc4screen3.png"/><br>
You can also use the search on the map
<img width="100%" src="/img/doc_en/doc4screen4.png"/><br>

<h2>Editing regions and lines</h2>
The borders of the region are configured by dragging the polygon vertices on the map. A region may consist of several polygons. For example, a country may contains islands or exclaves. In order to add more polygons, right-click on any point of the existing polygon (just a point, not on the inner area) and in the opened menu select "add polygon". You can also delete the polygon with this menu. And you can delete a point of a polygon or a line. If you need to delete many points, you can use the hot key “D”. When you click “D” + click on a point with the right mouse button, the point is deleted.
<img width="100%" src="/img/doc_en/doc4screen5.png"/><br>
If the “unknown territory” is enabled in the map settings, then you can edit it similarly to the region. 

<h2>Movable unit</h2>

The trajectory of the moving unit is determined using the line on the map. The line is displayed when the object is selected.
<img width="100%" src="/img/doc_en/doc4screen6.png"/><br>
Points of this line can be attached to dates. This means that on a certain date the object will be located at this point. The first point of the line is always tied to the date the object appeared on the map, the last point, respectively, is tied to the last date at which the object is visible. Suppose we have an army that is displayed from January to October 100 AD. We know that in January she was in the city. We put the first point of the line near the city. We also know that in April, this army besieged the city. So we move to April, put the midpoint of the line opposite the city, right-click on this point and select “attach the point to the date”. If we want the army to move not in a straight line, we edit the line, the army will move uniformly along it. The position of the army at intermediate dates, in this case February and March, will be calculated automatically.
<img width="100%" src="/img/doc_en/doc4screen7.png"/><br>
Further, we know that from June to August the army was besieging another city. We are moving in June. Put a new point near the second city and tie it to June 100 AD. But the army must remain in place until August. We move in August and attach August 100 AD to the same point. If two dates are attached to a point, then the army will stand at this point in the interval between the first and second dates.
<img width="100%" src="/img/doc_en/doc4screen8.png"/><br>
In the same menu you can untie points from the date. We see that at the beginning of the army’s movement in January of 100, the army is in the city and is ugly superimposed on the city. To prevent this from happening, but to have the effect of "exiting" the army from the city, the army can be made invisible at a given point. This is set by clicking the right mouse button on the point of the trajectory and selecting the “Hide at point” menu item. In viewing mode, the army will be hidden, and in edit mode it will be marked as "(Hidden)".
<img width="100%" src="/img/doc_en/doc4screen9.png"/><br>
    
@include('static_pages/en/docs/navigation',['pageNumber'=>$pageNumber, 'countPages'=>count($docPages)])
@endsection
