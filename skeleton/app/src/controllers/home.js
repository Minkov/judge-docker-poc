import { getAll } from '../api/data.js';
import homePage from '../templates/homePage.js';

export async function home(ctx) {
    const data = await getAll();
    const element = homePage(data);
    ctx.render(element);
}