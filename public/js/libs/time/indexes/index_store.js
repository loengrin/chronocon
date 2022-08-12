/**
 * Class mor managing event on the timeline.
 */
export class IndexStore
{   
    constructor(timeStorage, labels, formatter){
        this.timeStorage = timeStorage;
        this.chainsList = [];
        this.chainIndex = {};
        this.dateIndex = {};
        this.labels = labels;
        this.formatter = formatter;
        this.NO_CHAIN= '__NO_CHAIN__';
    }

    init(){
        var that = this;
        this.chainsList = [];
        this.chainIndex = {};
        this.dateIndex = {};
        if(!this.timeStorage.getTimeObjectById('MAIN')){
            return;
        }

        var chains = this.timeStorage.getTimeObjectById('MAIN').getField('eventChains');
        var tempChainsList = [];
        for(var chainId in chains) {
            tempChainsList.push({'chainId':chainId,'order':chains[chainId].order});
        }
        tempChainsList.sort(function(chain1,chain2){
            return parseInt(chain1.order) - parseInt(chain2.order);
        });
        for(var i=0; i < tempChainsList.length; i++){
            this.chainsList.push(tempChainsList[i].chainId);
        }

        var tempChainIndex = {};
        var tempDateIndex = {};

        var events = this.timeStorage.getObjectsOfType('event');
        for(var i=0; i < events.length; i++){
            var event = events[i];
            var chains = event.getField('eventChains');
            if(chains && Object.keys(chains).length) {
                for(var chainId in chains) {
                    if (!tempChainIndex[chainId]) {
                        tempChainIndex[chainId] = [];
                    }
                    tempChainIndex[chainId].push(event);
                }
            }
            else{
                if(!tempChainIndex[this.NO_CHAIN]){
                    tempChainIndex[this.NO_CHAIN] = [];
                    this.chainsList.push(this.NO_CHAIN);
                }
                tempChainIndex[this.NO_CHAIN].push(event);
            }
            var step = this.timeStorage.getCalendar().getStepByDate(event.getDateBegin());
            if(!tempDateIndex[step]){
                tempDateIndex[step] = [];
            }
            tempDateIndex[step].push(event);
        }

        for(var chainId in tempChainIndex) {
            if(chainId == this.NO_CHAIN){
                tempChainIndex[chainId].sort(function (event1, event2) {
                    var step1 = that.timeStorage.getCalendar().getStepByDate(event1.getDateBegin());
                    var step2 = that.timeStorage.getCalendar().getStepByDate(event2.getDateBegin());

                    return step1 - step2;
                });
            }
            else {
                tempChainIndex[chainId].sort(function (event1, event2) {
                    var step1 = that.timeStorage.getCalendar().getStepByDate(event1.getDateBegin());
                    var step2 = that.timeStorage.getCalendar().getStepByDate(event2.getDateBegin());
                    if(step1 != step2) {
                        return step1 - step2;
                    }
                    var event1chains = event1.getField('eventChains');
                    var event1chainOrder = event1chains[chainId].order;
                    var event2chains = event2.getField('eventChains');
                    var event2chainOrder = event2chains[chainId].order;

                    return parseInt(event1chainOrder) - parseInt(event2chainOrder);
                });
            }
        }
        for(var step in tempDateIndex) {
            tempDateIndex[step].sort(function (event1, event2) {
                return parseInt(event1.getField('order')) - parseInt(event2.getField('order'));
            });
        }

        for(var chainId in tempChainIndex) {
            this.chainIndex[chainId] = [];
            for(var i=0; i< tempChainIndex[chainId].length; i++){
//                var ec =  tempChainIndex[chainId][i].getField('eventChains');
//                if(ec && ec[chainId]) {
//                    ec[chainId].order = i+1;
//                }
//                console.log(chainId, tempChainIndex[chainId][i].getField('name'),ec ? ec[chainId] : '');
                this.chainIndex[chainId].push(tempChainIndex[chainId][i].getId());
            }
        }

        for(var step in tempDateIndex) {
            this.dateIndex[step] = [];
            for(var i=0; i< tempDateIndex[step].length; i++){
                this.dateIndex[step].push(tempDateIndex[step][i].getId());
            }
        }
    }

