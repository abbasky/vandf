import Van from "./van";
import Node from "./node";

export default class Sibline {

    static new (componentId, parent, prev) {
        return new this(componentId, parent, prev);
    }

    static attach(componentId, elements) {
        const sibline = this.new(componentId);
        sibline.bind(elements);
        sibline.update();
    }

    constructor(componentId, parent, prev) {//node
        this._componentId = componentId;
        this._parent = parent;
        this._prev = prev;
        
        this._nodes = [];
        this._destroys = [];

        this._started = false;

        let comp = Van.get(this.componentId);
        let model = comp.model();
        this._model = model
            ? new model(comp.data(), parent?.model, this._doc)
            : undefined;
    }

    _destroy () {
        this._nodes.forEach((node) => {
            node._destroy();
        })
    }

    get above () {
        let kid = this;
        let last = kid.last;
        while(kid && !last){
            kid = kid.prev;
            if(kid){last = kid.last}
        }
        return last;
    }

    get componentId () {
        return this._componentId;
    }

    get data () {
        return this._data
    }
    
    get isSingle () {
        return this._isSingle;
    }

    get last () {
        let len = this._nodes.length;
        if(len > 0){return this._nodes[len-1]}
    }

    get lastHasElement () {
        for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];
            if(!node.empty()){return node}
        }
    }

    get model () {
        return this._model;
    }

    get nodes () {
        return this._nodes;
    }

    get total () {
        return this._data?.length || 0;
    }

    get parent () {
        return this._parent;
    }

    get prev () {
        return this._prev;
    } 

    get proxy () {
        return this.$proxy;
    }

    get textSize () {
        let size = 0;
        this._nodes.forEach(node => {
            size = size + node.textSize;
        });
        return size;
    }

    get views () {
        return this._views;
    }

    bind (elements) {
        if(!elements || !Array.isArray(elements) || elements.length === 0){return this}
        let nodes = this._nodes;
        let index = 0;
        elements.forEach((ele) => {
            const node = Node.new(this, index, ele);
            nodes.push(node)
            index = index + 1;
        })
    }


    get (index) {
        let len = this._nodes.length;
        if(index >= len){throw new Error("The index is over max size")}
        return this._nodes[index];
    }

    index (node) {
        let nodes = this._nodes;
        for (let i = 0; i < nodes.length; i++) {
            if(node === nodes[i]){return i}
        }
    }

    // on (type, fn) {
    //     this.$proxy.on(type,fn);
    //     return this;
    // }

    update () {
        let pdatum = this._parent?.datum;
        let data;
        if(this._model){
            if(this._model.data){data = this._model.data(pdatum, this.parent?.states)}
        }else{
            let comp = Van.get(this.componentId);
            let datainit = comp.data();
            if(datainit){
                if(typeof datainit === 'function'){
                    data = datainit(pdatum);
                }else{
                    data = datainit;
                }
            }else{
                data = pdatum;
            }
        }
        if(Array.isArray(data)){
            this._isSingle = false;           
        }else{
            data = [data];
            this._isSingle = true;
        }
        this._data = data;
        //console.log(this.componentId, data)
        let len_d = data.length;
        let nodes = this._nodes;
        let len_n = nodes.length;
        
        let len_min = len_d > len_n ? len_n : len_d;

        //1.先删除该删除的节点（写）
        for (let i = len_min; i < len_n; i++) {
            let node = nodes.pop();
            node._destroy();
            // console.log(node.id,"destroy",node.datum())
        }

        //2.运算更新各类状态（读）

        //3.设置已有节点及其子节点的内容（写）
        for (let i = 0; i < len_min; i++) {
            const node = nodes[i];
            
        }

        //4.创建节点及子节点（写）

        //创建节点并根据数据更新样式和内容的值，不刷新界面
        for (let i = len_min; i < len_d; i++) {
            const node = Node.new(this, i);
            nodes.push(node);
        }

        //更新状态和样式等
        // for (let i = 0; i < len_min; i++) {
        //     const node = nodes[i];
            
        // }

        

        

        

        for (let i = 0; i < len_d; i++) {
            nodes[i]._update(data[i]);
            //
        }

        return this;
    }
}