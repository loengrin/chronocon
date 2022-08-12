
# Backend, Database

The web application is intended for editing dynamic map by a group of authors. This means that we need to store a complete history of each map changes and we need a mechanism for rolling back to the previous version. The data structure was chosen to provide this opportunity. Each map is a collection of objects. Each time you save the map, a new "version" is created. Version numbers are incremented.
When a new object appears or changes the old one, it is saved in the object_values ​​table. The key is an md5 hash from the json representation of the object. The table data is not deleted or changed. 

In order to link objects with a map, the chronomap_objects table is used. The data in this table is also not deleted or changed, only new ones are added.

![](https://chronocon.org/img/readme/database.png)

Each object (and the dynamic parameter of the object) has a unique id which is generated on the front-end side .
When map with new objects are saved, they are added to object_values table and links are added to chronomap_objects. At the same time, dynamic parameters (territories, tables, and others) are stored in separate lines. The same happens when user save map with changed objects. When user delete an object from the map, we add to chronomap_objects row with change_type = delete.

When we need to get map objects for the current version, we can select all rows from chronomap_objects for this map from the first version to the current one. New versions of each object (corresponding to later versions) replase earlier. If there is a mark about deleted object, it is excluded from the result.

Thus, we can return to any intermediate version of the map.
This may cause a problem if there are a lot of versions and they contain a lot of changes. Then computing objects from the first version may not be optimal. For this, "Base versions" are created. Every few versions, a complete set of map objects for this version is saved. Each subsequent version stores the number of this base version. And it is not necessary to apply all the changes from the first version of the map. It is enough to apply the changes starting from the base version.

![](https://chronocon.org/img/readme/base_version.png)

# 2. Frontend. Data structure

Now I will describe about how the data is stored on the front-end side. A set of map objects is stored in a complex structure named "Time". 
It consists of:
1. Actually the array of objects
2. The Calendar object, which is responsible for converting dates
3. The index of objects for working with the map
4. Index for events

![](https://chronocon.org/img/readme/time_structure.png)

### Calendar object
Each object has a lifetime, date of appearance on the map and date of disappearance. User selects "Time step" (dateMode) when creating each map. It can be "Century", "Year", "Month", "Day". User cannot change the step after creating a map. The set of dates fields depends on the time step. For example, if you select "day" fortime step, dates will be saved in the format {"year": 1900, "month": 5, "day": 10}.

It is convenient to represent time as a discrete sequence of steps for working with the map. We can assign a step number to each date, counting it from the lower bound of the maps lifetime. For example, if the start date of the map is {"year": 1900, "month": 5, "day": 3}, then the date {"year": 1900, "month": 5, "day": 10}, correspond step number 7. Thus, time on the map can be considered as a linear sequence of steps.
The Calendar object is part of the Time object and it is responsible for the conversion of dates. Its main functions are
-getDateByStep
-getByStepDate


### Object Index for map
Time on the map can be represented as a segment, and map objects as nested segments. Dynamic parameters are obtained by segments of the second level of nesting. The dynamic parameters of each type should completely cover the lifetime of the object without intersections. At each step, the object should have only one "border", one "color", one "table", etc.
We need to take care of maintaining this property when object changes.

In order to store global map settings, we use an object with id equal to the constant "MAIN".

![](https://chronocon.org/img/readme/segments.png)

The TimeIndex structure is used when we need to quickly retrieve sets of objects. The most important operations on the map are:
-Get all the objects for a given step.
-Get the difference of the given step and the previous one.

The data structure was selected in such a way that rewinding the map one step forward or backward did not need to reload the entire map. So that it affects only changed objects.

The sequence of steps of the map is divided into blocks of the same size. Each block stores an array of id objects (or dynamic parameters) that exist on the map in the initial step of the block. Also, for each step, an array of id objects (or dynamic parameters) is stored that appear or disappear at this step.

Thus, we can get a map change for a given step in O(1) time, since this data is simply stored in the index.

To get all the objects that exist at an arbitrary step on the map, we need to determine in which block this step is located, get all the objects that exist in the initial block step (this data is stored) and apply all the changes from the steps from the initial block step to the current step. The complexity of this operation is O(n) on average, but at least we do not have to apply changes from the first step.


![](https://chronocon.org/img/readme/time_index.png)

Index needs to be changed:
1. When user add object (or dynamic parameters)
2. When user delete object (or dynamic parameters)
3. When objects lifetime is changed. In this case, we also must recalculate the lifetime of its dynamic parameters
4. When map lifetime is changed. In this case we mustrecalculate the lifetime of all objects and its dynamic parameters

All of this are operations on nested segments. This is the most difficult and error-sensitive part of the project.

### Event index

Also we need a structure for working with events on the map. Events are the same objects as everyone else and they are contained in TimeIndex. Events always have a lifetime duration in one step (dateBegin = dateEnd). But events have a separate navigation, therefore they need a separate index.

The interface allows you to go through a sequence of events in two ways - in chronological order and "by stories".
In the first case, the events are sorted by step, and the events within one step are sorted by the "order" field. The field is assigned to the event at creation. We take event with the largest "order" for this step and increment it. The user can change the order of events. It is also necessary to change the event "order" when date of the event has changed.

![](https://chronocon.org/img/readme/event_index.png)

In case of navigation "by stories", Stories are sorted first, they also have an "order" field. Events are sorted inside the story.

The IndexStore object contains both of these indexes; it allows:
-Get the next or previous event (for both types of navigation - by date and stories)
-Get the first or last events (for both types of navigation)
-Receive all the content (to display in the corresponding element)
-The index is kept up-to-date when events or their order have changed

# 3. Frontend. General structure

![](https://chronocon.org/img/readme/structure.png)

The project is built on the basis of React and Redux. The time structure described above is part of the State. State also contains fields such as current step, the position of the map, the selected object, and the map display settings.
Interaction with the map is implemented through MapSaga.

# 4. Frontend. Map

![](https://chronocon.org/img/readme/map_structure.png)
Each type of object has its own map overlay.
UnitMarker (for fixed objects), Region, Line, Army, EventArrow. They are all implemented the Overlay interface. It has methods show, hide, select, deselect, showLabel, hideLabel, getSize, getSizeMax, getId.
There is also a Map object responsible for the general state of the map.
These are complex objects that are built on the basis of the Google Maps API objects.

Objects are created through the ObjectFactory class.
The pool of objects is stored in the OverlayStorage container.

The interaction of the map and the rest of the application is built through mapSaga. mapSaga is called after reducers and processes actions that affect the map. MapSaga, in turn, can also call actions.

Main events:
rewind - the current step of the map has changes
refresh -  editMode or mapSettings have changes
zoomChanged - the zoom of the map has changed
selectOverlay / deselectOverlay 
redrawOverlay - update the state of the object (called in case of any change)

A significant part of the logic of working with the map is controlling the visibility of objects. The visibility of objects depends on the current step was described in the section about TimeIndex. But determining the visibility of an object is more complicated, it depends not only on the current step, but on several parameters
1. Current step
2. Current zoom (each object contains the size and sizeMax parameters, which determine the zoom range in which this object should be displayed)
3. Current event (objects can be attached to events, in this case the object will be hidden if the current event is different)
4. Objects of type Army can be hidden if their position corresponds to a certain point.
If the object is invisible at least by one of these parameters, it must be hidden from the map.

For unified control over the visibility of objects, we use VisibilityStorage object. For each object, it stores a set of flags.

Several services is used for map management:
RewindManager - handles map step change events
ZoomManager - handles zoom map change events
EventManager - processes events that change the current event
SelectManager - handles an object selection event
MapStateManager - controls general map events (such as position change)
ArmyManager - controls Army Objects





