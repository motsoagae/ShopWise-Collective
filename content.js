// ShopWise Collective - Advanced Content Script
console.log('🛒 ShopWise Collective v1.0 loaded');

// Site detector
class SiteDetector {
  static detect() {
    const hostname = window.location.hostname;
    if (hostname.includes('amazon.com')) return 'amazon_us';
    if (hostname.includes('amazon.co.za')) return 'amazon_za';
    if (hostname.includes('takealot.com')) return 'takealot';
    return null;
  }
  
  static isProductPage() {
    const site = this.detect();
    const url = window.location.href;
    
    if (site === 'amazon_us' || site === 'amazon_za') {
      return url.includes('/dp/') || url.includes('/gp/product/');
    }
    if (site === 'takealot') {
      return url.match(/\/[^\/]+-PLID\d+/);
    }
    return false;
  }
}

// Price extractor for Amazon
class AmazonExtractor {
  static getPrice() {
    const selectors = [
      '.a-price-whole',
      '.a-price .a-offscreen',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price-range .a-offscreen',
      'span[class*="priceToPay"] .a-offscreen',
      '#corePrice_feature_div .a-offscreen',
      '.priceToPay .a-offscreen'
    ];
    
    for (let selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (let element of elements) {
        const text = element.textContent || element.getAttribute('content') || '';
        const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '');
        const price = parseFloat(cleaned);
        if (!isNaN(price) && price > 0) {
          console.log(`✅ Found Amazon price: ${price} from ${selector}`);
          return price;
        }
      }
    }
    
    console.warn('❌ Could not find Amazon price');
    return null;
  }
  
  static getProductId() {
    const urlMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})/);
    if (urlMatch) return urlMatch[1];
    
    const inputEl = document.querySelector('input[name="ASIN"]');
    if (inputEl) return inputEl.value;
    
    return null;
  }
  
  static getTitle() {
    const selectors = [
      '#productTitle',
      '#title',
      'h1.product-title'
    ];
    
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const title = element.textContent.trim();
        if (title) return title;
      }
    }
    
    return 'Unknown Product';
  }
  
  static getImage() {
    const selectors = [
      '#landingImage',
      '#imgBlkFront',
      '.a-dynamic-image'
    ];
    
    for (let selector of selectors) {
      const img = document.querySelector(selector);
      if (img) return img.src || img.getAttribute('data-old-hires') || img.getAttribute('data-a-dynamic-image');
    }
    
    return null;
  }
}

// Price extractor for Takealot
class TakealotExtractor {
  static getPrice() {
    const selectors = [
      '[class*="currency"] [class*="rand"]',
      '.currency-module_currency-value',
      '.price-box .price',
      'div[class*="price"] span[class*="rand"]',
      'span.currency.plus.format',
      'div.currency span'
    ];
    
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent || '';
        const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '');
        const price = parseFloat(cleaned);
        if (!isNaN(price) && price > 0) {
          console.log(`✅ Found Takealot price: ${price} from ${selector}`);
          return price;
        }
      }
    }
    
    // Try to find any element with price-like text
    const priceElements = document.querySelectorAll('*');
    for (let el of priceElements) {
      if (el.children.length === 0) {
        const text = el.textContent.trim();
        if (text.startsWith('R ') && text.length < 15) {
          const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '');
          const price = parseFloat(cleaned);
          if (!isNaN(price) && price > 10) {
            console.log(`✅ Found Takealot price via text scan: ${price}`);
            return price;
          }
        }
      }
    }
    
    console.warn('❌ Could not find Takealot price');
    return null;
  }
  
  static getProductId() {
    const urlMatch = window.location.href.match(/PLID(\d+)/);
    return urlMatch ? urlMatch[1] : null;
  }
  
  static getTitle() {
    const selectors = [
      'h1[class*="title"]',
      '.product-title',
      'h1.product-title',
      'div[class*="title"] h1'
    ];
    
    for (let selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const title = element.textContent.trim();
        if (title) return title;
      }
    }
    
    return document.title.split('|')[0].trim() || 'Unknown Product';
  }
  
  static getImage() {
    const selectors = [
      '.gallery-image img',
      '[class*="product-image"] img',
      'img[class*="main"]'
    ];
    
    for (let selector of selectors) {
      const img = document.querySelector(selector);
      if (img) return img.src;
    }
    
    return null;
  }
}

