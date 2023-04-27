import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {

	testDir: "./tests",
	use: {
		headless: process.env.CI ? true : false,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 1500000,
		ignoreHTTPSErrors: true,
		//video: "retain-on-failure",
		//screenshot: "only-on-failure"
		video: "off",
		screenshot: "off"
	},
	retries: process.env.CI ? 2 : 1,
	timeout: 1 * 30 * 1000,
	expect: {
		timeout: 5000
	},
	reporter: process.env.CI ? [["junit", { outputFile: "testResults.xml" }]] : [ ["html", { open: "never", outputFolder: "./playwright-report"}] ],
	workers: process.env.CI ? 2 : 4,
	projects: [
		{
			name: "Chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "Firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "Webkit",
			use: { browserName: "webkit" },
		}
	]
}

export default config;
