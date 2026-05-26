async function closeWelcomePopup(page) {

  const dismissButton =
    page.locator('button:has-text("Dismiss")');

  if (await dismissButton.isVisible()) {

    console.log('Closing welcome popup...');

    await dismissButton.click();
  }
}

module.exports = {
  closeWelcomePopup
};