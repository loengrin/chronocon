@extends('layouts.popup',['title'=>trans('messages.'.$title)])
@section('popup-content')
    
Chronocon project is an editor of interactive maps. It was created to make a big map of human history, but you can use it as you wish. I simultaneously use two things - improving editor and making interactive maps with it. I will describe below how I do it. Every map contains of 3 parts:

<h2>1. Map settings</h2>

The map is defined  by general parameters. The most important settings - are the time frame and the time step. For example time frame of map about Columbus is June 1492 - November 1504. The time step is month. When every object is created, it needs to define its lifetime in Map time frame.

I used one hundred years for map about Early History(from 3500 В.С to 500 B.C). I think that is enough for events of this period. But for maps that describe wars or geographical discoveries I used  month as a time step. If the time step is more than a month it doesn’t make sense to displays locations of  armies on the map.

The less time step, the more difficult to make a map. Map of Second Punic War contains about 250 step-months (about 20 years).  But if you choose ten years as a step, you can display whole history from Herodotus to present time in 250 step-decades. On the other side, if you want to display modern events with one day as a step, you need 365 steps for each year.

I am going to move in two directions. I will make maps with month as a time step for the most interesting periods and at the same time I will make overview maps with big time step for big periods of the history.

<h2>2. Objects</h2>
You should put your objects into an empty map after creating it.
The objects are in four types:
<ul>
    <li>Fixed units (for example cities or battles).</li>
<li>Movable units (armies or expeditions etc.).</li>
<li>Regions (countries or mountain areas etc.).</li>
<li>Lines (rivers or roads  etc.).</li>
</ul>
Objects are absolutely independent of each other. Besides, there is a mechanism for dragging objects from one map to another. This is done to simplify the work. The same rivers and mountains are necessary for many maps. If we will create many maps, we could unite them. We would create one big map and drag all objects from small maps to it.

<h2>3. Events</h2>
We need to add time dimension to the map If we want our map to be really historical, not just static map. And we need events. What is event in our map?
<ol>
<li>Event has the certain date.</li>
<li>Event defines description in right side if the screen.</li>
<li>Event defines map position.</li>
<li>Event defines tip on map.</li>
<li>Events can be organized into chains</li>
</ol>
The main navigation buttons for map are buttons “forward/back”. Those buttons allow user to move from one event to another. 
 <br>
I will describe each of those three components in details in next parts of this documentation.
    <img width="100%" src="/img/doc_en/doc1screen1.png"/>
    @include('static_pages/en/docs/navigation',['pageNumber'=>$pageNumber, 'countPages'=>count($docPages)])

@endsection
