import Value from "./value";


export default class Content{
    static new (node) {        
        return new this(node);
    }

    constructor(node) {
        this._node = node;
        this._items = {};
    }
    
    get (key) {
        let item = this._items[key];
        return item?.oldValue;
    }

    set (key, value) {
        let val = this._items[key];
        if(!val){
            val = Value.new();
            this._items[key] = val;
        }
        val.newValue = value;
        
    }

    get html () {
        return this.get('html')
    }

    set html (value) {
        this.set('html', value);
    }

    get text () {
        this.get('text');
    }

    set text (value) {
        this.set('text', value);
    }

    get value () {
        return this.get('value');
    }

    set value (value) {
        this.set('value', value);
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
            if(key === 'html') {
                item.oldValue = ele.innerHTML
            }
            else if( key === 'text') {
                item.oldValue = ele.textContent
            }
            item.update(node, datum, serial, total);
        }
    }

    apply () {
        let node = this._node;
        if(node.kids.length > 0){return}
        let ele = node.element;
        if(!ele) {return this}
        let items = this._items;
        let keys = ['html','text'];
        let hasHtml = false;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let item = items[key];
            if(!hasHtml && key === 'html'){
                hasHtml = item
                    && item.newValue !== undefined
                    && item.newValue !== null
            }
            
            if(item?.changed){
                let value = item.commit();
                if(value === undefined || value === null){
                    continue;
                }
                if(key === 'html'){
                    ele.innerHTML = value;
                }else if(!hasHtml && key === 'text'){
                    ele.textContent = value;
                }
                break;
            }
        }
    }
}