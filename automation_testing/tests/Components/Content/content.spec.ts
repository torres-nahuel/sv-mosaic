import { test, expect, Page } from "@playwright/test";
import { ContentPage } from "../../../pages/Components/Content/ContentPage";
import theme from "../../../../src/theme";
import { buttonKnobs as knob, contentKnobs } from "../../../utils/data/knobs";

test.describe.parallel("Components - Content - Playground", () => {
	let page: Page;
	let contentPage: ContentPage;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		contentPage = new ContentPage(page);
		await contentPage.visit(contentPage.page_path);
	});

	test.afterAll(async ({ browser }) => {
		await browser.close();
	});

	test("Validate Content title has almostBlack color.", async () => {
		const expectedColor = theme.newColors.almostBlack["100"];
		expect(await contentPage.getColorFromElement(contentPage.mainContentTitle)).toBe(expectedColor);
	});

	test("Validate Edit button has grey3 as color.", async () => {
		const expectedColor = theme.newColors.grey3["100"];
		expect(await contentPage.getColorFromElement(contentPage.editButton)).toBe(expectedColor);
	});

	test("Validate Chips has grey2 as background color.", async () => {
		const expectedColor = theme.newColors.grey2["100"];
		for (let i = 0; i < await contentPage.chipTestIDLocator.count(); i++) {
			expect(await contentPage.getBackgroundColorFromElement(contentPage.chipTestIDLocator.nth(i))).toBe(expectedColor);
		}
	});

	test("Validate content wrapper magin all around.", async () => {
		const expectedMargin = "16px";
		expect.soft(await contentPage.getSpecificMarginFromElement(contentPage.contentWrapperLocator, "right")).toBe(expectedMargin);
		expect.soft(await contentPage.getSpecificMarginFromElement(contentPage.contentWrapperLocator, "left")).toBe(expectedMargin);
		expect.soft(await contentPage.getSpecificPaddingFromElement(contentPage.contentWrapperLocator, "top")).toBe(expectedMargin);
		expect(await contentPage.getSpecificPaddingFromElement(contentPage.contentWrapperLocator, "bottom")).toBe(expectedMargin);
	});

	test("Validate font weight of the Content Title.", async () => {
		expect(await contentPage.getFontWeightFromElement(contentPage.mainContentTitle)).toBe((theme.fontWeight.medium).toString());
	});

	test("Validate font size of the Content Title.", async () => {
		expect(await contentPage.getFontSizeFromElement(contentPage.mainContentTitle)).toBe("16px");
	});

	test("Validate Card variant for Content component.", async () => {
		await contentPage.visit(contentPage.page_path, [knob.knobVariant + "card"]);
		await expect(contentPage.cardWrapperLocator).toBeVisible();
		expect(await contentPage.getBackgroundColorFromElement(contentPage.titleBarLocator)).toBe(theme.newColors.grey2["100"]);

		// Get total number of buttons present in the page.
		const buttonCount = await contentPage.button.count();
		expect(await contentPage.titleBarLocator.locator("button").count()).toBe(buttonCount);
	});

	test("Validate the show capability to content buttons.", async () => {
		await contentPage.visit(contentPage.page_path, [contentKnobs.knobShowEditButton + "false"]);
		await expect(contentPage.editButton).not.toBeVisible();

		await contentPage.visit(contentPage.page_path, [contentKnobs.knobShowDetailsButton + "false"]);
		await expect(contentPage.detailsButton).not.toBeVisible();
	});
});
