
export default (function (window) {
	'use strict';

	if (!window.document) {
		throw new Error("window.document is undefined");
	}

    const namespaceURI = "xhtml";
    const xhtml = "http://www.w3.org/1999/xhtml";

    const namespace_domain = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    }

    function get_namespace_domain (name) {
		let prefix = name += "", i = prefix.indexOf(":");
		if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
		return namespace_domain.hasOwnProperty(prefix) ? {space: namespace_domain[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
	}
	
	function creator (name, uri) {
        let match_uri = get_namespace_domain(name);
        //console.log(match_uri)
        return function() {
            let document = window.document;
            uri = match_uri !== name && typeof match_uri === "object" ? match_uri.space :  uri || namespaceURI;
            return uri === xhtml && document.documentElement.namespaceURI === xhtml
                ? document.createElement(name)
                : document.createElementNS(uri, name);
        };
    }

    function before (before, ele) {
        return ele.parentNode.insertBefore(before, ele);
    }

    function after (afterNode, ele){
        let mark = ele.nextSibling;
        return ele.parentNode.insertBefore(afterNode, mark);
    }

    function append (appendNode, ele) {
        return ele.appendChild(appendNode);
    }

    function prepend(prependNode, ele) {
        return ele.insertBefore(prependNode, ele.firstChild);
    }

    function replace(replaceNode, ele){
        let mark = el.nextSibling;

        ele.parentNode.removeChild(ele);
        return mark.parentNode.insertBefore(replaceNode, mark);        
    }

    function clone (ele) {
        return ele.cloneNode(true)
    }

    function select (query, context) {
		let map,
			found,
			set = [];

		if (map = /^([#\.\w]+(\[.+\])?)\s+([#\.\w]+(\[.+\])?)$/.exec(query)) {
			return select(map[3], map[1]); // re-phrase
		} else if (!context) {
			context = window.document; // default context
		} else if (!isEl(context) && !isDoc(context)) {
			context = select(context)[0]; // select context
		}

		// #id
		if (map = /^#([\w\-]+)$/.exec(query)) {
			return (set = context.getElementById(map[1])) ? [set] : [];
		}

		// [1] -> tag [2] -> tag.class [3] -> .class
		map = /^(?:([\w]+)|([\w]+)?\.([\w\-]+))$/.exec(query);

		if (!map) { return context.querySelectorAll(query); } // fallback
		if (map[1]) { return context.getElementsByTagName(map[1]); } // tag

		found = context.getElementsByClassName(map[3]);

		if (!map[2]) { return found; } // .class

		for (let i = 0, len = found.length; i < len; i++) {
			if (found[i].nodeName === map[2].toUpperCase()) {
				set.push(found[i]);
			}
		}

		return set; // tag.class
	}

    function isFocused (element) {
        return element === document.activeElement;
    }

    function style(element, style){
        element.style = style;
    }

    function type (val) {
		return (val !== null && val !== undefined)
			? typeMap[toString.call(val)] || 'object'
			: String(val);
	}

    let types = 'Boolean Number String Function Array Date RegExp NodeList HTMLCollection Object';
	let typeMap = [];

    function defaultView(node) {
        return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
            || (node.document && node) // node is a Window
            || node.defaultView; // node is a Document
    }

    return {
        creator, clone,get_namespace_domain,
        after, before,append,prepend,replace,
        select,isFocused,
        style, type, defaultView,
    };

})(window);