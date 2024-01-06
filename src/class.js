import Value from "./value";


export default class Class{
    static new (node) {
        return new this(node);
    }

    constructor(node) {
        this._node = node;
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

    toggle (key) {
        let item = this._items[key];
        item.newValue = !item.oldValue;
    }

    names (classNames) {
        if(typeof classNames !== 'string') { return this._items.keys.join(' ')}
        let reg = /\s+/u;
        let classes = classNames.split(reg);
        classes.forEach((name)=>{
            if(name && !reg.test(name)){
                this.set(name, true);
            }
        })
    }

    update(serial, total) {
        let node = this._node;
        let datum = node.datum;
        let items = this._items;
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
                if(!value || value == ''){
                    ele.classList.remove(key);
                }else{
                    ele.classList.add(key);
                }
            }
        }
    }
}