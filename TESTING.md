# 🧪 Testing Guide for ShopWise Collective

## Quick Test Checklist

### ✅ Installation Test
- [ ] Extension appears in `chrome://extensions/`
- [ ] No errors shown on extension card
- [ ] Extension icon visible in toolbar
- [ ] Clicking icon opens popup

### ✅ Amazon.com Test
1. Visit: https://www.amazon.com/dp/B0BSHF7WHW (example product)
2. Wait 3-5 seconds
3. Expected results:
   - [ ] Console shows: "🛒 ShopWise Collective loaded"
   - [ ] Console shows: "✅ Detected site: amazon_us"
   - [ ] Console shows: "📦 Product detected"
   - [ ] Widget appears in top-right corner
   - [ ] Widget shows current price
   - [ ] Widget shows "Now tracking" message

### ✅ Amazon.co.za Test
1. Visit: https://www.amazon.co.za/dp/B0D1XD1ZV3 (example product)
2. Wait 3-5 seconds
3. Expected results:
   - [ ] Console shows: "✅ Detected site: amazon_za"
   - [ ] Widget appears
   - [ ] Price shown in USD ($)

### ✅ Takealot Test
1. Visit: https://www.takealot.com/samsung-galaxy-a55-5g-128gb-awesome-navy/PLID96433806
2. Wait 3-5 seconds
3. Expected results:
   - [ ] Console shows: "✅ Detected site: takealot"
   - [ ] Console shows: "✅ Found Takealot price"
   - [ ] Widget appears
   - [ ] Price shown in Rand (R)

### ✅ Popup Test
1. Click extension icon in toolbar
2. Expected results:
   - [ ] Popup opens (400px wide)
   - [ ] Shows product count (should be 1-3 after above tests)
   - [ ] Shows price checks count
   - [ ] Lists tracked products with images
   - [ ] "Clear All" button visible
   - [ ] Clicking product opens its page

### ✅ Widget Functionality Test
1. On any tracked product page
2. In the widget:
   - [ ] Click "×" button → widget closes smoothly
   - [ ] Click "View Full History" → modal opens
   - [ ] Modal shows price history list
   - [ ] Click outside modal → modal closes
   - [ ] Chart shows visual price trend

### ✅ Price Change Test (Advanced)
This requires visiting the same product twice with different prices:

1. Visit a product, note the price
2. Wait for widget to appear
3. Open Chrome DevTools → Console
4. Manually update price in storage:
```javascript
chrome.storage.local.get(['products'], (result) => {
  const products = result.products;
  const productId = Object.keys(products)[0];
  products[productId].history.push({
    price: products[productId].history[0].price * 1.1, // 10% increase
    timestamp: Date.now(),
    date: new Date().toISOString()
  });
  chrome.storage.local.set({ products }, () => {
    console.log('Test price added');
    location.reload();
  });
});
```
5. Expected results:
   - [ ] Widget shows "Price increased" message
   - [ ] Chart updates to show increase
   - [ ] Stats show new highest price

### ✅ Storage Test
Open Console and run:
```javascript
// View all stored data
chrome.storage.local.get(['products'], (result) => {
  console.log('Stored products:', result.products);
  console.log('Product count:', Object.keys(result.products || {}).length);
});
```

Expected output:
```javascript
{
  "amazon_us_B0BSHF7WHW": {
    "site": "amazon_us",
    "title": "Product Name...",
    "url": "https://...",
    "image": "https://...",
    "history": [
      {
        "price": 29.99,
        "timestamp": 1234567890,
        "date": "2024-..."
      }
    ],
    "lastChecked": 1234567890
  }
}
```

## 🐛 Common Issues & Quick Fixes

### Issue: Widget doesn't appear
**Quick Fix:**
```javascript
// Open Console on product page, run:
console.log('URL:', window.location.href);
console.log('Is product page:', 
  window.location.href.includes('/dp/') || 
  window.location.href.match(/PLID\d+/)
);
```
If `false`, you're not on a product page.

