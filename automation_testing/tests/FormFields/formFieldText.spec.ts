import { test, expect, Page } from "@playwright/test";
import { FormFieldTextPage } from "../../pages/FormFields/FormFieldTextPage";

test.describe.parallel("FormFields - FormFieldsText - Kitchen Sink", () => {
	let page: Page;
	let formFieldTextPage: FormFieldTextPage;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		formFieldTextPage = new FormFieldTextPage(page);
		await formFieldTextPage.visitPage();
	});

	test.afterAll(async ({ browser }) => {
		browser.close;
	});

	test("Validate Regular Text field", async () => {
		expect(await formFieldTextPage.regularTextField.getAttribute("type")).toBe("text");
	});

	test("Validate that the provided text is saved when submitted.", async () => {
		page.once("dialog", async dialog => {
			const message = dialog.message().split(/[{}]/)[1].split(/[\n":]/).map(el => el.trim()).filter(el => el !== "");
			expect(message[1]).toBe(sampleText);
			await dialog.dismiss();
		});
		const sampleText = "regular example text";
		await formFieldTextPage.regularTextField.type(sampleText);
		await formFieldTextPage.saveBtn.click();
	});

	test("Validate Regular Text field type.", async () => {
		expect(await formFieldTextPage.passwordTextField.getAttribute("type")).toBe("Password");
	});

	test("Validate Regular Password field.", async () => {
		const randomPassword = await formFieldTextPage.getAutogeneratedText(20);
		await formFieldTextPage.passwordTextField.type(randomPassword);
		expect(await formFieldTextPage.passwordTextField.inputValue()).toBe(randomPassword);
	});

	test("Validate that the provided password is saved when submitted.", async ({ page }) => {
		page.once("dialog", async dialog => {
			const message = dialog.message().split(/[{}]/)[1].split(/[\n":]/).map(el => el.trim()).filter(el => el !== "");
			expect(Number(message[1])).toBe(randomPassword);
			await dialog.dismiss();
		});
		const randomPassword = await formFieldTextPage.getAutogeneratedText(20);
		await formFieldTextPage.passwordTextField.type(randomPassword);
		await formFieldTextPage.saveBtn.click();
	});

	test("Validate Multiline field", async () => {
		const sampleString = "Multiline string text";
		await formFieldTextPage.setTextInMultilineField(sampleString);
		const expectedResult = "Multiline\nstring\ntext\n";
		expect(await formFieldTextPage.multilineTextField.inputValue()).toBe(expectedResult);
	});

	test("Validate max number of chars allowed.", async () => {
		const maxAmoutChar = await formFieldTextPage.getLimitOfMaxChar(formFieldTextPage.maxCharCounter);
		expect(Number(await formFieldTextPage.fieldMaxCharTextField.getAttribute("maxlength"))).toBe(maxAmoutChar);
		const randomStringEqualToMax = await formFieldTextPage.getAutogeneratedText(Number(maxAmoutChar));
		const randomStringGreaterThanMax = await formFieldTextPage.getAutogeneratedText(Number(maxAmoutChar + 5));
		await formFieldTextPage.fieldMaxCharTextField.type(randomStringEqualToMax);
		expect((await formFieldTextPage.fieldMaxCharTextField.inputValue()).length).toBeLessThanOrEqual(maxAmoutChar);
		await formFieldTextPage.fieldMaxCharTextField.fill("");
		await formFieldTextPage.fieldMaxCharTextField.type(randomStringGreaterThanMax);
		expect((await formFieldTextPage.fieldMaxCharTextField.inputValue()).length).toBeLessThanOrEqual(maxAmoutChar);
	});

	test("Validate field with an icon", async () => {
		await expect(formFieldTextPage.fieldWithIconIcon).toBeVisible();
		await expect(formFieldTextPage.fieldWithIconTextField).toBeVisible();
		const sampleText = "With an icon text";
		await formFieldTextPage.fieldWithIconTextField.type(sampleText);
		expect(await formFieldTextPage.fieldWithIconTextField.inputValue()).toBe(sampleText);
	});

	test("Validate that the text field is disabled ", async () => {
		await expect(formFieldTextPage.disabledTextField).toBeDisabled();
	});

	test("Validate xs regular text size is valid", async () => {
		expect(await formFieldTextPage.getElementWidth(formFieldTextPage.xsSizeTextField)).toBe(100);
	});

	test("Validate sm regular text size is valid", async () => {
		expect(await formFieldTextPage.getElementWidth(formFieldTextPage.smSizeTextField)).toBe(280);
	});

	test("Validate md regular text size is valid", async () => {
		expect(await formFieldTextPage.getElementWidth(formFieldTextPage.mdSizeTextField)).toBe(450);
	});

	test("Validate lg regular text size is valid", async () => {
		expect(await formFieldTextPage.getElementWidth(formFieldTextPage.lgSizeTextField)).toBe(620);
	});

	test("Validate instruction text height.", async () => {
		const fullHeigh = (await formFieldTextPage.getHeightFromElement(formFieldTextPage.firstSection)).split("px")[0];
		const expectedHeight = Number(fullHeigh) - 44;
		const instructionHeight = (await formFieldTextPage.getHeightFromElement(formFieldTextPage.firstInstructionText)).split("px")[0];
		expect(parseFloat(instructionHeight).toFixed(3)).toBe(expectedHeight.toString());
	});

	test("Validate that an empty value is saved correctly.", async () => {
		const sampleText = "regular example text";
		await formFieldTextPage.regularTextField.type(sampleText);
		await formFieldTextPage.saveBtn.click();
		await formFieldTextPage.clearAllValuesFromField(formFieldTextPage.regularTextField);
		await formFieldTextPage.saveBtn.click();
		page.once("dialog", async dialog => {
			expect(dialog.message()).toContain("Form submitted with the following data: {}");
			await dialog.accept();
		});
	});
});
