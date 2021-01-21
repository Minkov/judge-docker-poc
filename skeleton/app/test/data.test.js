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

describe('Data layer tests', function () {
    this.timeout(0);

    before(async () => {
        //browser = await chromium.launch({ headless: false });
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();

        // block external calls, unless mocked (page routes take precedence)
        await context.route(url => url.hostname != 'localhost', route => route.abort());

        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    it('getAll() calls correct endpoint', async () => {
        const endpoint = '**/data/articles';
        page.route(endpoint, route => route.fulfill(json([])));

        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('GET');
        });
        await page.evaluate(async () => await window.api.getAll());
        expect(called).to.be.true;
    });

    it('getArticleById() calls correct endpoint', async () => {
        const endpoint = '**/data/articles/0001';
        page.route(endpoint, route => route.fulfill(json(mockData[0])));

        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('GET');
        });
        await page.evaluate(async () => await window.api.getArticleById('0001'));
        expect(called).to.be.true;
    });

    it('createArticle() calls correct endpoint', async () => {
        const endpoint = '**/data/articles';
        const mock = {
            'title': 'Arrays',
            'category': 'C#',
            'content': 'Content1',
            'authorEmail': 'peter@abv.bg',
        };
        page.route(endpoint, route => route.fulfill(json(mock)));


        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('POST');
        });
        await page.evaluate(async (mock) => await window.api.createArticle(mock), mock);
        expect(called).to.be.true;
    });

    it('createArticle() sends correctly shaped body', async () => {
        const endpoint = '**/data/articles';
        const mock = {
            'title': 'Arrays',
            'category': 'C#',
            'content': 'Content1',
            'authorEmail': 'peter@abv.bg',
        };
        page.route(endpoint, route => route.fulfill(json(mock)));

        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('POST');
            const body = JSON.parse(request.postData());
            expect(body.title).to.equal(mock.title);
            expect(body.category).to.equal(mock.category);
            expect(body.content).to.equal(mock.content);
            expect(body.authorEmail).to.equal(mock.authorEmail);
        });
        await page.evaluate(async (mock) => await window.api.createArticle(mock), mock);
        expect(called).to.be.true;
    });

    it('editArticle() calls correct endpoint', async () => {
        const endpoint = '**/data/articles/0001';
        const mock = {
            'title': 'Arrays',
            'category': 'C#',
            'content': 'Content1',
            'authorEmail': 'peter@abv.bg',
        };
        page.route(endpoint, route => route.fulfill(json(mock)));

        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('PUT');
        });
        await page.evaluate(async (mock) => await window.api.editArticle('0001', mock), mock);
        expect(called).to.be.true;
    });

    it('editArticle() sends correctly shaped body', async () => {
        const endpoint = '**/data/articles/0001';
        const mock = {
            'title': 'Arrays',
            'category': 'C#',
            'content': 'Content1',
            'authorEmail': 'peter@abv.bg',
        };
        page.route(endpoint, route => route.fulfill(json(mock)));

        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('PUT');
            const body = JSON.parse(request.postData());
            expect(body.title).to.equal(mock.title);
            expect(body.category).to.equal(mock.category);
            expect(body.content).to.equal(mock.content);
            expect(body.authorEmail).to.equal(mock.authorEmail);
        });
        await page.evaluate(async (mock) => await window.api.editArticle('0001', mock), mock);
        expect(called).to.be.true;
    });

    it('deleteArticle() calls correct endpoint', async () => {
        const endpoint = '**/data/articles/0001';
        page.route(endpoint, route => route.fulfill(json(mockData[0])));

        await page.goto('http://localhost:8080/data.html');

        await page.waitForLoadState();
        let called = false;
        page.waitForRequest(endpoint).then(request => {
            called = true;
            expect(request.method()).to.equal('DELETE');
        });
        await page.evaluate(async () => await window.api.deleteArticle('0001'));
        expect(called).to.be.true;
    });
});