    getNext(indexMode, event, chainId) {
       return indexMode == 'chains' ?
           this._getNextOrPrevEventChainMode(event, chainId) :
           this._getNextOrPrevEventDateMode(event);
    }

    getPrevious(indexMode, event, chainId) {
        return indexMode == 'chains' ?
            this._getNextOrPrevEventChainMode(event, chainId, true) :
            this._getNextOrPrevEventDateMode(event, true);
    }

    _getNextOrPrevEventChainMode(event, chainId, back) {
        var i = this.chainIndex[chainId].indexOf(event.getId());
        var eventId;
        var newChainId = chainId;
        var needSwithChain = back ? i == 0 : i == this.chainIndex[chainId].length-1;
        if(needSwithChain){
            var chainN = this.chainsList.indexOf(chainId);
            var chainN = back ? chainN-1 : chainN+1;
            var isLastChain = back ? chainN < 0 : chainN >= this.chainsList.length;
            var currentChainId = this.chainsList[chainN];
            while(!isLastChain){
                if(this.chainIndex[currentChainId] && this.chainIndex[currentChainId].length){
                    var firtIndex = back ? this.chainIndex[currentChainId].length-1 : 0;
                    eventId = this.chainIndex[currentChainId][firtIndex];
                    newChainId = currentChainId;
                    break;
                }
                chainN = back ? chainN-1 : chainN+1;
                isLastChain = back ? chainN < 0 : chainN >= this.chainsList.length;
            }
            if(!eventId){
                return {event:null, chainId: null};
            }
        }
        else{
            eventId = this.chainIndex[chainId][back ? i-1 : i+1];
        }
        return {
            'event': this.timeStorage.getTimeObjectById(eventId),
            'chainId': newChainId
        }
    }

    _getNextOrPrevEventDateMode(event, back) {
        var step = this.timeStorage.getCalendar().getStepByDate(event.getDateBegin());
        var i = this.dateIndex[step].indexOf(event.getId());

        var eventId;
        var needSwithStep = back ? i == 0 : i == this.dateIndex[step].length-1;

        if(needSwithStep){
            step = back ? step-1: step+1;
            var isLastStep = back ? step < 0 : step >= this.timeStorage.getCountSteps();
            while(!isLastStep){
                if(this.dateIndex[step] && this.dateIndex[step].length){
                    var firtIndex = back ? this.dateIndex[step].length-1 : 0;
                    eventId = this.dateIndex[step][firtIndex];
                    break;
                }
                step = back ? step-1: step+1;
                isLastStep = back ? step < 0 : step >= this.timeStorage.getCountSteps();

            }
            if(!eventId){
                return {event:null, chainId: null};
            }
        }
        else{
            eventId = this.dateIndex[step][back ? i-1 : i+1];
        }
        return {
            'event': this.timeStorage.getTimeObjectById(eventId),
            'chainId': null
        }
    }


    getIndexByStories(){
        if(!this.timeStorage) {
            return [];
        }
        var index = [];
        var chains = this.timeStorage.getTimeObjectById('MAIN').getField('eventChains');
        for(var i=0; i< this.chainsList.length; i++){
            var events = [];
            var chainId = this.chainsList[i];
            if(this.chainIndex[chainId]) {
                for (var j = 0; j < this.chainIndex[chainId].length; j++) {
                    var eventId = this.chainIndex[chainId][j];
                    events.push(this.timeStorage.getTimeObjectById(eventId));
                }
                index.push({
                    title: chainId == this.NO_CHAIN ? this.labels["Other events"] : chains[chainId].name,
                    events: events,
                    chainId: chainId,
                });
            }
        }
        return index;
    }
    
    getEventsOfChain(chainId){
        if(!this.timeStorage) {
            return [];
        }
        
        var events = [];
        if(this.chainIndex[chainId]) {
            for (var j = 0; j < this.chainIndex[chainId].length; j++) {
                var eventId = this.chainIndex[chainId][j];
                events.push(this.timeStorage.getTimeObjectById(eventId));
            }
        }
        
        return events;
    }

