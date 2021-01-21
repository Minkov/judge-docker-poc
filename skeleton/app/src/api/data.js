import { beginRequest, endRequest, showError } from '../notification.js';
import API from './api.js';


const endpoints = {
    ARTICLES: 'data/articles',
    ARTICLE_BY_ID: 'data/articles/',
};

const api = new API(
    '553D5398-39BA-3409-FFC3-FE688DFF7D00',
    '3B601CE0-4C4C-4922-AA37-E79F9AD57DFC',
    beginRequest,
    endRequest);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

// get all articles
export async function getAll() {
    const articles = await api.get(endpoints.ARTICLES);
    const byCategory = [];
    articles.forEach(a => {
        let target = byCategory.find(c => c.name == a.category);
        if (target === undefined) {
            target = { name: a.category, articles: [] };
            byCategory.push(target);
        }
        target.articles.push(a);
    });
    return byCategory;
}

// create article
export async function createArticle(article) {
    return api.post(endpoints.ARTICLES, article);
}

// get article by ID
export async function getArticleById(id) {
    return api.get(endpoints.ARTICLE_BY_ID + id);
}

// edit article by ID
export async function editArticle(id, article) {
    return api.put(endpoints.ARTICLE_BY_ID + id, article);
}

// delete article by ID
export async function deleteArticle(id) {
    return api.delete(endpoints.ARTICLE_BY_ID + id);
}

export function checkResult(result) {
    if (result.hasOwnProperty('errorData')) {
        const error = new Error();
        Object.assign(error, result);
        throw error;
    }
}