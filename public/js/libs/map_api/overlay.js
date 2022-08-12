/**
 * Base class for all overlays
 */
export class Overlay
{
    constructor(id, size, sizeMax){
        this._size = size;
        this._id = id;
        this._sizeMax = sizeMax;
    };
    
    getSize() {
        return this._size;
    }
    
    getSizeMax() {
        return this._sizeMax;
    }
    
    getId() {
        return this._id;
    }

}