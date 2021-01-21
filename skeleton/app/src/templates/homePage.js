import html from './dom.js';
import section from './section.js';

export default sections => html`
<div class="content">
    ${sections.length ? sections.map(section) : html`<h3 class="no-articles">No articles yet</h3>`}
</div>`;