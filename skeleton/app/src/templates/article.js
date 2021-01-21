import html from './dom.js';

export default article => html`
<article>
    <h3>${article.title}</h3>
    <p>${article.content}</p>
    <a href="/details/${article.objectId}" class="btn details-btn">Details</a>
</article>`;