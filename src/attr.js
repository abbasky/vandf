import dom from "./dom";
import Value from "./value";


export default class Attr{
    static new (node) {
        return new this(node);
    }

    constructor(node) {
        this._node = node
        this._items = {};
    }
    
    get (key) {
        let item = this._items[key];
        return item.oldValue;
    }

    set (key, value) {
        let val = this._items[key];
        if(!val){
            val = Value.new(value);
            this._items[key] = val;
        }
        val.newValue = value;
    }

    items (attrs) {
        for (const key in attrs) {
            const value = attrs[key];
            this.set(key, value);
        }
    }

    update(serial, total) {
        let items = this._items;
        let node = this._node;
        let datum = node.datum;
        for (const key in items) {
            const item = items[key];            
            item.update(node, datum, serial, total);
        }
    }

    apply () {
        let node = this._node;
        let ele = node.element;
        if(!ele) {return this}
        let items = this._items;
        for (const key in items) {
            const item = items[key];
            if(item?.changed){
                let value = item.commit();
                let fullname = dom.get_namespace_domain(key);
                if(value== null || value == undefined){
                    fullname.local && ele.removeAttributeNS(fullname.space, fullname.local) 
                        || ele.removeAttribute(key);
                }else{
                    fullname.local 
                    && ele.setAttributeNS(fullname.space, fullname.local, value)
                    || ele.setAttribute(key, value);
                }
            }
        }
    }
}