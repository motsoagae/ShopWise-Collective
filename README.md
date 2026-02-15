# 🛒 ShopWise Collective

A sophisticated Chrome extension for tracking product prices across Amazon and Takealot with real-time insights and beautiful UI.

## ✨ Features

- **Multi-Site Support**: Works on Amazon.com, Amazon.co.za, and Takealot
- **Smart Price Tracking**: Automatically detects and saves prices when you visit product pages
- **Beautiful UI**: Modern, glassmorphic design with smooth animations
- **Price History**: View historical prices with interactive charts
- **Price Alerts**: Get notifications when prices drop or increase
- **Dark Mode**: Automatic dark mode support
- **Responsive**: Works perfectly on all screen sizes

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `shopwise-extension` folder
5. The extension is now installed! 🎉

### Method 2: Pack as CRX (Distribution)

1. Go to `chrome://extensions/`
2. Click "Pack extension"
3. Select the `shopwise-extension` folder
4. Click "Pack Extension"
5. Share the generated `.crx` file

## 📖 How to Use

### Tracking Products

1. Visit any product page on:
   - Amazon.com
   - Amazon.co.za
   - Takealot.com

2. The extension automatically detects the product and price

3. A beautiful widget appears in the top-right showing:
   - Current price
   - Price trend (up/down/stable)
   - Interactive price chart
   - Lowest/highest prices seen
   - Tracking duration

4. Click "View Full History" to see detailed price history

### Viewing Tracked Products

1. Click the ShopWise icon in your Chrome toolbar
2. See all tracked products with:
   - Product count
   - Total price checks
   - Product images and titles
   - Latest prices
3. Click any product to visit its page

### Managing Data

- Click "Clear All" in the popup to remove all tracked products
- Price history is limited to 60 entries per product (2 months of daily checks)

## 🔧 Technical Details

### Architecture

```
shopwise-extension/
├── manifest.json       # Extension configuration
├── content.js         # Main price tracking logic
├── background.js      # Service worker for notifications
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality
├── styles.css        # Modern UI styles
├── shopwise.png      # Extension icon
└── README.md         # This file
```

### Technologies Used

- **Manifest V3**: Latest Chrome extension standard
- **Chrome Storage API**: Local data persistence
- **Chrome Notifications API**: Price change alerts
- **Modern CSS**: Glassmorphism, gradients, animations
- **Vanilla JavaScript**: No dependencies, fast and lightweight

### Site Support

The extension intelligently detects and extracts prices from:

**Amazon (amazon.com & amazon.co.za)**
- Multiple price selector fallbacks
- ASIN-based product identification
- Product title and image extraction

**Takealot (takealot.com)**
- South African Rand (R) currency support
- PLID-based product identification
- Robust price extraction with multiple strategies

## 🐛 Troubleshooting

### Widget Not Appearing

**Problem**: Extension loads but widget doesn't show on product pages

**Solutions**:
1. **Check Console**: Open DevTools (F12) → Console tab
   - Look for "🛒 ShopWise Collective loaded" message
   - Check for any error messages

2. **Verify Product Detection**:
   - Amazon: URL must contain `/dp/` or `/gp/product/`
   - Takealot: URL must contain `PLID` followed by numbers

3. **Reload Extension**:
   - Go to `chrome://extensions/`
   - Click reload icon on ShopWise
   - Refresh the product page

4. **Check Site Support**:
   - Ensure you're on a supported site
   - Check that it's a product page, not a search results page

### Price Not Detected

**Problem**: Widget shows but says "Could not detect price"

**Solutions**:
1. **Wait for Page Load**: Some sites load prices dynamically
   - Wait 3-5 seconds for the page to fully load
   - Scroll down the page to trigger lazy-loaded content

2. **Check Site Changes**: If a site changed their HTML structure
   - Open DevTools Console
   - Look for "❌ Could not find [site] price" message
   - This indicates the site may have updated their layout

3. **Manual Price Check**:
   - Right-click the price on the page
   - Select "Inspect"
   - Check the element's class names
   - Update selectors in `content.js` if needed

### Extension Not Loading

**Problem**: Extension doesn't appear in toolbar or extensions list

**Solutions**:
1. **Check Manifest Errors**:
   - Go to `chrome://extensions/`
   - Look for error messages on the ShopWise card
   - Click "Errors" button if shown

2. **Verify File Structure**:
   ```
   All files must be in the same folder:
   ✓ manifest.json
   ✓ content.js
   ✓ background.js
   ✓ popup.html
   ✓ popup.js
   ✓ styles.css
   ✓ shopwise.png
   ```

3. **Check File Permissions**:
   - Ensure all files are readable
   - On Unix systems: `chmod 644 *`

### Stats Showing 0

**Problem**: Popup shows "0 Products" and "0 Price Checks"

**Solutions**:
1. **Visit Product Pages**: The extension only tracks after visiting products
   
2. **Check Storage**:
   - Open DevTools Console on popup
   - Type: `chrome.storage.local.get(['products'], console.log)`
   - Should show tracked products

3. **Clear and Retry**:
   - Click "Clear All" in popup
   - Visit a product page
   - Check if it's now tracked

### Notifications Not Working

**Problem**: No price change notifications appear

**Solutions**:
1. **Check Chrome Permissions**:
   - Go to `chrome://settings/content/notifications`
   - Ensure notifications are allowed

2. **Trigger Price Change**:
   - Visit a product
   - Wait for tracking
   - Visit again when price changes
   - Should see notification

3. **Check Background Service**:
   - Go to `chrome://extensions/`
   - Click "Inspect views: service worker" on ShopWise
   - Look for error messages

## 🔍 Debug Mode

Enable detailed logging:

1. Open any product page
2. Open DevTools Console (F12)
3. Look for these messages:
   ```
   🚀 Initializing ShopWise...
   ✅ Detected site: amazon_us
   📦 Product page detected
   ✅ Found Amazon price: 29.99
   📦 Product detected: {id: "...", price: 29.99, ...}
   ✅ Product saved successfully
   ```

If you see "❌" errors, they indicate where the issue is.

## 🎨 Customization

### Change Colors

Edit `styles.css`:
```css
/* Main gradient */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Adjust Widget Position

Edit `styles.css`:
```css
#shopwise-widget {
  top: 80px;  /* Change vertical position */
  right: 20px; /* Change horizontal position */
}
```

### Modify Price Selectors

If a site changes their HTML, update `content.js`:

```javascript
// For Amazon
static getPrice() {
  const selectors = [
    '.your-new-selector',  // Add your selector here
    '.a-price-whole',
    // ... existing selectors
  ];
}
```

## 📊 Data Storage

- **Location**: Chrome Local Storage
- **Size Limit**: ~5MB total
- **Per Product**: ~60 price points (2 months)
- **Privacy**: All data stored locally, never sent to servers

## 🔐 Privacy & Security

- ✅ No external API calls
- ✅ No data collection
- ✅ No tracking or analytics
- ✅ All data stays on your device
- ✅ No permissions beyond necessary sites
- ✅ Open source and auditable

## 🤝 Contributing

Found a bug or want to add a feature?

1. Check if price detection works in Console
2. Identify the issue
3. Update the relevant file
4. Test thoroughly
5. Document changes

## 📝 License

MIT License - Free to use, modify, and distribute

## 🙏 Credits

Built with care for smarter shopping.

## 📞 Support

Having issues? Check:
1. This README's troubleshooting section
2. Chrome DevTools Console for errors
3. Extension's permissions in `chrome://extensions/`

---

**Made with ❤️ for smarter shopping**
