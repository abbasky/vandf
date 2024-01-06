export default class Event {
    static new (type, node, list, rawEvent) {
        return new this(type, node, list, rawEvent)
    }

    constructor(type, node, list, rawEvent) {
        this._type = type;
        this._target = node;
        this._list = list || [];
        this._list.push(node);
        this._rawEvent = rawEvent;
        this._data = undefined;
        this._bubbles = true;
    }

    get bubbles () {
        return this._bubbles;
    }

    get datum () {
        return this._target.datum;
    }

    get first () {
        return this._list[0];
    }

    get index () {
        return this._target.index;
    }

    get list () {
        return this._list;
    }

    get rawEvent() {
        return this._rawEvent;
    }

    get target () {
        return this._target;
    }

    get type () {
        return this._type;
    }

    get data () {
        return this._data
    }

    set data (data) {
        this._data = data;
    }

    stopPropagation () {
        this._bubbles = false;
    }
    
}