import html from './dom.js';
import article from './article.js';

export default ({name, articles}) => html`
<section>
    <h2>${name}</h2>
    <div class="articles">
        ${articles.map(article)}
    </div>
</section>`;