    getIndexByDates(includeEmpty){
        if(!this.timeStorage) {
            return [];
        }
        var index = [];
        var calendar = this.timeStorage.getCalendar();
        for(var step=0; step< this.timeStorage.getCountSteps(); step++){
            if(!this.dateIndex[step] && !includeEmpty){
                continue;
            }
            var events = [];

            if(this.dateIndex[step]) {
                for (var j = 0; j < this.dateIndex[step].length; j++) {
                    var eventId = this.dateIndex[step][j];
                    events.push(this.timeStorage.getTimeObjectById(eventId));
                }
            }
            index.push({
                    title: this.formatter.getDateLabel(calendar.getDateByStep(step)),
                    events: events,
                    chainId: null,
                    step: step
                });
        }
        return index;
    }

    _getFirstOrLastEvent(indexMode, isLast){
        if(indexMode == 'chains'){
            if(! this.chainsList.length){
                return null;
            }
            var beginIndex = isLast ? this.chainsList.length-1 : 0;
            var endIndex = isLast ? 0 : this.chainsList.length;

            for(var i=beginIndex; (isLast ? i >= endIndex : i< endIndex); (isLast ? i-- : i++)){
                var chainId = this.chainsList[i];
                if(this.chainIndex[chainId] && this.chainIndex[chainId].length){
                    var indexInChain = isLast ? this.chainIndex[chainId].length-1 : 0;
                    return {
                        'eventId': this.chainIndex[chainId][indexInChain],
                        'chainId': chainId
                    };
                }
            }
            return null;
        }
        else{
            var beginIndex = isLast ? this.timeStorage.getCountSteps()-1 : 0;
            var endIndex = isLast ? 0 : this.timeStorage.getCountSteps();

            for(var step=beginIndex; (isLast ? step >= endIndex : step < endIndex); (isLast ? step-- : step++)){
                if(this.dateIndex[step] && this.dateIndex[step].length){
                    var indexInStep = isLast ? this.dateIndex[step].length-1 : 0;
                    return {
                        'eventId': this.dateIndex[step][indexInStep]
                    };
                }
            }
            return null;
        }
    }

    getFirstEvent(indexMode) {
        return this._getFirstOrLastEvent(indexMode);
    }

    _getLastEvent(indexMode) {
        return this._getFirstOrLastEvent(indexMode, true);
    }

    getDefaultIndexMode(){
        return Object.keys(this.dateIndex).length === 0 ? 'dates' : 'chains';
    }

    isFirst(eventId, chainId, indexMode){
        if(indexMode == 'chains') {
            var currentNumber = this.getEventPosition(eventId, chainId);
            return currentNumber == 1;   
        }
        if(indexMode == 'dates') {
           var event = this.timeStorage.getTimeObjectById(eventId);
           return this._getNextOrPrevEventDateMode(event, true).event == null;
       }
    }

    isLast(eventId, chainId, indexMode){
        if(indexMode == 'chains') {
           var countInChain = this.getEventsOfChain(chainId).length;
           var currentNumber = this.getEventPosition(eventId, chainId);
           return countInChain == currentNumber;
       }
       if(indexMode == 'dates') {
           var event = this.timeStorage.getTimeObjectById(eventId);
           return this._getNextOrPrevEventDateMode(event, false).event == null;
       }
    }
    
    isFirstOfStep(eventId, step){
        var stepEvents = this.dateIndex[step];
        return stepEvents && stepEvents[0] == eventId;
    }

    isLastOfStep(eventId, step){
        var stepEvents = this.dateIndex[step];
        return stepEvents && stepEvents[stepEvents.length-1] == eventId;   
    }

    getEventPositionOfStep(eventId, step){
        var stepEvents = this.dateIndex[step];
        if(!stepEvents) {
            return;
        }
        for(var i=0; i<stepEvents.length; i++) {
            if(stepEvents[i] == eventId) {
                return i+1;
            }
        }
        return 0;
    }
    
    getCountEventsOfStep(step) {
        return this.dateIndex[step] ? this.dateIndex[step].length : 0;
    }


    getEventPosition(eventId, chainId){
        var events = this.getEventsOfChain(chainId)
        for(var i=0; i<events.length; i++) {
            if(events[i].getId() == eventId) {
                return i+1;
            }
        }
        return 0;
    }

