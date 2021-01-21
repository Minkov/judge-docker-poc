import loginForm from '../templates/login.js';
import registerForm from '../templates/register.js';
import handle from './form.js';
import { register as apiRegister, login as apiLogin, logout as apiLogout, checkResult } from '../api/data.js';
import { showInfo, showError } from '../notification.js';

export function login(ctx) {
    const element = loginForm();
    handle(element, data => onLogin(ctx, data));
    ctx.render(element);

    /*
    // temp test
    document.querySelector('.btn.submit').addEventListener('click', async ev => {
        ev.preventDefault();
        await apiLogin('peter@abv.bg', '123456');
    });
    */
}

async function onLogin(ctx, params) {
    if (Object.values(params).some(v => v.length == 0)) {
        showError('All fields are required');
    } else {
        let result;

        try {
            result = await apiLogin(params.email, params.password);
            checkResult(result);
            showInfo('Successfully logged in');
            ctx.page.redirect('/');
        } catch (err) {
            showError(err.message);
        }
    }
}

export function register(ctx) {
    const element = registerForm();
    handle(element, data => onRegister(ctx, data));
    ctx.render(element);
}

async function onRegister(ctx, params) {
    if (Object.values(params).some(v => v.length == 0)) {
        return;
    } else if (params.password !== params.repass) {
        showError('Passwords don\'t match');
    } else {
        let result;

        try {
            result = await apiRegister(params.email, params.password);
            checkResult(result);
            showInfo('Registration succesful');
            ctx.page.redirect('/');
        } catch (err) {
            showError(err.message);
        }
    }
}

export async function logout(ctx) {
    try {
        const result = await apiLogout();
        checkResult(result);
        showInfo('Logged out');
        ctx.page.redirect('/');
    } catch (err) {
        showError(err.message);
    }
}