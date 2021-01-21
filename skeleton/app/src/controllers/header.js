import html, { swap } from '../templates/dom.js';


export function bindHeader(element) {
    const nav = {
        'true': html`
        <nav class="nav-buttons">
            <a href="/create">Create</a>
            <a href="/logout">Logout</a>
        </nav>`,
        'false': html`
        <nav class="nav-buttons">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </nav>`
    };
    element.appendChild(nav['false']);

    let lastStatus = false;

    return (ctx, next) => {
        const newStatus = ctx.user !== undefined;
        if (lastStatus != newStatus) {
            swap(nav[lastStatus], nav[newStatus]);
            lastStatus = newStatus;
        }

        next();
    };
}