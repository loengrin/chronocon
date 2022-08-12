/**
 * Set of functions for chain actions 
 */


export const moveChainUp = (chainId, state) => {
    var time = state.time.getCopy();
    time.getIndexStore().moveChainUp(chainId);
    return time;
}

export const moveChainDown = (chainId, state) => {
    var time = state.time.getCopy();
    time.getIndexStore().moveChainDown(chainId);
    return time;
}

export const deleteChain = (chainId, state) => {
     console.log("ddd");
    var time = state.time.getCopy();

    var chains = time.getTimeObjectById('MAIN').getField('eventChains');
   
    delete chains[chainId];
    time.getTimeObjectById('MAIN').setField('eventChains', chains);
    var objects = time.getObjectsOfType('event');
        
    for (var i=0; i < objects.length; i++) {
        var object = objects[i];
        var eventChains = object.getField('eventChains');
        if (eventChains && eventChains[chainId]) {
            delete eventChains[chainId];
            object.setField('eventChains', eventChains);
        }
    }
    time.getIndexStore().reinit();
    return time;
}

export const saveChain = (chainId, fields, isNew, state) => {
    var time = state.time.getCopy();
    var chains = time.getTimeObjectById('MAIN').getField('eventChains');
    if(!chains || (Array.isArray(chains) && !chains.length)) {
        chains = {};
    }
    if(isNew){
        var chainId = "chain_"+(new Date()).getTime()+"."+Math.floor(Math.random() * 1000);
        var chain = {};
        chain.id = chainId;
        chain.name = fields.name;
        chain.order = time.getIndexStore().getLastChainOrder();
        chains[chainId] = chain;
    }
    else{
        chains[chainId].name = fields.name;
    }
    time.getTimeObjectById('MAIN').setField('eventChains', chains);
    time.getIndexStore().reinit();
    return time;
}
