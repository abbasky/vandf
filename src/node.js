import dom from "./dom";
import Van from "./van";
import Sibline from "./sibline";
import EventPorxy from "./eventproxy";
import Style from "./style";
import Attr from "./attr";
import Class from "./class";
import Content from "./content";
import fastdom from "fastdom";
import Focus from "./focus";
import Event from "./event";


class Node {
    static _selection = {};
    static _anchor = {};
    static _focus = {};
    static _renders = [];

    static addEventListener(target, type, callback) {
        document?.addEventListener(type, (e) => {
            EventPorxy.dispatch(target, type, (proxy) => {
                callback.call(null, e, proxy)
            })
        })
    }

    static attach(componentId, element) {
        Sibline.attach(componentId, [element]);
    }

    static new(sibline, index, element) {
        return new this(sibline, index, element);
    }

    static anchor(node, pos) {
        this._anchor['node'] = node;
        this._anchor['pos'] = pos;
    }

    static focus(node, pos) {
        this._focus['node'] = node;
        this._focus['pos'] = pos;
    }

    static setSelection() {
        Caret.setSelection(this._anchor.node, this._anchor.pos, this._focus.node, this._focus.pos)
    }

    static _render(callback) {
        this._renders.push(callback)
        if (this._updateEnable) { return }
        this._updateEnable = true;
        let that = this;
        fastdom.mutate(() => {
            that._renders?.forEach(render => {
                render.call(null)
            });
            that._renders = [];

            //执行选中等代码
            console.log('render is done....')
            // that.setSelection()
            fastdom.clear();
            that._updateEnable = false;
        })
    }

    constructor(sibline, index, element) {
        // console.debug(sibline.id, "node constructor", model)
        this._sibline = sibline;
        this._ele = element;
        let parent = sibline.parent
        let comp = Van.get(this.componentId);

        let tag_full = comp.tag()
        let {local, tag } = get_namespace_name(tag_full);
        //console.log("local host:", Component.namespace(tag))
        if(!local || local === ""){
            local = parent
                ? Van.namespace(tag)
                    ? tag
                    : parent.local
                : Van.findNamespaceByUri(this.document.documentElement.namespaceURI)
        }
        this._local = local;
        this._tag = tag === "" ? 'div' : tag;
        
        
        let pid = parent ? parent.id : "";
        this._id = pid + "/" + comp.name + "@" + index;

        this._datum = undefined;

        this._updating = false;
        this._updateEnable = false;

        this._attr = Attr.new(this);
        this._class = Class.new(this);
        this._content = Content.new(this);
        this._style = Style.new(this);
        this._focus = Focus.new(this);

        this._index = index;
        this._created = false;

        this._proxys = new EventPorxy(this);
        this._observer = undefined;
        this._states = {};

        this._views = [];
        comp.views?.forEach(view => {
            this._views.push(new view(this.model, comp.states()))
        })
       
        
        this._kids = [];

        let prev = null;
        let kids = comp.kids;
        let id;
        for (let i = 0; i < kids.length; i++) {
            id = kids[i];
            //console.log(id, repeat)
            const kid = Sibline.new(id, this, prev);
            prev = kid;
            this._kids.push(kid);
        }
    }

    _create() {        
        // console.log(this.id, "create......", this)
        if (this._ele && this._created) { return this }
        this._created = true;
       
        this._createElement()

        let comp = Van.get(this.componentId);
        this._class.names(comp.classes())
        this._style.items(comp.styles())
        this._attr.items(comp.attrs())
        this._content.html = comp.html()

        this._views.forEach(cview => {
            if (cview.classes) { this._class.names(cview.classes()) }
            if (cview.styles) { this._style.items(cview.styles()) }
            if (cview.attrs) { this._attr.items(cview.attrs()) }
            if (cview.text) { this._content.text = cview.text() }
            if (cview.html) { this._content.html = cview.html() }
            if (cview.value) { this._content.value = cview.value() }
        });

        this._views.forEach(view => {
            if (view.create) { view.create(this, this.index) }
        })

    }

    _createElement () {
        if(this._ele) {return}

        let element        
        if(this._local === 'xhtml') {
            if(this._tag === 'text'){
                element = this.document.createElement('div')
                this.classed(this._tag, true);
            }else{
                element = this.document.createElement(this._tag)
            }            
        }else{
            let uri = Van.namespace(this._local);
            element = this.document.createElementNS(uri, this._tag)            
        }
        this.classed(this.name, true);

        let parent = this.parent();
        let last = parent.lastHasElement;
        if (last) {
            element = dom.after(element, last.element);
        } else {
            element = dom.append(element, parent.element);
        }

        this._ele = element;
        return element;
    }

