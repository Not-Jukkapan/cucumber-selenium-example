const Cucumber = require("@cucumber/cucumber");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const { Builder, By } = require("selenium-webdriver");
const { Given, When, Then, AfterAll } = Cucumber;

async function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

let driver;

Given("I open {string}", async function (url) {
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeService(new chrome.ServiceBuilder(chromedriver.path))
    .build();
  await driver.get(url);
});

When("I enter {string} in search box", async function (searchString) {
  const searchbox = await driver.findElement(By.name("q"));
  await searchbox.sendKeys(searchString);
  await wait(1000);
});

When("I click search button", async function () {
  const searchButton = await driver.findElement(By.name("btnK"));
  await searchButton.click();
  await wait(1000);
});

Then("I should see the expected results", async function () {
  const title = await driver.getTitle();
  if (!title.toLowerCase().includes("selenium")) {
    throw new Error("Expected results not found in the page title.");
  }
});

AfterAll(async function () {
  await wait(3000);
  if (driver) {
    await driver.quit();
  } else {
    console.warn("Driver was not initialized, skipping quit.");
  }
});
