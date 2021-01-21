import html from './dom.js';

export default (article, authorId) => html`
<div class="container details">
    <div class="details-content">
        <h2>${article.title}</h2>
        <strong>${article.category}</strong>
        <p>${article.content}</p>
        <div class="buttons">
            ${article.ownerId === authorId ? html`
            <a href="/delete/${article.objectId}" class="btn delete">Delete</a>
            <a href="/edit/${article.objectId}" class="btn edit">Edit</a>
            ` : ''}
            <a href="/" class="btn">Back</a>
        </div>
    </div>
</div>`;