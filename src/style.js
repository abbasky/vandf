import Value from "./value";

export default class Style{
    static new (node) {
        return new this(node);
    }

    constructor(node) {
        this._node = node;
        this._items = {};
        this._prioitys = {};
    }
    
    get (key) {
        let item = this._items[key];
        return item.oldValue;
    }

    set (key, value, priority) {
        let val = this._items[key];
        if(!val){
            val = Value.new(value);
            this._items[key] = val;
        }
        val.newValue = value;
        
        if(priority){this._prioitys[key] = priority}
    }

    items (items) {
        for (const key in items) {
            const value = items[key];
            this.set(key, value);
        }
    }

    update(serial, total) {
        let node = this._node;
        let ele = node.element;
        if(!ele){return}
        let datum = node.datum;
        let items = this._items;
        for (const key in items) {
            const item = items[key];
            item.update(node, datum, serial, total);
        }
    }

    apply () {
        let node = this._node;
        let ele = node.elment;
        if(!ele) {return this}
        let items = this._items;
        for (const key in items) {
            const item = items[key];
            if(item?.changed){
                let value = item.commit();
                let priority = this._prioitys[key];
                if(value === undefined || value === null || value === ''){
                    ele.style.removeProperty(key);
                }else{
                    ele.style.setProperty(key, value, priority);                    
                }
            }
        }
    }
}