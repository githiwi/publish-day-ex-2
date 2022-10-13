const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try { 
        this.puppeteer.close(); 
    } catch (e) 
    {} 
    done();
});

describe("HTML Structure", () => {
    it("Index file should contain appropriate meta tags", async () => {
        const metaTags = await page.$$('meta');
        expect(metaTags.length).toBeGreaterThan(1);
    });
    it("Index file Should contain a title tag that is not empty", async () => {
        const title = await page.$eval('title', el => el.innerHTML); 
        expect(title).toMatch(/\S/);
    });
});
describe('Table', () => { 
    it("Table exists", async () => {
        const table = await page.$('table');
        expect(table).toBeTruthy();
    });
    it("Table has 3 columns", async () => {
        const td = await page.$$('table tr:first-child > td, table tr:first-child > th');
        expect(td.length).toBe(3);
    });
    it("Table contains rows", async () => {
        const rows = await page.$$('tr');
        expect(rows.length).toBeGreaterThan(2);
    });
    it("Table contains correct number of table heads that contain column titles", async () => {
        const head = await page.$$('th');
        const headData = await page.$$eval('th', el => el[0].innerHTML);
        const headData1 = await page.$$eval('th', el => el[1].innerHTML);
        const headData2 = await page.$$eval('th', el => el[2].innerHTML);
        expect(head.length).toBeGreaterThan(2);
        expect(headData).toEqual(expect.any(String));
        expect(headData1).toEqual(expect.any(String));
        expect(headData2).toEqual(expect.any(String));
    });

    it("Table should be styled in zebra look", async () => {
        const trBackgroundColor = await page.$$eval('*', el => el.map(e => getComputedStyle(e).backgroundColor));
        expect(trBackgroundColor.filter((v, i, a) => a.indexOf(v) === i).length).toBeGreaterThan(1); // page should contain at least 2 different background colors
    });
});