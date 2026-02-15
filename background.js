// ShopWise Collective - Background Service Worker
console.log('🚀 ShopWise Collective background service worker loaded');

// Installation handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('✅ ShopWise Collective installed successfully!');
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  } else if (details.reason === 'update') {
    console.log('🔄 ShopWise Collective updated');
  }
});

// Message handler for price change notifications
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PRICE_CHANGED') {
    const { product, diff, percent, direction } = message;
    
    const title = direction === 'dropped' 
      ? '🎉 Price Drop Alert!' 
      : '⚠️ Price Increase Alert';
    
    const currency = product.site === 'takealot' ? 'R' : '$';
    const changeText = direction === 'dropped'
      ? `Dropped ${Math.abs(percent)}%`
      : `Increased ${percent}%`;
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'shopwise.png',
      title: title,
      message: `${product.title.substring(0, 60)}...\n${changeText} (${currency}${Math.abs(diff).toFixed(2)})`,
      priority: 2
    });
  }
  
  return true;
});

// Periodic price check (optional - can be enabled later)
// This would check all tracked products once per day
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-price-check') {
    console.log('⏰ Running daily price check...');
    // This would need to be implemented with a backend API
    // For now, prices are checked when user visits the page
  }
});

// Set up daily alarm on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('daily-price-check', {
    delayInMinutes: 1440, // 24 hours
    periodInMinutes: 1440
  });
});
