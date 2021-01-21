import html from './dom.js';

export default () => html`
<div class="container auth">
    <form action="/login" method="POST">
        <fieldset>
            <legend>Login</legend>
            <blockquote>Knowledge is like money: to be of value it must circulate, and in circulating it can
                increase in quantity and, hopefully, in value</blockquote>
            <p class="field email">
                <input type="text" id="email" name="email" placeholder="maria@email.com" />
                <label for="email">Email:</label>
            </p>
            <p class="field password">
                <input type="password" id="login-pass" name="password" />
                <label for="login-pass">Password:</label>
            </p>
            <p class="field submit">
                <input class="btn submit" type="submit">Log In</input>
            </p>
            <p class="field">
                <span>If you don't have profile click <a href="/register">here</a></span>
            </p>
        </fieldset>
    </form>
</div>`;