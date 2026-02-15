# 🚀 ShopWise Collective - Quick Start

## Installation (2 Minutes)

### Step 1: Extract the Files
You should have a folder named `shopwise-extension` containing:
```
✓ manifest.json
✓ content.js
✓ background.js  
✓ popup.html
✓ popup.js
✓ styles.css
✓ shopwise.png
✓ README.md
✓ TESTING.md
✓ QUICKSTART.md (this file)
```

### Step 2: Load in Chrome

1. **Open Chrome Extensions Page**
   - Type in address bar: `chrome://extensions/`
   - Or click: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Find toggle in top-right corner
   - Turn it ON (should turn blue)

3. **Load the Extension**
   - Click "Load unpacked" button (top-left)
   - Browse to and select the `shopwise-extension` folder
   - Click "Select Folder"

4. **Verify Installation**
   - ShopWise card appears in extensions list
   - No errors shown (red text)
   - Extension icon appears in Chrome toolbar

### Step 3: Test It

**Test on Amazon:**
1. Visit: https://www.amazon.com/dp/B0BSHF7WHW
2. Wait 3 seconds
3. Widget should appear in top-right! 🎉

**Test on Takealot:**
1. Visit: https://www.takealot.com/samsung-galaxy-a55-5g-128gb-awesome-navy/PLID96433806
2. Wait 3 seconds  
3. Widget should appear showing price in Rand (R)

**View Tracked Products:**
1. Click ShopWise icon in toolbar
2. See your tracked products
3. Click any product to revisit it

## 🎯 Usage

### Automatic Tracking
- Just visit any product page on:
  - Amazon.com
  - Amazon.co.za
  - Takealot.com
- The extension automatically tracks the price
- Visit again later to see price changes

### Widget Features
- **Current Price**: Big, bold price display
- **Price Trend**: Shows if price increased/decreased
- **Chart**: Visual price history
- **Stats**: Lowest, highest, average prices
- **History Button**: View all recorded prices

### Managing Products
- Click extension icon to see all tracked products
- Click "Clear All" to remove everything
- Click any product card to visit its page

## ⚙️ Configuration

### Supported Sites
Currently tracking prices on:
- ✅ Amazon.com (US)
- ✅ Amazon.co.za (South Africa)
- ✅ Takealot.com (South Africa)

### Price Check Frequency
- Automatic: Every time you visit a product page
- Manual: Click extension icon to check all prices (coming soon)
- Daily: Background checks (coming soon)

### Data Storage
- All data stored locally on your computer
- No cloud sync
- No external servers
- Complete privacy

## 🐛 Troubleshooting

### Widget Not Showing?

**Check 1: Is it a product page?**
- URL must contain `/dp/` for Amazon
- URL must contain `PLID` for Takealot
- Not search results or category pages

**Check 2: Wait for page load**
- Some sites load prices slowly
- Wait 3-5 seconds
- Try scrolling down the page

**Check 3: Check console**
- Press F12 to open DevTools
- Click "Console" tab
- Look for "🛒 ShopWise Collective loaded"
- Look for any red error messages

**Check 4: Reload extension**
1. Go to `chrome://extensions/`
2. Find ShopWise Collective
3. Click reload icon (circular arrow)
4. Refresh the product page

### Numbers Stuck at 0?

**Solution:**
1. Visit an actual product page (not search results)
2. Wait for widget to appear
3. Close and reopen the popup
4. Numbers should update

### Extension Not Loading?

**Solution:**
1. Go to `chrome://extensions/`
2. Check for errors on ShopWise card
3. Click "Errors" if button appears
4. Verify all files are in the folder
5. Try removing and re-adding the extension

## 📊 Understanding the Data

### Price Trend Indicators
- 📉 **Green** = Price dropped (good!)
- 📈 **Red** = Price increased (wait for drop)
- ✅ **Blue** = Price stable (monitoring)
- 🕐 **Orange** = Just started tracking

### Statistics
- **Lowest**: Best price you've ever seen
- **Highest**: Highest price recorded
- **Average**: Mean of all recorded prices
- **Tracking**: Number of days/checks

### Price History
- Stores up to 60 price points per product
- That's about 2 months of daily checks
- Older data automatically removed
- Click "View Full History" for details

## 🎨 UI Tips

### Widget Position
- Appears top-right by default
- Doesn't block page content
- Scrolls with page

### Dark Mode
- Automatically detects system dark mode
- Switches colors appropriately
- Easy on the eyes at night

### Animations
- Smooth slide-in when appearing
- Smooth slide-out when closing
- Hover effects on buttons
- Professional feel

## 🔐 Privacy & Security

### What We DON'T Do
- ❌ No data sent to servers
- ❌ No tracking or analytics
- ❌ No ads or monetization
- ❌ No account required
- ❌ No personal information collected

### What We DO
- ✅ Store prices locally on YOUR computer
- ✅ Only access pages you visit
- ✅ Respect your privacy completely
- ✅ Open source for transparency

## 🆘 Need More Help?

1. **Read Full README**: `README.md` has detailed info
2. **Run Tests**: `TESTING.md` has test procedures
3. **Check Console**: F12 → Console shows debug info
4. **Verify Permissions**: `chrome://extensions/` → Details → Permissions

## 📈 Next Steps

### Coming Soon
- [ ] Price drop alerts via notifications
- [ ] Email alerts for major price drops
- [ ] Compare prices across sites
- [ ] Export price history to CSV
- [ ] Share tracked products with friends
- [ ] Mobile app for iOS/Android

### How to Update
When a new version is available:
1. Download new files
2. Go to `chrome://extensions/`
3. Click reload on ShopWise
4. Your data is preserved!

## ✨ Pro Tips

**Tip 1**: Visit products regularly to build history
**Tip 2**: Track competitors' products to monitor market
**Tip 3**: Use on multiple devices for more data points
**Tip 4**: Check history before Black Friday sales
**Tip 5**: Share extension with friends to track together

---

## 🎉 You're All Set!

Start tracking prices and never overpay again!

**Quick Links:**
- Test URL (Amazon): https://www.amazon.com/dp/B0BSHF7WHW
- Test URL (Takealot): https://www.takealot.com/samsung-galaxy-a55-5g-128gb-awesome-navy/PLID96433806
- Extensions Page: chrome://extensions/

---

**Made with ❤️ for smarter shopping**
