// ShopWise Collective - Background Script

console.log('ShopWise background service worker loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ ShopWise Collective installed successfully!');
});
