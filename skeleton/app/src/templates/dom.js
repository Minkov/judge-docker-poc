import htm from '../../node_modules/htm/dist/htm.module.js';


export default htm.bind((type, props, ...children) => e(type, children, props));

const attrMap = {
    'class': 'className',
    'for': 'htmlFor'
};

/**
 * Create DOM element
 * @param {string} type Tag name
 * @param {*} content Child or array of children
 * @param {*} attributes Attribute descriptor
 * @returns {Node}
 */
export function e(type, content, attributes) {
    const result = document.createElement(type);

    if (attributes) {
        for (let attr of Object.keys(attributes)) {
            result[attrMap[attr] || attr] = attributes[attr];
        }
    }

    result.append = append.bind(result);

    result.appendTo = (parent) => {
        parent.append(result);
        return result;
    };

    if (content !== undefined && content !== null) {
        result.append(content);
    }
    return result;
}

function append(child) {
    if (typeof (child) === 'string' || typeof (child) === 'number') {
        if (child.toString().trim()[0] === '<') {
            this.innerHTML = child;
        } else {
            child = document.createTextNode(child);
            this.appendChild(child);
        }
    } else if (Array.isArray(child)) {
        for (let node of child) {
            this.append(node);
        }
    } else {
        this.appendChild(child);
    }
    return this;
}

export function replaceContents(node, newContents) {
    const cNode = node.cloneNode(false);
    append.call(cNode, newContents);
    node.parentNode.replaceChild(cNode, node);

    return cNode;
}

export function swap(oldNode, newNode) {
    oldNode.parentNode.replaceChild(newNode, oldNode);
}

export function span(content, attributes) {
    return e('span', content, attributes);
}

export function div(content, attributes) {
    return e('div', content, attributes);
}

export function tr(content, attributes) {
    return e('tr', content, attributes);
}

export function td(content, attributes) {
    return e('td', content, attributes);
}

export function table(data, layout) {
    const thead = e('thead', tr(layout.map(h => e('th', h.label))));
    const tbody = e('tbody', data.map(r => tr(layout.map(h => td(r[h.name])))));

    const table = e('table', [thead, tbody]);
    table.thead = thead;
    table.tbody = tbody;

    return table;
}


export function a(href, label, attributes) {
    return e('a', label, Object.assign({ href }, attributes));
}

export function input(attributes) {
    return e('input', '', attributes);
}

export function button(label, callback, attributes) {
    const element = e('button', label, attributes);
    element.addEventListener('click', callback);
    return element;
}

export function checkbox(onChange, attributes) {
    const element = input(Object.assign({}, attributes, { type: 'checkbox' }));
    element.addEventListener('change', onChange);
    return element;
}

export function loading() {
    const node = e('div', [
        e('div', null, { classList: 'sk-cube sk-cube1 label' }),
        e('div', null, { classList: 'sk-cube sk-cube2 label' }),
        e('div', null, { classList: 'sk-cube sk-cube3 label' }),
        e('div', null, { classList: 'sk-cube sk-cube4 label' }),
        e('div', null, { classList: 'sk-cube sk-cube5 label' }),
        e('div', null, { classList: 'sk-cube sk-cube6 label' }),
        e('div', null, { classList: 'sk-cube sk-cube7 label' }),
        e('div', null, { classList: 'sk-cube sk-cube8 label' }),
        e('div', null, { classList: 'sk-cube sk-cube9 label' }),
    ], { classList: 'sk-cube-grid' });

    return node;
}