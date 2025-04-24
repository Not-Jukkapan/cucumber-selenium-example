require("dotenv").config();
const Cucumber = require("@cucumber/cucumber");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const { Builder, By, until, Key } = require("selenium-webdriver");
const { Given, When, Then, AfterAll } = Cucumber;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let driver;

Given(
  "I open the Waffle Game login page",
  { timeout: 30000 },
  async function () {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeService(new chrome.ServiceBuilder(chromedriver.path))
      .build();

    await driver.get(process.env.WAFFLE_URL);

    // รอจน input field โผล่ (ช่อง email)
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '//flt-semantics[@id="flt-semantic-node-8"]//input[@data-semantics-role="text-field"]'
        )
      ),
      20000
    );
  }
);
When("I fill in email and password", async function () {
  const emailInput = await driver.findElement(
    By.xpath(
      '//flt-semantics[@id="flt-semantic-node-8"]//input[@data-semantics-role="text-field"]'
    )
  );

  const passwordInput = await driver.findElement(
    By.xpath(
      '//flt-semantics[@id="flt-semantic-node-10"]//input[@data-semantics-role="text-field"]'
    )
  );

  // กดปุ่ม Clear ของ Email ก่อน
  const emailClearButton = await driver.findElement(
    By.xpath('//flt-semantics[@id="flt-semantic-node-13"]')
  );
  await emailClearButton.click();
  await wait(300);

  await emailInput.click();
  await emailInput.sendKeys(process.env.WAFFLE_EMAIL);

  await wait(500);

  // กดปุ่ม Clear ของ Password ก่อน
  const passwordClearButton = await driver.findElement(
    By.xpath('//flt-semantics[@id="flt-semantic-node-14"]')
  );
  await passwordClearButton.click();
  await wait(300);

  await passwordInput.click();
  await passwordInput.sendKeys(process.env.WAFFLE_PASSWORD);

  await wait(1000);
});

When("I click the Login button", async function () {
  const buttons = await driver.findElements(
    By.css('flt-semantics[role="button"]')
  );

  let loginButton = null;

  for (const btn of buttons) {
    const text = await btn.getText();
    if (text.trim() === "Login") {
      loginButton = btn;
      break;
    }
  }

  if (!loginButton) {
    throw new Error("Login button not found!");
  }

  await loginButton.click();
  await wait(3000);
});
Then(
  "I should be logged in",
  { timeout: 10000 }, // ไม่ต้องรอนาน
  async function () {
    await wait(5000); // รอ Flutter โหลดหรือ redirect

    const currentUrl = await driver.getCurrentUrl();

    // ตัวอย่างเช็คจาก Title ไว้เปลี่ยนเป็น /dashboard etc. หลังพี่นัททำเสร็จ
    if (currentUrl.includes("/auth")) {
      console.log("Login Success by Title/Path Check!");
      return;
    }

    throw new Error(
      `❌ Login failed: Unexpected page - Title: ${title}, URL: ${currentUrl}`
    );
  }
);

AfterAll(async function () {
  if (driver) {
    await driver.quit();
  }
});
