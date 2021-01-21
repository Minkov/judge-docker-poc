import html from './dom.js';

export default () => html`   
<div class="container auth">
    <form action="/register" method="POST">
        <fieldset>
            <legend>Register</legend>
            <blockquote>Knowledge is not simply another commodity. On the contrary. Knowledge is never used up.
                It increases by diffusion and grows by dispersion.</blockquote>
            <p class="field email">
                <input type="text" id="email" name="email" placeholder="maria@email.com" />
                <label for="email">Email:</label>
            </p>
            <p class="field password">
                <input type="password" name="password" id="register-pass" />
                <label for="register-pass">Password:</label>
            </p>
            <p class="field password">
                <input type="password" name="repass" id="repass" />
                <label for="repass">Repeat password:</label>
            </p>
            <p class="field submit">
                <button class="btn submit" type="submit">Register</button>
            </p>
            <p class="field">
                <span>If you already have profile click <a href="/login">here</a></span>
            </p>
        </fieldset>
    </form>
</div>`;