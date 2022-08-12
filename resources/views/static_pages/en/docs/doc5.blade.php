@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
   
Events make our map not just an interactive map, but “dynamic”.
The transition between events changes the contents of the block in the upper left corner and changes the position of the map.
In the lower left corner you can see the content (a list of all map events). Event navigation is performed using the "Forward" and "Back" buttons. Moreover, navigation is possible in two modes - in chronological order and by event chains. Chains of events will be described below. The event may correspond to a marker on the map indicating the location of the event.

<img width="100%" src="/img/doc_en/doc5screen1.png"/><br />
To add an event, you need to switch the map to editing mode and click "List" button. The window with the list of events will open. At the bottom of the list will be a link “Add event”. In the same list, you can delete events, go to edit form of event or change the order of events.
<img width="100%" src="/img/doc_en/doc5screen2.png"/><br />
The form for creating / editing events looks like this:
<img width="100%" src="/img/doc_en/doc5screen3.png"/><br />
You must specify:
<ul>
<li>The title of the event.</li>
<li>Event date.</li>
<li>Description of the event. The text that appears in the upper left corner. It is desirable that he would be short. A full description can be provided below.</li>
<li>Show marker. A check mark indicating whether to display the event marker on the map</li>
<li>Chains of events. If the map contains chains of events (plots), then you can determine which chains relates the event. </li>
<li>Article. This is a complete description of the event, which will open in a separate window when you click on the "More" link</li>
<li>Picture. You can add one image to the article.</li>
<li>Editor information. Similar to the editor information of a unit</li>
</ul>

<h2>Map marker and position</h2>
When user switches between events the position of the map may change. The position of the map should be such that as many objects related to the event are displayed on the screen. When you create a new event, the position of the map is set equal to the current position. If you need to change the position after creating an event, then you need to set the desired position, then click the button under the event header (see screenshots).
<img width="100%" src="/img/doc_en/doc5screen4.png"/><br />
If you enable "Show marker" checkbox in the event form, then there will be a marker on the map. You can move that marker the same way as fixed objects.

<h2>Chains of events</h2>
After creating the first interactive maps, a problem was discovered. If some events are not really related to each other, then it is inconvenient to go through them in chronological order. It is necessary to constantly shift attention between different semantic chains. To solve the problem we added "Chains of events" (or "stories").
You can create multiple chains and distribute events between them. Each event can belong to several chains. For example, in the map of the XIII century, the Kulikov battle belongs to two chains - the “Mongol Empire” and “Ancient Russia”.
If there are event chains in the map (at least one), then besides the content in chronological order (“by dates”), the content “by stories will be available. In this case, when you click on the buttons "Forward" and "Back" there will be transitions within the story (not necessarily in chronological order). When the story ends, the next story begins. The order of the plots is also customizable.
<img width="100%" src="/img/doc_en/doc5screen5.png"/><br />

This is the end of the instructions of creating an interactive map. In case of any questions write to pavel@chronocon.org
    
    
    @include('static_pages/en/docs/navigation',['pageNumber'=>$pageNumber, 'countPages'=>count($docPages)])

@endsection
