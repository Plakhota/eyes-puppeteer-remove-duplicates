'use strict';

const {
    VisualGridRunner,
    RunnerOptions,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo,
    BrowserType,
    DeviceName,
    ScreenOrientation
} = require('@applitools/eyes-puppeteer');
const puppeteer = require('puppeteer')

let eyes;

const haveSameApplitoolsBaseline = (result1, result2)=>{
    //baseline is defined by testName (name), appName, Browser (hostApp), OS (hostOS - chosen by the Ultrafast Grid), viewportSize
    return result1.getTestResults().name == result2.getTestResults().name 
        && result1.getTestResults().appName == result2.getTestResults().appName 
        && result1.getTestResults().hostApp == result2.getTestResults().hostApp
        && result1.getTestResults().hostOS == result2.getTestResults().hostOS
        && result1.getTestResults().hostDisplaySize.height == result2.getTestResults().hostDisplaySize.height
        && result1.getTestResults().hostDisplaySize.width == result2.getTestResults().hostDisplaySize.width
}

describe('Demo App - Ultrafast Grid - Puppeteer', function () {
    let browser, page;
    const runner = new VisualGridRunner(new RunnerOptions().testConcurrency(5));

    // Initialize the eyes configuration
    const configuration = new Configuration();

    before(async () => {
        //create a new batch info instance and set it to the configuration
        configuration.setBatch(new BatchInfo('Applitools Ultrafast Grid Puppeteer tests with removing retry-duplicates from the Batch'))

        // Add browsers with different viewports
        configuration.addBrowser(800, 600, BrowserType.CHROME);
        configuration.addBrowser(700, 500, BrowserType.FIREFOX);
        // configuration.addBrowser(1600, 1200, BrowserType.IE_11);
        // configuration.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
        // configuration.addBrowser(800, 600, BrowserType.SAFARI);

        // Add mobile emulation devices in Portrait mode
        // configuration.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
        // configuration.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
    })

    beforeEach(async () => {
        // Initialize the puppeteer browser
        browser = await puppeteer.launch({
            headless: process.env.CI || false
        });

        page = await browser.newPage();

        // Create Eyes object with the VisualGridRunner, meaning it'll be a Visual Grid eyes.
        eyes = new Eyes(runner);
        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });


    it('ultraFastTest', async () => {

        // Navigate to the url we want to test
        // ⭐️ Note to see visual bugs, run the test using the above URL for the 1st run.
        // but then change the above URL to https://demo.applitools.com/index_v2.html
        // (for the 2nd run)
        await page.goto('https://demo.applitools.com/index_v2.html');


        // Call Open on eyes to initialize a test session
        await eyes.open(page, 'Ironsouece Delete Dupllicates Demo App - Puppeteer - Ultrafast Grid', 'Smoke Test', new RectangleSize(800, 600));

        // check the login page with fluent api, see more info here
        // https://applitools.com/docs/topics/sdk/the-eyes-sdk-check-fluent-api.html
         await eyes.check('Login Window', Target.window().fully());

        // Call Close on eyes to let the server know it should display the results
        eyes.close(false);
    });

    it('ultraFastTest1', async () => {

        // Navigate to the url we want to test
        // ⭐️ Note to see visual bugs, run the test using the above URL for the 1st run.
        // but then change the above URL to https://demo.applitools.com/index_v2.html
        // (for the 2nd run)
        await page.goto('https://demo.applitools.com');
        await page.waitForTimeout(4000)

        // Call Open on eyes to initialize a test session
        await eyes.open(page, 'Ironsouece Delete Dupllicates Demo App - Puppeteer - Ultrafast Grid', 'Smoke Test', new RectangleSize(800, 600));

        await eyes.check('Login Window', Target.window().fully());

        // Call Close on eyes to let the server know it should display the results
        eyes.close(false);
    });

    afterEach(async () => {
        await browser.close()
    });

    after(async() => {
        const results = await runner.getAllTestResults(false);

        //Find and delete duplicate tests: keep the last try. Delete unsuccessful first try
        for(const potentialFirstTry of results.getAllResults()) {
            if (potentialFirstTry.getTestResults().steps == 0) {continue;} //for empty tests (no eyes.check), no entry added in the dashboard; can be safely ignored.

            if (!potentialFirstTry.getTestResults().isPassed()) {
                //if a result is not passed (failed, aborted, unresolved) - look for a retry (a later run of the same Applitools test case). 
                for (const potentialRetry of results.getAllResults()) {
                    if (haveSameApplitoolsBaseline(potentialFirstTry, potentialRetry)
                        && potentialFirstTry.getTestResults().startedAt < potentialRetry.getTestResults().startedAt){
                            await potentialFirstTry.getTestResults().delete() //delete the first try, keep the retry
                            break; //there can be more than one retry, but we are not removing the retries. Rather removing the first try
                        }
                }   
            }
        }
    })
});