    _destroy() {

        this._kids.forEach(kid => {
            kid._destroy();
        })

        this._kids = [];

        this._views?.forEach(view => {
            if (view.destroy) {
                view.destroy(this, this.index);
            }
        })

        let ele = this._ele;
        for (const type in this._proxys) {
            const proxy = this._proxys[type];
            ele.removeEventListener(type, proxy);
        }
        ele.remove();
        //delete this;
    }

    _render() {
        let node = this;
        let datum = this.datum;
        let index = this.index;
        this._views.forEach(view => {
            if (view.render) {
                view.render.call(view, node, datum, index);
            }
        })

        let holder = this.holder || this;
        let serial = holder.index;
        let total = holder.sibline.total;

        this._class.update(serial, total);
        this._content.update(serial, total);
        this._style.update(serial, total);
        this._attr.update(serial, total);
        this._focus.update(serial, total);

        let ele = this._ele;
        Node._render(() => {
            node._content.apply();
            node._class.apply();
            node._style.apply();
            node._attr.apply();
            node._focus.apply();
            node._updating = false;
        })
    }

    _update(datum) {
        this._datum = datum;
        let parent = this.parent()
        // //console.log(this.id, "node is update",parent && parent.empty(),parent.element)
        if (parent && parent.empty()) {
            parent.update();
            //父刷新必定会引起子刷新
            return this;
        }

        this._updating = true;
        //update state
        this._updateState ();
        //create        
        this._create();
        //render
        this._render();

        this.kids.forEach(kid => {
            kid.update();
        })
        return this;
    }

    _updateState () {
        let states = this.parent()?.states;
        let holder = this.holder || this;
        let serial = holder.index;
        let total = holder.sibline.total;
        this._views.forEach(view => {
            if (view.states) {
                states = view.states(states, serial, total) || {}
            }
        })

        this._states = states;
    }

    get componentId() {
        return this._sibline.componentId;
    }

    get datum() {
        return this._datum;
    }

    get document() {
        return this._ele?.ownerDocument || window.document;
    }

    get element() {
        return this._ele;
    }

    get first() {
        for (let i = 0; i < this._kids.length; i++) {
            return this._kids[i].nodes[0];
        }
    }

    get local () { return this._local }

    get model() { return this._sibline?.model }

    get name() {
        let comp = Van.get(this.componentId);
        return comp.name;
    }

    get holder() {
        let node = this;
        while (node) {
            if (node._sibline?.isSingle) {
                node = node.parent();
                continue;
            }
            return node;
        }
    }

    get id() {
        return this._id;
    }

    get index() {
        return this._index;
    }

    get isContentEditable() {
        return this._ele && this._ele.contentEditable
    }

    get kids() {
        return this._kids;
    }

    get last() {
        for (let i = this._kids.length - 1; i > 0; i--) {
            const kid = this._kids[i];
            const last = kid.last;
            if (last) { return last }
        }
    }

    get proxy() {
        return this.$proxy;
    }

    get selection() {
        return { anchor: Node._anchor, focus: Node._focus };
    }

    get serial() {
        let group = this.holder || this;
        return group.index;
    }

    get sibline() {
        return this._sibline;
    }

    get namespace () {
        return Van.namespace(this._local)
    }

    get states() {
        return this._states
    }

    get tag() {
        return this._tag || this._ele?.tagName.toLowerCase();
    }

    get textSize() {
        return this.text().length;
    }

    addEventListener(type, listener, options) {
        this.document?.addEventListener(type, listener, options);
        return this;
    }

    attr(key, value) {
        if (!key) { return this }
        if (arguments.length < 2) {
            return this._attr.get(key);
        }
        this._attr.set(key, value);

        return this;
    }

    bind(element) {
        this._ele = element;
    }

    blur() {
        this._focus.out();
    }

    classed(name, value) {
        if (arguments.length < 2) { return this._class.get(name) }
        this._class.set(name, value);
        return this;
    }

    dispatch(event) {
        this._proxys.dispatch(event);
        return this;
    }

    emit(type, data){
        let event = Event.new(type, this);
        event.data = data;
        this.dispatch(event)
    }

    empty() {
        return !this._ele;
    }

