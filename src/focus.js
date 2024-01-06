import Value from "./value";

export default class Focus{
    static new (node) {
        return new this(node);
    }

    constructor(node) {
        this._node = node
        this._val = Value.new(false);
    }

    get value () {
        return this._val.oldValue;
    }

    in(){
        this._val.newValue = true;
    }

    out () {
        this._val.newValue = false;
    }

    update(serial, total) {
        let node = this._node;
        let ele = node.element;
        if(!ele){return}
        let datum = node.datum;
        this._val.update(node, datum, serial, total);
    }

    apply () {
        let node = this._node;
        let ele = node.element;
        if(!ele) {return this}
        let item = this._val
        let value = item.commit();
        value ? ele.focus() : ele.blur();
    }
}