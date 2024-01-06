import Identity from './identity';
import EventPorxy from './eventproxy';
import Node from './node';

export default class Van {
    static _plugins = {};
    static _namespace_domain = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    }

    static get(id, path){
        id = Identity.build(id,path);
        return Van._plugins[id];
    }

    static new(id, path, ...args) {
        let identity = Identity.new(id, path);
        if(identity.path){
            let parent = Van.get(identity.path);
            if(!parent){ throw new Error("请先定义父组件")}
            parent.append(identity.full);
        }        
        return new this(identity, ...args);
    }

    static dark (flag) {
        if(arguments.length < 1){return this._dark}
        this._dark = flag;
    }

    static addEventListener(type, callback) {
        document.addEventListener(type, (e)=>{
            EventPorxy.dispatch(type,(proxy)=>{ 
                callback.call(null, e, proxy)
            })
        })
    }

    static emit (event) {
        EventPorxy.dispatch(event);
    }

    static namespace(local, uri){
        if(arguments.length < 1){return}
        if(arguments.length === 1){return this._namespace_domain[local]}
        this._namespace_domain[local] = uri
    }

    static findNamespaceByUri (uri) {
        for (const key in this._namespace_domain) {
            const ns_uri = this._namespace_domain[key];
            if(ns_uri === uri){return key}
        }
    }

    static on (type, fn) {
        EventPorxy.on(type, fn);
    }

    static set(id, comp) {
        this._plugins[id] = comp;
    }
    
    constructor(identity){
        this._identity = identity;
        this._kids = [];
        
        this._local = 'xhtml'
        this._tag = 'div'
        this._views = [];
        this._conf = {};
        
        this._attrs = {};
        this._classes = "";
        this._html = undefined;
        this._styles = {};
        this._data = undefined;
        this._states = undefined;

        Van.set(identity.full, this)
    }

    get kids () {
        return this._kids;
    }

    get name () {
        return this._identity.short;
    }
    
    get id (){
        return this._identity.full;
    }

    get url () {
        return Van.namespace(this._local);
    }

    get views () {
        return this._views;
    }

    attrs(config){
        if(arguments.length < 1) { return this._attrs}
        if(typeof config !== 'object') { return this }
        Object.assign(this._attrs, config);
        return this;
    }

    after (name) {
        let comp = Van.get(name, this._identity.path);
        if(comp) {throw Error(`插入${comp.id}组件已存在，不能重复插入`)}
        let identity = Identity.new(name, this._identity.path);
        comp = new Van(identity);
        Van._plugins[identity.full] = comp;
        if(identity.path){
            let parent = Van.get(identity.path);
            let index = parent.index(this._identity.full)
            parent.insert(index+1, comp.id);
        }
    }

    append (kid) {
        if(kid.constructor.name === 'Identity'){
            kid = kid.full;
        }
        this._kids.push(kid);
    }

    attach (element) {
        Node.attach(this.id, element);
    }

    // at(id){
    //     if(id){return new Identity.new(id, this._identity.full)}
    //     return this._identity.full;
    // }

    before (name) {
        let comp = Van.get(name, this._identity.path);
        if(comp) {throw Error(`插入${comp.id}组件已存在，不能重复插入`)}
        let identity = Identity.new(name, this._identity.path);
        comp = Van(identity);
        Van._plugins[identity.full] = comp;
        if(identity.path){
            let parent = Van.get(identity.path);
            let index = parent.index(this._identity.full)
            parent.insert(index, comp.id);
        }
    }

    classes(names){
        if(arguments.length < 1) {return this._classes}
        this._classes = names;
        return this;
    }

    data (data) {
        if(arguments.length < 1) { return this._data }
        this._data = data;
        return this;
    }

    findParent (name) {
        let parent = this.parent;
        while(parent && parent.name !== name){
            parent = parent.parent;
        }
        return parent;
    }

    get (name) {
        let path = Identity.build(name,this._identity.full);        
        return Van.get(path);
    }

    html (text) {
        if(arguments.length < 1) { return this._html }
        this._html = text;
        return this;
    }

    index (id) {
        for (let i = 0; i < this._kids.length; i++) {
            const kid = this._kids[i];
            if( id === kid) { return i }
        }
    }

    insert (kid, index) {
        if(kid.constructor.name === 'Identity'){
            kid = kid.full;
        }
        this._kids.splice(index, 0, kid);
    }

    kid(name){
        let comp = Van.get(name, this._identity.full);
        if(comp) {return comp}
        return Van.new(name,this._identity.full);
    }

    model (model) {
        if(arguments.length < 1) { return this._model }
        this._model = model;
        return this;
    }

    parent (level = 1) {
        const pid = this._identity.path;
        if(!pid){return}
        let parent = Van._plugins[pid];
        if(level <= 1){ return parent }
        return parent.parent(level - 1)
    }

    tag (tagName) {
        if(arguments.length < 1) {return this._tag || 'div'}
        this._tag = tagName;
        return this;
    }

    states (states) {
        if(arguments.length < 1) {return this._states}
        this._states = states;
        return this;
    }

    styles(config){
        if(arguments.length < 1) { return this._styles}
        if(typeof config !== 'object') { return this }
        Object.assign(this._styles, config);        
        return this;
    }
    

    theme (theme, overflow = false) {
        if(arguments.length < 1) { return this._theme }
        if(overflow){this._theme = theme || {}}
        else{
            if(typeof theme !== 'object') { return this }
            Object.assign(this._theme, theme);
        }
        return this;
    }

    view (view) {
        if(arguments.length > 0) { 
            this._views.push(view);
        }        
        return this;
    }
}

