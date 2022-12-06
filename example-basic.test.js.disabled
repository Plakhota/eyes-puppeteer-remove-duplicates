const puppeteer = require('puppeteer')
const { Eyes, Target } = require('@applitools/eyes-puppeteer');

describe('Demo App - Basic', function () {
  let eyes;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI || false
    });

    page = await browser.newPage();

    // Create Eyes object

    eyes = new Eyes();

    // Optional: Set batch name for tests

    eyes.setBatch({ name: 'Demo Batch - Puppeteer - Basic' });
  });


  it('Smoke Test', async () => {
    // Navigate to the url we want to test
    // ⭐️ Note to see visual bugs, run the test using the above URL for the 1st run.
    // but then change the above URL to https://demo.applitools.com/index_v2.html
    // (for the 2nd run)
    
    await page.goto('https://demo.applitools.com');

    // Call Open on eyes to initialize a test session

    await eyes.open(page, 'Demo App - Puppeteer - Basic', 'Smoke Test - Puppeteer - Basic')

    // check the login page with fluent api, see more info here
    // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html

    await eyes.check('Login Window', Target.window().fully());

    // Click the 'Log in' button.

    await page.click('#log-in');

    // Check the app page

    await eyes.check('App Window', Target.window().fully());

    // Call Close on eyes to let the server know it should display the results
    
    const results = await eyes.close();

    console.log('Basic Results', results);
  });

  afterEach(async () => {
    // Close the browser
    await browser.close()

    // If the test was aborted before eyes.close was called, ends the test as aborted.
    
    await eyes.abort();
  });
});