### Issue: Price not detected
**Quick Fix:**
```javascript
// On product page Console:
// For Amazon:
document.querySelector('.a-price-whole')?.textContent

// For Takealot:
document.querySelector('[class*="currency"]')?.textContent
```
If `null`, the page structure changed.

### Issue: No products in popup
**Quick Fix:**
1. Close popup
2. Visit a product page
3. Wait for "✅ Product saved" in Console
4. Reopen popup

## 📊 Performance Test

### Memory Usage
1. Open Task Manager (Shift+Esc in Chrome)
2. Find "ShopWise Collective"
3. Expected: < 50 MB memory

### Load Time
1. Open Console on product page
2. Note timestamp when "🛒 ShopWise Collective loaded" appears
3. Note timestamp when "✅ Product saved" appears
4. Expected: < 3 seconds between messages

## ✨ Visual Test

### Widget Appearance
- [ ] Smooth slide-in animation
- [ ] Rounded corners (20px border-radius)
- [ ] Gradient header (purple to violet)
- [ ] White background with subtle shadow
- [ ] All text readable and properly styled
- [ ] Chart renders correctly
- [ ] Stats cards have icons and proper colors

### Popup Appearance
- [ ] 400px width
- [ ] Smooth scrolling
- [ ] Product cards have hover effect
- [ ] Images load correctly
- [ ] Stats show with gradient text
- [ ] "Clear All" button shows only when products exist

## 🚀 Stress Test

### Many Products Test
1. Visit 10+ different products across sites
2. Check popup shows all products
3. Check scrolling works smoothly
4. Check all images load
5. Expected: No lag or crashes

### Long History Test
Simulate 60 days of price checks:
```javascript
chrome.storage.local.get(['products'], (result) => {
  const products = result.products;
  const productId = Object.keys(products)[0];
  const basePrice = products[productId].history[0].price;
  
  // Add 60 random prices
  for (let i = 0; i < 60; i++) {
    products[productId].history.push({
      price: basePrice * (0.9 + Math.random() * 0.2),
      timestamp: Date.now() - (60 - i) * 24 * 60 * 60 * 1000,
      date: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  chrome.storage.local.set({ products }, () => {
    console.log('Added 60 price points');
    location.reload();
  });
});
```

Expected:
- [ ] Chart renders with all points
- [ ] History modal shows 60 entries
- [ ] Statistics calculate correctly
- [ ] No performance issues

## 📱 Responsive Test

### Small Window
1. Resize Chrome window to 480px wide
2. Check widget:
   - [ ] Adjusts to viewport
   - [ ] No horizontal scrolling
   - [ ] All elements visible

### Large Window
1. Maximize Chrome window
2. Check widget:
   - [ ] Stays 360px wide
   - [ ] Positioned consistently
   - [ ] Doesn't stretch

## 🎨 Dark Mode Test

### Enable Dark Mode
1. Go to `chrome://settings/appearance`
2. Set theme to "Dark"
3. Visit product pages
4. Check:
   - [ ] Widget has dark background
   - [ ] Text is readable (light colors)
   - [ ] Stats cards have dark styling
   - [ ] Modal has dark theme
   - [ ] Popup has appropriate dark colors

## 🔔 Notification Test (If Supported)

1. Visit a product
2. Modify price in storage (see Price Change Test)
3. Reload page
4. Expected:
   - [ ] Chrome notification appears
   - [ ] Shows price change details
   - [ ] Has correct icon
   - [ ] Message is clear and informative

## ✅ Sign-Off Checklist

Before considering the extension ready:

- [ ] All basic tests pass
- [ ] Works on all 3 supported sites
- [ ] Popup displays correctly
- [ ] Widget appears and functions
- [ ] Price tracking works
- [ ] No console errors
- [ ] Memory usage acceptable
- [ ] Animations smooth
- [ ] Responsive design works
- [ ] Dark mode works (if applicable)

---

**Test Completion Date:** _______________

**Tester:** _______________

**Notes:** _______________________________________________