// Main product tracker
class ProductTracker {
  static async saveProduct() {
    const site = SiteDetector.detect();
    if (!site) {
      console.log('❌ Unsupported site');
      return;
    }
    
    if (!SiteDetector.isProductPage()) {
      console.log('ℹ️ Not a product page');
      return;
    }
    
    let extractor;
    if (site === 'amazon_us' || site === 'amazon_za') {
      extractor = AmazonExtractor;
    } else if (site === 'takealot') {
      extractor = TakealotExtractor;
    }
    
    const productId = extractor.getProductId();
    const price = extractor.getPrice();
    const title = extractor.getTitle();
    const image = extractor.getImage();
    
    if (!productId) {
      console.warn('❌ Could not detect product ID');
      return;
    }
    
    if (!price) {
      console.warn('❌ Could not detect price');
      return;
    }
    
    const product = {
      id: `${site}_${productId}`,
      site,
      productId,
      price,
      title,
      image,
      url: window.location.href.split('?')[0],
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    
    console.log('📦 Product detected:', product);
    
    // Save to storage
    chrome.storage.local.get(['products'], (result) => {
      const products = result.products || {};
      
      // Initialize product history if new
      if (!products[product.id]) {
        products[product.id] = {
          site,
          title,
          url: product.url,
          image,
          history: []
        };
        console.log('🆕 New product added to tracking');
      }
      
      // Check if price changed
      const history = products[product.id].history;
      const lastPrice = history.length > 0 ? history[history.length - 1].price : null;
      const priceChanged = lastPrice !== null && lastPrice !== price;
      
      // Add price to history
      products[product.id].history.push({
        price,
        timestamp: product.timestamp,
        date: product.date
      });
      
      // Keep only last 60 entries (2 months of daily checks)
      if (products[product.id].history.length > 60) {
        products[product.id].history = products[product.id].history.slice(-60);
      }
      
      // Update stored data
      products[product.id].lastChecked = product.timestamp;
      
      // Save back to storage
      chrome.storage.local.set({ products }, () => {
        console.log('✅ Product saved successfully');
        
        // Show notification for price changes
        if (priceChanged) {
          const diff = price - lastPrice;
          const percent = ((diff / lastPrice) * 100).toFixed(1);
          const direction = diff < 0 ? 'dropped' : 'increased';
          
          chrome.runtime.sendMessage({
            type: 'PRICE_CHANGED',
            product: products[product.id],
            diff,
            percent,
            direction
          });
        }
        
        // Show widget
        this.showWidget(products[product.id]);
      });
    });
  }
  
  static showWidget(productData) {
    // Remove existing widget
    const existing = document.getElementById('shopwise-widget');
    if (existing) existing.remove();
    
    const history = productData.history || [];
    if (history.length === 0) return;
    
    // Calculate statistics
    const current = history[history.length - 1].price;
    const prices = history.map(h => h.price);
    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    // Price trend analysis
    let trendHtml = '';
    let trendColor = '#10b981';
    
    if (history.length >= 2) {
      const previous = history[history.length - 2].price;
      const diff = current - previous;
      const percent = Math.abs((diff / previous) * 100).toFixed(1);
      
      if (diff < 0) {
        trendHtml = `<div class="sw-trend sw-trend-down">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 12L4 8M8 12L12 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Price dropped ${percent}% (${this.formatCurrency(Math.abs(diff), productData.site)})
        </div>`;
        trendColor = '#10b981';
      } else if (diff > 0) {
        trendHtml = `<div class="sw-trend sw-trend-up">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 4V12M8 4L12 8M8 4L4 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Price increased ${percent}% (${this.formatCurrency(diff, productData.site)})
        </div>`;
        trendColor = '#ef4444';
      } else {
        trendHtml = `<div class="sw-trend sw-trend-stable">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Price stable
        </div>`;
        trendColor = '#6366f1';
      }
    } else {
      trendHtml = `<div class="sw-trend sw-trend-new">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M8 5V8L10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Now tracking
        </div>`;
    }
    
    // Create mini sparkline
    const sparklinePoints = this.generateSparkline(prices);
    
    // Build widget
    const widget = document.createElement('div');
    widget.id = 'shopwise-widget';
    widget.innerHTML = `
      <div class="sw-header">
        <div class="sw-header-content">
          <div class="sw-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5M17 13l2 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="20" r="1" fill="currentColor"/>
              <circle cx="17" cy="20" r="1" fill="currentColor"/>
            </svg>
            <span>ShopWise</span>
          </div>
          <button class="sw-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="sw-body">
        <div class="sw-price-section">
          <div class="sw-current-price">
            <div class="sw-price-label">Current Price</div>
            <div class="sw-price-value">${this.formatCurrency(current, productData.site)}</div>
          </div>
          ${trendHtml}
        </div>
        
        <div class="sw-chart">
          <svg width="100%" height="60" viewBox="0 0 280 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="${trendColor}" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="${trendColor}" stop-opacity="0.05"/>
              </linearGradient>
            </defs>
            <path d="${sparklinePoints.area}" fill="url(#gradient)"/>
            <path d="${sparklinePoints.line}" fill="none" stroke="${trendColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <div class="sw-stats-grid">
          <div class="sw-stat-card sw-stat-low">
            <div class="sw-stat-icon">↓</div>
            <div>
              <div class="sw-stat-label">Lowest</div>
              <div class="sw-stat-value">${this.formatCurrency(lowest, productData.site)}</div>
            </div>
          </div>
          
          <div class="sw-stat-card sw-stat-high">
            <div class="sw-stat-icon">↑</div>
            <div>
              <div class="sw-stat-label">Highest</div>
              <div class="sw-stat-value">${this.formatCurrency(highest, productData.site)}</div>
            </div>
          </div>
          
          <div class="sw-stat-card sw-stat-avg">
            <div class="sw-stat-icon">≈</div>
            <div>
              <div class="sw-stat-label">Average</div>
              <div class="sw-stat-value">${this.formatCurrency(average, productData.site)}</div>
            </div>
          </div>
          
          <div class="sw-stat-card sw-stat-days">
            <div class="sw-stat-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 4v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="sw-stat-label">Tracking</div>
              <div class="sw-stat-value">${history.length} day${history.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
        
        <button class="sw-btn sw-btn-primary" id="sw-view-history">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3h12M2 8h12M2 13h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          View Full History
        </button>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    // Event listeners
    widget.querySelector('.sw-close').addEventListener('click', () => {
      widget.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => widget.remove(), 300);
    });
    
    widget.querySelector('#sw-view-history').addEventListener('click', () => {
      this.showHistoryModal(productData);
    });
  }
  
  static formatCurrency(amount, site) {
    if (site === 'takealot') {
      return `R ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    return `$${amount.toFixed(2)}`;
  }
  
  static generateSparkline(prices) {
    if (prices.length < 2) {
      return { line: 'M0 30 L280 30', area: 'M0 60 L0 30 L280 30 L280 60 Z' };
    }
    
    const width = 280;
    const height = 60;
    const padding = 5;
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    
    const points = prices.map((price, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - padding - ((price - min) / range) * (height - padding * 2);
      return { x, y };
    });
    
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
    const area = `M0 ${height} L${points.map(p => `${p.x} ${p.y}`).join(' L')} L${width} ${height} Z`;
    
    return { line, area };
  }
  
  static showHistoryModal(productData) {
    const modal = document.createElement('div');
    modal.className = 'sw-modal';
    
    const history = productData.history.slice().reverse();
    
    modal.innerHTML = `
      <div class="sw-modal-content">
        <div class="sw-modal-header">
          <h2>Price History</h2>
          <button class="sw-modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="sw-modal-body">
          <div class="sw-history-list">
            ${history.map(h => {
              const date = new Date(h.timestamp);
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              
              return `
                <div class="sw-history-item">
                  <div class="sw-history-date">
                    <div class="sw-history-date-main">${dateStr}</div>
                    <div class="sw-history-time">${timeStr}</div>
                  </div>
                  <div class="sw-history-price">${this.formatCurrency(h.price, productData.site)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('sw-modal-open'), 10);
    
    const closeModal = () => {
      modal.classList.remove('sw-modal-open');
      setTimeout(() => modal.remove(), 300);
    };
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    modal.querySelector('.sw-modal-close').addEventListener('click', closeModal);
  }
}

// Initialize
function init() {
  console.log('🚀 Initializing ShopWise...');
  
  const site = SiteDetector.detect();
  if (!site) {
    console.log('ℹ️ Not a supported site');
    return;
  }
  
  console.log(`✅ Detected site: ${site}`);
  
  if (!SiteDetector.isProductPage()) {
    console.log('ℹ️ Not a product page');
    return;
  }
  
  console.log('📦 Product page detected, starting tracker...');
  
  // Wait for page to be fully loaded
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => {
      setTimeout(() => ProductTracker.saveProduct(), 2000);
    });
  } else {
    setTimeout(() => ProductTracker.saveProduct(), 2000);
  }
}

// Run
init();
