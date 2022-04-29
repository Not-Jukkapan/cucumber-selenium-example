const Cucumber = require('@cucumber/cucumber');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const { Given, When, Then, AfterAll } = Cucumber;

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
async function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
}

let driver; // ideally have to maintain at cucumber world - for simplicity keeping this here.

Given('I open {string}', async function (url) {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get(url);
});

When('I enter {string} in search box', async function (searchString) {
  const searchbox = await driver.findElement(By.name('q'));
  await searchbox.sendKeys(searchString);
  await wait(1000);
});

When('I click search button', async function () {
  const searchButton = await driver.findElement(By.name('btnK'));
  await searchButton.click();
  await wait(1000);
});

Then('I should see the expected results', function () {
  // TODO: implement assertion logic
});

AfterAll({}, async function (){
  await wait(3000);
  await driver.quit();
});
