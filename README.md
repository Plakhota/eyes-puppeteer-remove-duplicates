# Applitools Tutorial - Puppeteer

Get started with Applitools Eyes visual testing with these examples of using the [Puppeteer](https://pptr.dev/) and the [Eyes Puppeteer SDK](https://www.npmjs.com/package/@applitools/eyes-puppeteer).

- [Quick Start](#%EF%B8%8F-quick-start)
- [Running Tests Locally](#-running-the-tests-locally)
- [What's Inside](#-whats-inside)
- [Add Applitools Eyes to your Puppeteer project](#-add-applitools-eyes-to-your-puppeteer-project)

## ⚡️ Quick Start

Run your first test in just a few minutes by cloning this repository!

1. Click the **Use this template** button at the top of the repository or [click here](https://github.com/applitools/tutorial-puppeteer/generate) to create a new repository
2. Add your Applitools API Key as a [repository Secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) under the Settings tab called `APPLITOOLS_API_KEY`
3. Navigate to the Actions tab, find and select the CI workflow, and select Run Workflow

And that's it! Your tests should now be available to review in the Applitools dashboard.

## 🚀 Running the Tests Locally

### Installing Dependencies
```
npm install
```

### Set Applitools API Key

Before running your test, you need to make your API key available to the environment. You can do this by either prepending your test command or exporting it in your terminal session.

To prepend, run you a command like `npm test` as:

```
APPLITOOLS_API_KEY="[Your Key]" npm test
```

To export your API key on a Mac, run:

```
export APPLITOOLS_API_KEY="[Your Key]"
```

To export your API key on Windows, run:

```
set APPLITOOLS_API_KEY="[Your Key]"
```

### Running Tests
```
npm test
```

Learn more about Applitools [Eyes](https://info.applitools.com/ucY77) and the [Ultrafast Test Cloud](https://info.applitools.com/ucY78) at [applitools.com](https://info.applitools.com/ucY76).

More about the Eyes Puppeteer SDK:
* https://www.npmjs.com/package/@applitools/eyes-puppeteer
* https://applitools.com/docs/api/eyes-sdk/index-gen/classindex-puppeteer-javascript.html


## Remove duplicates
If Mocha is configured to retry a failed test (https://mochajs.org/#retry-tests), then double Applitools test entries may appear in Applitools dashboard, since there were double the calls to eyes.open, eyes.check, eyes,close for the same test case.
In the following test file
https://github.com/Plakhota/eyes-puppeteer-remove-duplicates/blob/main/test/example-ultrafast.test.js 
a loop was added in afterAll hook.
It should run after ```await runner.getAllTestResults(false) //(false means no expection is raised on visual diff)```
The loop looks for pairs of tests that share the same baseline configuration (Applitools test name, app name, OS&browser, viewport size) and deletes the first try, if it was unsuccessful. (Please note the Utility function haveSameApplitoolsBaseline that returns true if two tests have the same baseline).

##How to add duplicate deletion to your suite?
1. The relevant case is a test by test retry with a shared beforeAll, afterAll hook, share Runner object. The Runner object manages all the Eyes result from the describe file. 
2. Use the after hook from the demo suite. Of course, other tear-downs can be added.
3. Make sure the ```haveSameApplitoolsBaseline definition``` is available in the test suite file.
