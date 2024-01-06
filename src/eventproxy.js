import Event from "./event";


export default class EventPorxy {
    static _proxys = [];
    static _listeners = {};
    static get proxys () {
        return this._proxys;
    }

    static get listeners () {
        return this._listeners;
    }

    static dispatch(node, type, callback) {
        type = EventPorxy.type(type);
        let proxys = EventPorxy.proxys;
        proxys.forEach((proxy) => {
            let native = proxy.native(type);
            if(native){
                callback.call(null, proxy);
            }
        })
    }

    static on(type, fn) {
        type = EventPorxy.type(type);
        let callbacks = this._listeners[type];
        if(!callbacks){
            callbacks = [];
            this._listeners[type] = callbacks;
        }
        callbacks.push(fn);
    }

    static dispatch (event) {
        let proxys = EventPorxy.proxys;
        event.stopPropagation();
        proxys.forEach((proxy) => {
            proxy.dispatch(event);
        })
    }

    static type (type) {
        const ts = type.split('.');
        return ts[0];
    }

    constructor(node){
        this._node = node;
        this._natives = {}
        this._listeners = {}
        this._regists = {}
        EventPorxy._proxys.push(this);
    }

    get natives () {
        return this._natives;
    }

    get node () {
        return this._node;
    }

    get element () {
        return this._node?.element
    }

    addListener (type, fn) {
        let callbacks = this._listeners[type];
        if(!callbacks){
            callbacks = [];
            this._listeners[type] = callbacks;
        }
        callbacks.push(fn);
    }

    callbacks (type) {
        return this._listeners[type];
    }

    off (type, fn) {
        type = EventPorxy.type(type);
        if(arguments.length < 2){
           delete this._listeners[type];
           return this;
        }
        let callbacks = this._listeners[type];
        if(!callbacks){return}
        let index = -1;
        for (let i = 0; i < callbacks.length ; i++) {
            const callback = callbacks[i];
            if(callback === fn){
               index = i;
                break;
            }
        }
        if(index >= 0){
            callbacks.splice(index,1);
        }
    }

    on (type, fn, options) {
        type = EventPorxy.type(type);
        this.addListener(type, fn);
        if(!options){return;}
        let proxy = this.setNativeProxy(type)
        this.registListener(type, proxy, options)
        return proxy;
    }

    dispatch (event) {
        let type = EventPorxy.type(event.type);
        
        let callbacks = this._listeners[type];
        if(callbacks && callbacks.length > 0){
            callbacks.forEach(callback => {
                callback.call(null, event);                                
            });
        }

        let node = event.target;
        if(!node || !event.bubbles) {return this}
       
        let parent = node.parent();
        if(parent){
            let next = new Event(event.type, parent, [...event.list], event.rawEvent);
            next.data = event.data;
            parent.dispatch(next);
        }else{
            callbacks = EventPorxy.listeners[type];
            if(callbacks && callbacks.length > 0){
                callbacks.forEach(callback => {
                    callback.call(null, event);                                
                });
            }
        }

        return this;
    }

    native (type) {
        type = EventPorxy.type(type);
        return this._natives[type];
    }

    registListeners () {        
        for (const type in this._natives) {                
            const callback = this._natives[type];
            this.registListener(type, callback);
        }
    }

    registListener (type, callback, options) {
        if(this._regists[type]) {return}
        let ele = this._node.element;
        if(!ele) {return}
        this._regists[type] = true
        ele.addEventListener(type, callback, options);
    }

    setNativeProxy (type) {
        let proxy = this._natives[type];
        if(proxy) {return proxy};
        let that = this;
        proxy = function(rawEvent) {
            let event = new Event(type, that._node, [], rawEvent);
            that.dispatch(event);
        }
        this._natives[type] = proxy;
        return proxy;
    }
}