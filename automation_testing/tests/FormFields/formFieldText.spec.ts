import { test, expect } from "@playwright/test";
import { FormFieldTextPage } from "../../pages/FormFields/FormFieldTextPage";
import { randomIntFromInterval } from "../../utils/helpers/helper";

test.describe("FormFields - FormFieldsText - Kitchen Sink", () => {
	let formFieldTextPage: FormFieldTextPage;

	test.beforeEach(async ({ page }) => {
		formFieldTextPage = new FormFieldTextPage(page);
		await formFieldTextPage.visitPage();
	});

	test("Validate Regular Text field", async () => {
		expect(await formFieldTextPage.regularTextField.getAttribute("type")).toBe("text");
	});

	test("Validate that the provided text is saved when submitted.", async ({ page }) => {
		page.on("dialog", async dialog => {
			const message = dialog.message().split(/[{}]/)[1].split(/[\n":]/).map(el => el.trim()).filter(el => el !== "");
			expect(message[1]).toBe(sampleText);
			await dialog.dismiss();
		});
		const sampleText = "regular example text";
		await formFieldTextPage.regularTextField.type(sampleText);
		await formFieldTextPage.saveBtn.click();
	});

	test("Validate Regular Number field", async () => {
		expect(await formFieldTextPage.numberTextField.getAttribute("type")).toBe("number");
		const randomNumber = randomIntFromInterval(0, 99999999);
		await formFieldTextPage.numberTextField.type(randomNumber.toString());
		expect(Number(await formFieldTextPage.numberTextField.inputValue())).toBe(randomNumber);

		await formFieldTextPage.numberTextField.selectText();
		await formFieldTextPage.clearAllValuesFromField();		
		await formFieldTextPage.numberTextField.type("Storybook");
		expect(await formFieldTextPage.numberTextField.inputValue()).toBe("");
	});

	test("Validate that the provided number is saved when submitted.", async ({ page }) => {
		page.on("dialog", async dialog => {
			const message = dialog.message().split(/[{}]/)[1].split(/[\n":]/).map(el => el.trim()).filter(el => el !== "");
			expect(Number(message[1])).toBe(randomNumber);
			await dialog.dismiss();
		});
		const randomNumber = randomIntFromInterval(0, 99999999);
		await formFieldTextPage.numberTextField.type(randomNumber.toString());
		await formFieldTextPage.saveBtn.click();
	});

	test("Validate Multiline field", async () => {
		const sampleString = "Multiline string text";
		await formFieldTextPage.setTextInMultilineField(sampleString);
		const expectedResult = "Multiline\nstring\ntext\n";
		expect(await formFieldTextPage.multilineTextField.inputValue()).toBe(expectedResult);
	});

	test("Validate max number the chars allowed", async () => {
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
});