    focus() {
        this._focus.in();
    }

    getComputedStyle(key) {
        if (this.empty() || !key) { return {}; }
        let ele = this._ele
        let styles = ele.style || dom.defaultView(ele).getComputedStyle(ele, null);
        if (arguments.length < 1) {
            return styles;
        }
        return styles.getPropertyValue(key);
    }

    height() {
        if (this.empty()) { return 0; }
        let info = this._ele.getBoundingClientRect();
        return info.height;
    }

    heightWithoutMargin() {
        if (this.empty()) { return 0; }
        return this._ele.clientHeight;
    }

    html(value) {
        if (arguments.length < 1) {
            return this.element
                ? this.element.innerHTML
                : this._content.html
        }
        this._content.html = value
        return this;
    }

    isFocused() {
        if (this.empty()) { return false; }
        return dom.isFocused(this._ele);
    }

    next() {
        return this._sibline.get[this.index + 1];
    }

    observe(callback, config) {
        if (this.empty()) { return this; }
        const that = this;
        let proxy = function (mutationsList, observer) {
            if (typeof callback === 'function') {
                callback.call(null, that, mutationsList, observer);
            }
        }
        if (!this._observer) {
            this._observer = new window.MutationObserver(proxy);
        }
        config = config || { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true };

        this._observer.observe(this._ele, config);
        return this;
    }

    offset() {
        if (this.empty()) { return; }

        var rect = this._ele.getBoundingClientRect(),
            body = window.document.body;

        return {
            top: rect.top + body.scrollTop,
            left: rect.left + body.scrollLeft,
            bottom: rect.bottom + body.scrollTop,
        };
    }

    on(type, fn, options) {
        this._proxys.on(type, fn, options);
        return this;
    }

    once(type, fn) {
        let proxy = this.sibline.proxy;
        let onceFunc = function (e) {
            proxy.off(type, onceFunc);
            fn.call(null, e);
        }
        this.on(type, onceFunc);
        return this;
    }


    parent(level = 1) {
        if (!this._sibline) { return }
        let parent = this._sibline.parent;
        if (!level || level <= 1) { return parent; }
        if (parent) {
            return parent.parent(level - 1);
        }
    }

    position() {
        if (this.empty()) { return; }
        var el = this._ele;
        return {
            top: el.offsetTop,
            left: el.offsetLeft
        };
    }

    prev() {
        return this._sibline.get[this.index - 1];
    }

    setSelection() {
        Node.setSelection();
    }

    scrollHeight() {
        if (this.empty()) { return; }
        return this._ele.scrollHeight;
    }

    scrollWidth() {
        if (this.empty()) { return; }
        return this._ele.scrollWidth;
    }

    scrollPositionFromLeft(newValue) {
        if (this.empty()) { return; }
        if (arguments.length < 1) { return this._ele.scrollLeft }
        this._ele.scrollLeft = newValue;
    }

    scrollPositionFromTop(newValue) {
        if (this.empty()) { return; }
        if (arguments.length < 1) {
            return this._ele.scrollTop
        }
        this._ele.scrollTop = newValue;
    }

    scrollIntoView() {
        if (this.empty()) { return; }
        this._ele.scrollIntoView(true);
    }

    style(key, value, priority) {
        if (arguments.length < 2) {
            return this._style.get(key);
        }
        this._style.set(key, value, priority);

        return this;
    }

    text(value) {
        if (arguments.length < 1) {
            return this.element
                ? this.element.textContent
                : this._content.text
        }
        this._content.text = value;

        return this;
    }

    toggle(name) {
        if (arguments.length < 1) { return this }
        this._class.toggle(name)
        return this;
    }

    update() {
        let data = this._sibline.data;
        this._update(data?.[this._index]);
    }

    value(value) {
        if (arguments.length < 1) {
            return this.element
                ? this.element.value
                : this._content.value()
        }
        this._content.value(value)
        return this;
    }


    width() {
        if (this.empty()) { return 0; }
        let info = this._ele.getBoundingClientRect();
        return info.width;
    }

    widthWithoutMargin() {
        if (this.empty()) { return 0; }
        return this._ele.clientWidth;
    }
}

function get_namespace_name (name) {
    let tag = name += "", i = tag.indexOf(":");
    let local;
    if (i >= 0 ) {
        local = name.slice(0, i)
        tag = tag.slice(i + 1).toLowerCase();
    };
    return {local, tag}
}

export default Node;