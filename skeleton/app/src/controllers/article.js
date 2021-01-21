import articleDetails from '../templates/details.js';
import createForm from '../templates/create.js';
import editForm from '../templates/edit.js';
import handle from './form.js';
import { checkResult, createArticle, getArticleById, editArticle, deleteArticle as apiDelete } from '../api/data.js';
import { showInfo, showError } from '../notification.js';


export function create(ctx) {
    const element = createForm();
    handle(element, data => onCreate(ctx, data));
    ctx.render(element);
}

async function onCreate(ctx, params) {
    if (ctx.user === undefined) {
        ctx.page.redirect('/login');
    } else if (Object.values(params).some(v => v.length == 0)) {
        showError('All fields are required');
    } else {
        try {
            const result = await createArticle({
                title: params.title,
                category: params.category,
                content: params.content,
                authorEmail: ctx.user.email
            });

            checkResult(result);

            showInfo('Article created');
            ctx.page.redirect('/');
        } catch (err) {
            showError(err.message);
        }
    }
}

export async function loadArticle(ctx, next) {
    const article = await getArticleById(ctx.params.id);
    ctx.article = article;
    next();
}

export function details(ctx) {
    ctx.render(articleDetails(ctx.article, ctx.user ? ctx.user.userId : undefined));
}

export function edit(ctx) {
    const element = editForm(ctx.article);
    handle(element, data => onEdit(ctx, data));
    ctx.render(element);
}

async function onEdit(ctx, params) {
    if (ctx.user === undefined) {
        ctx.page.redirect('/login');
    } else if (Object.values(params).some(v => v.length == 0)) {
        showError('All fields are required');
    } else {
        try {
            const result = await editArticle(ctx.article.objectId, {
                title: params.title,
                category: params.category,
                content: params.content,
                authorEmail: ctx.user.email
            });

            checkResult(result);

            showInfo('Article updated');
            ctx.page.redirect('/');
        } catch (err) {
            showError(err.message);
        }
    }
}

export async function deleteArticle(ctx) {
    try {
        const result = await apiDelete(ctx.params.id);
        checkResult(result);

        showInfo('Article deleted');
        ctx.page.redirect('/');
    } catch (err) {
        showError(err.message);
    }
}