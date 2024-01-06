export default class Identity {
    static split(path){
        if(!path){return}
        const reg = /(.+)\/([^\/]+$)/
        const items = path.match(reg)
        if(!items || !items[1]){return [];}
        return [items[1],items[2]];
    }
    
    static build(childName, parentPath){
        childName = childName || "__"
        if(!parentPath){return childName}
        return `${parentPath}/${childName}`;
    }

    static level (path) {
        let reg = /\//ig
        let r = path.match(reg);
        return r ? r.length : 0;
    }

    static new (id, path) {
        return new Identity(id, path);
    }

    static contain (big, small){
        return big.includes(small);
    }

    static path (id) {
        let [path,_] = this.split(id);
        return path;
    }


    constructor (id, path){
        let [parent, short] = Identity.split(id);
        if(path) {
            if(parent){throw new Error("The id is path, but the path isn't null")}
            this._short = id;            
            this._path = path;
        }
        else {
            this._path = parent;
            this._full = id;
            this._short = short || id;
        }
    }

    get full () {
        if(!this._full){ 
            this._full = Identity.build(this._short, this._path);
        }
        return this._full
    }

    get short () {
        return this._short
    }

    get level () {
        return Identity.level(this._full);
    }

    get path () {
        return this._path;
    }
}