    getFirstEventChain(event){
        var chains = event.getField('eventChains');
        if(!chains || Object.keys(chains).length == 0){
            return this.NO_CHAIN;
        }
        for(var chainId in chains){
            return chainId;
        }
    }

    moveEventUp(event, chainId, indexMode){
        this._moveEventUpOrDown(event, chainId, indexMode);
    };

    moveEventDown(event, chainId, indexMode){
        this._moveEventUpOrDown(event, chainId, indexMode, true);
    };

    _moveEventUpOrDown(event, chainId, indexMode, down){
        if(!this._canBeMovedUpOrDowm(event, chainId, indexMode, down)){
            return;
        }
        var anotherEventArr = down ? this.getNext(indexMode, event, chainId) : this.getPrevious(indexMode, event, chainId);
        var anotherEvent = anotherEventArr.event;
        console.log(event, anotherEvent);
        if(indexMode == 'chains') {
            var eventChains = event.getField('eventChains');
            var anotherEventChains = anotherEvent.getField('eventChains');
            var tempOrder = anotherEventChains[chainId].order;
            anotherEventChains[chainId].order = eventChains[chainId].order;
            eventChains[chainId].order = tempOrder;

            anotherEvent.setField('eventChains', anotherEventChains);
            event.setField('eventChains', eventChains);
        }
        else {
            var tempOrder = anotherEvent.getField('order');
            anotherEvent.setField('order', event.getField('order'));
            event.setField('order', tempOrder);
        }
        this.init();
    };

    canBeMovedUp(event, chainId, indexMode){
        return this._canBeMovedUpOrDowm(event, chainId, indexMode);
    };

    canBeMovedDown(event, chainId, indexMode){
        return this._canBeMovedUpOrDowm(event, chainId, indexMode, true);
    };

    _canBeMovedUpOrDowm(event, chainId, indexMode, down){
        if(indexMode == 'chains' && chainId == this.NO_CHAIN){
            return false;
        }
        var anotherEventArr = down ? this.getNext(indexMode, event, chainId) : this.getPrevious(indexMode, event, chainId);
        var anotherEvent = anotherEventArr.event;
        var anotherEventChainId = anotherEventArr.chainId;
        if (!anotherEvent) {
            return false;
        }
        var calendar = this.timeStorage.getCalendar();
        if(calendar.nE(event.getDateBegin(), anotherEvent.getDateBegin())){
            return false;
        }
        if(indexMode == 'chains') {
            if(anotherEventChainId != chainId){
                return false;
            }
        }
        return true;
    }

    getChainList(){
        if(!this.timeStorage) {
            return [];
        }
        var chains = this.timeStorage.getTimeObjectById('MAIN').getField('eventChains');
        var chainsByOrder = [];
        for(var i=0; i< this.chainsList.length; i++) {
            var chainId = this.chainsList[i];
            if(chainId == this.NO_CHAIN){
                continue;
            }
            chainsByOrder.push(chains[chainId]);
        }
        return chainsByOrder;
    }

    chainCanBeMovedUp(chainId){
        return this._chainCanBeMovedUpOrDown(chainId);
    };

    chainCanBeMovedDown(chainId){
        return this._chainCanBeMovedUpOrDown(chainId, true);
    };

    _chainCanBeMovedUpOrDown(chainId, down){
        var index = this.chainsList.indexOf(chainId);
        var extremeIndex = down ? this.chainsList.length-1 : 0
        return index !== extremeIndex;
    };

    moveChainUp(chainId){
        this._moveChainUpOrDown(chainId);
    };

    moveChainDown(chainId){
        this._moveChainUpOrDown(chainId, true);
    };

    _moveChainUpOrDown(chainId, down){
        if(!this._chainCanBeMovedUpOrDown(chainId, down)){
            return;
        }
        var index = this.chainsList.indexOf(chainId);
        var anotherChainIndex = down ? index+1 : index-1;
        var anotherChainId = this.chainsList[anotherChainIndex];

        var chains = this.timeStorage.getTimeObjectById('MAIN').getField('eventChains');
        var tempOrder = chains[chainId].order;
        chains[chainId].order = chains[anotherChainId].order;
        chains[anotherChainId].order = tempOrder;
        this.timeStorage.getTimeObjectById('MAIN').setField('eventChains', chains);

        this.init();
    };

