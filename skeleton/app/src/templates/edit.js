import html from './dom.js';

export default (article) => html`
<div class="container">
    <form action="#" method="">
        <fieldset>
            <legend>Edit article</legend>
            <p class="field title">
                <input type="text" name="title" id="title" placeholder="Arrays" value=${article.title} />
                <label for="title">Title:</label>
            </p>

            <p class="field category">
                <input type="text" name="category" id="category" placeholder="JavaScript" value=${article.category} />
                <label for="category">Category:</label>
            </p>
            <p class="field content">
                <textarea name="content" id="content" value=${article.content} ></textarea>
                <label for="content">Content:</label>
            </p>

            <p class="field submit">
                <button class="btn submit" type="submit">Edit</button>
            </p>

        </fieldset>
    </form>
</div>`;