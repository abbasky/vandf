import Van from "./van";

export default class Repeat extends Van {
    constructor(id, component){
        super(id)
        this._comp = component;
    }

    get kids () {
        return this._comp?.kids;
    }

    get views () {
        return this._comp?.views;
    }

    append (kid) {
        if(this._comp){
            this._comp.append(kid);
        }
    }

    model (model) {
        if(arguments.length < 1) { return this.$model }
        this.$model = model;
        return this;
    }

    component (comp) {
        if(arguments.length < 1) { return this._comp }
        this._comp = comp;
        return this;
    }

    attrs(config){
        if(arguments.length < 1){return this._comp?.attrs()}
        this._comp?.attrs(config);
        return this;
    }

    classes(names){
        if(arguments.length < 1){return this._comp?.classes()}
        this._comp?.classes(names);
        return this;
    }

    html (text) {
        if(arguments.length < 1){return this._comp?.html()}
        this._comp?.html(text);
        return this;
    }

    styles(config){
        if(arguments.length < 1){return this._comp?.styles()}
        this._comp?.styles(config);
        return this;
    }

    tag (tag) {
        if(arguments.length < 1){return this._comp?.tag()}
        this._comp?.tag(tag);
        return this;
    }
}