    getLastChainOrder(){
        var hasNoChain = this.chainsList.indexOf(this.NO_CHAIN) !== -1;
        if(this.chainsList.length < (hasNoChain ? 2 : 1)){
            return 1;
        }
        var chains = this.timeStorage.getTimeObjectById('MAIN').getField('eventChains');
        
        var lastChainId = this.chainsList[this.chainsList.length-(hasNoChain ? 2 : 1)];
        var lastOrder = chains[lastChainId].order;
        return lastOrder+1;
    }

    reinit () {
        this.init();
    }

    updateEventChains(event, newChainIds) {
        var chains = event.getField('eventChains');
    
        chains = chains && chains.length === undefined  ? chains : {};
        var chainIds = Object.keys(chains);
        var chainIdsToDelete = chainIds.filter(function (chainId) {
            return newChainIds.indexOf(chainId) === -1;
        });
        for (var i = 0; i < chainIdsToDelete.length; i++) {
            var chainIdToDelete = chainIdsToDelete[i];
            delete chains[chainIdToDelete];
        }

        chainIds = Object.keys(chains);

        var chainsToAdd = newChainIds.filter(function (chainId) {
            return chainIds.indexOf(chainId) === -1;
        });
        for (var i = 0; i < chainsToAdd.length; i++) {
            var chainToAdd = chainsToAdd[i];
            var order = this.getMaxOrderOfChain(chainToAdd);
//            if (!this.chainIndex[chainToAdd] || !this.chainIndex[chainToAdd].length) {
//                order = 1;
//            }
//            else {
//                var lastEventId = this.chainIndex[chainToAdd][this.chainIndex[chainToAdd].length - 1];
//                var lastEvent = this.timeStorage.getTimeObjectById(lastEventId);
//                var lastEventChains = lastEvent.getField('eventChains');
//                order = lastEventChains[chainToAdd].order + 1;
//            }
            chains[chainToAdd] = {'order': order+1};
        }
        event.setField('eventChains', chains);
    }

    getMaxOrderOfChain(chainId) {
        var eventIds = this.chainIndex[chainId];
        if(!eventIds  || !eventIds.length ) {
            return;
        }
        var maxOrder = 0;
        for (var i = 0; i < eventIds.length; i++) {
            var event = this.timeStorage.getTimeObjectById(eventIds[i]);
            var lastEventChains = event.getField('eventChains');
            var order = lastEventChains[chainId].order;
            if(order > maxOrder) {
                maxOrder = order;
            }
        }
        console.log(chainId, maxOrder, eventIds.length);
        return maxOrder;
        
    }

    updateEventOrder(event) {
        var step = this.timeStorage.calendar.getStepByDate(event.getDateBegin());
        var order;
        if (!this.dateIndex[step] || !this.dateIndex[step].length) {
            order = 1;
        }
        else {
            var lastEventId = this.dateIndex[step][this.dateIndex[step].length - 1];
            var lastEvent = this.timeStorage.getTimeObjectById(lastEventId);
            order = parseInt(lastEvent.getField('order')) + 1;
        }
        event.setField('order', order);
    }

    hasChainsMode() {
        if(!this.timeStorage){
            return false;
        }
        var chains = this.timeStorage.getTimeObjectById('MAIN').getField('eventChains');
        return  chains && Object.keys(chains).length > 0;
    }
    
    getEventsByStep(step) {
        if(!this.dateIndex[step]) {
            return []
        }
        var events = [];
        for (var j = 0; j < this.dateIndex[step].length; j++) {
            var eventId = this.dateIndex[step][j];
            events.push(this.timeStorage.getTimeObjectById(eventId));
        }
        return events;
    }
    
    getAllChains() {
        var chains = Object.assign({}, this.timeStorage.getTimeObjectById('MAIN').getField('eventChains'));
        if(!this.chainsList.indexOf(this.NO_CHAIN) !== -1) {
            chains[this.NO_CHAIN] = { 
                id: this.NO_CHAIN,
                name: this.labels["Other events"]
            }
        }
        return chains;
    
    }
}