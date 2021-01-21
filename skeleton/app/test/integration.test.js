const { chromium } = require('playwright');
const { expect } = require('chai');

const mockData = require('./mock-data.json');


function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
}

let browser;
let context;
let page;

describe('Integration tests', function () {
    this.timeout(6000);

    before(async () => {
        //browser = await chromium.launch({ headless: false });
        browser = await chromium.launch();
    });

    before(async () => {
        console.log('second before');
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();

        // block intensive resources and external calls (page routes take precedence)
        await context.route('**/*.{png,jpg,jpeg}', route => route.abort());
        await context.route(url => {
            // Verbose output
            //if (url.hostname != 'localhost') { console.log('aobrting'); }
            return url.hostname != 'localhost';
        }, route => route.abort());

        page = await context.newPage();
        // Verbose output
        /*
        page.on('request', request => {
            if (request.url().includes('.') && request.url().includes('localhost')) { return; }
            console.log(request.method(), request.url());
        });
        */
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    describe('Home page', () => {
        it('loads static page', async () => {
            await page.goto('http://localhost:8080/static.html');
            await page.waitForSelector('#wrapper');
        });

        it('loads and renders content from API', async () => {
            page.route('**/data/articles', route => route.fulfill(json(mockData)));

            await page.goto('http://localhost:8080');

            await page.waitForSelector('div.content');

            const titles = await Promise.all((await page.$$('div.content>section>h2')).map(s => s.textContent()));
            expect(titles.length).to.equal(3);
            expect(titles[0]).to.contains('C#');
            expect(titles[1]).to.contains('Java');
            expect(titles[2]).to.contains('JavaScript');
        });
    });

    describe('Authentication', () => {
        it('register makes correct API call', async () => {
            const endpoint = '**/users/register';
            const email = 'john@abv.bg';
            const password = '123456';

            page.route(endpoint, route => route.fulfill(json({ email, password, objectId: '0001' })));

            await page.goto('http://localhost:8080/register');

            await page.waitForSelector('form');

            await page.fill('input[name="email"]', email);
            await page.fill('input[name="password"]', password);
            await page.fill('input[name="repass"]', password);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.email).to.equal(email);
            expect(postData.password).to.equal(password);
        });

        it('login makes correct API call', async () => {
            const endpoint = '**/users/login';
            const email = 'john@abv.bg';
            const password = '123456';

            page.route(endpoint, route => route.fulfill(json({ email, password, 'user-token': 'AAAA', objectId: '0001' })));

            await page.goto('http://localhost:8080/login');

            await page.waitForSelector('form');

            await page.fill('input[name="email"]', email);
            await page.fill('input[name="password"]', password);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.login).to.equal(email);
            expect(postData.password).to.equal(password);
        });
    });

    describe('CRUD', () => {
        const email = 'john@abv.bg';
        const password = '123456';


        /* Login user */
        beforeEach(async () => {
            const endpoint = '**/users/login';

            page.route(endpoint, route => route.fulfill(json({ email, password, 'user-token': 'AAAA', objectId: '0002' })));

            await page.goto('http://localhost:8080/login');

            await page.waitForSelector('form');

            await page.fill('input[name="email"]', email);
            await page.fill('input[name="password"]', password);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            await page.waitForNavigation();
            await page.waitForLoadState();
        });


        it('create makes correct API call for logged in user', async () => {
            const endpoint = '**/data/articles';
            const title = 'Title1';
            const category = 'Category1';
            const content = 'Content1';

            page.route(endpoint, route => route.fulfill(json({ title, category, content, objectId: '0001' })));

            await page.goto('http://localhost:8080/create');

            await page.waitForSelector('form');

            await page.fill('input[name="title"]', title);
            await page.fill('input[name="category"]', category);
            await page.fill('[name="content"]', content);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.title).to.equal(title);
            expect(postData.category).to.equal(category);
            expect(postData.content).to.equal(content);
            expect(postData.authorEmail).to.equal(email);
        });

        it('edit loads correct article data for logged in user', async () => {
            const endpoint = '**/data/articles/0001';
            const mock = {
                title: 'Title1',
                category: 'Category1',
                content: 'Content1',
                objectId: '0001',
                ownerId: '0002'
            };

            page.route(endpoint, route => route.fulfill(json(mock)));

            await page.goto('http://localhost:8080/edit/0001');

            await page.waitForSelector('form');

            const title = await page.$eval('input[name="title"]', e => e.value);
            const category = await page.$eval('input[name="category"]', e => e.value);
            const content = await page.$eval('[name="content"]', e => e.value);

            expect(title).to.equal(mock.title);
            expect(category).to.equal(mock.category);
            expect(content).to.equal(mock.content);
        });

        it('edit makes correct API call for logged in user', async () => {
            const endpoint = '**/data/articles/0001';
            const mock = {
                title: 'Title1',
                category: 'Category1',
                content: 'Content1',
                objectId: '0001',
                ownerId: '0002'
            };

            page.route(endpoint, route => route.fulfill(json(mock)));

            await page.goto('http://localhost:8080/edit/0001');

            await page.waitForResponse(endpoint);
            await page.waitForSelector('form');

            await page.fill('input[name="title"]', 'new' + mock.title);
            await page.fill('input[name="category"]', 'new' + mock.category);
            await page.fill('[name="content"]', 'new' + mock.content);

            const [response] = await Promise.all([
                page.waitForResponse(endpoint),
                page.click('[type="submit"]')
            ]);

            const postData = JSON.parse(response.request().postData());
            expect(postData.title).to.equal('new' + mock.title);
            expect(postData.category).to.equal('new' + mock.category);
            expect(postData.content).to.equal('new' + mock.content);
            expect(postData.authorEmail).to.equal(email);
        });

        it('delete makes correct API call for logged in user', async () => {
            const endpoint = '**/data/articles/0001';

            await page.goto('http://localhost:8080/delete/0001');

            const request = await page.waitForRequest(endpoint);
            expect(request.method()).to.equal('DELETE');
        });
    });
});
