export default class Value {
    static new (value){
        return new this(value);
    }

    constructor(value){
        this._oldValue = undefined;
        this.newValue = value;
    }

    get changed () {
        return this._newValue !== this._oldValue;
    }

    get oldValue () {
        return this._oldValue;
    }

    set oldValue (value) {
        this._oldValue = value;
    }

    get newValue () {
        return this._newValue;
    }

    set newValue (value) {
        if(typeof value === 'function'){
            this._callback = value;
        }else{
            this._newValue = value;
        }
    }

    update (node, datum, serial, total) {
        if(!this._callback){ return }
        this._newValue = this._callback.call(node, datum, serial, total);
    }

    commit () {
        this._oldValue = this._newValue;
        return this._oldValue;
    }    
}