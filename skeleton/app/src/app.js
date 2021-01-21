import page from '../node_modules/page/page.mjs';
import { bindHeader } from './controllers/header.js';
import { home } from './controllers/home.js';
import { login, register, logout } from './controllers/user.js';
import { create, details, edit, deleteArticle, loadArticle } from './controllers/article.js';


window.addEventListener('load', () => {
    const wrapper = document.getElementById('wrapper');
    const nav = document.getElementById('nav');
    page('*', (ctx, next) => {
        ctx.render = render;
        next();
    }, userSession, bindHeader(nav));

    page('/', home);
    page('/details/:id', loadArticle, details);
    page('/create', create);
    page('/edit/:id', loadArticle, edit);
    page('/delete/:id', deleteArticle);
    page('/login', login);
    page('/register', register);
    page('/logout', logout);

    page.start();

    function render(element) {
        wrapper.innerHTML = '';
        wrapper.appendChild(element);
    }

    function userSession(ctx, next) {
        const user = {
            userToken: sessionStorage.getItem('userToken'),
            email: sessionStorage.getItem('email'),
            userId: sessionStorage.getItem('userId')
        };
        if (Object.values(user).some(v => v === null) === false) {
            ctx.user = user;
        }
        next();
    }
});