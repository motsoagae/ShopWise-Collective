// ShopWise Popup Script
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tracked products? This cannot be undone.')) {
      chrome.storage.local.set({ products: {} }, () => {
        loadProducts();
      });
    }
  });
});

function loadProducts() {
  chrome.storage.local.get(['products'], (result) => {
    const products = result.products || {};
    const productsList = document.getElementById('products-list');
    const productCount = Object.keys(products).length;
    
    // Update stats
    document.getElementById('product-count').textContent = productCount;
    
    let totalChecks = 0;
    Object.values(products).forEach(p => {
      totalChecks += (p.history || []).length;
    });
    document.getElementById('price-checks').textContent = totalChecks;
    
    // Show/hide clear button
    const clearBtn = document.getElementById('clear-all');
    if (productCount > 0) {
      clearBtn.style.display = 'block';
    } else {
      clearBtn.style.display = 'none';
    }
    
    // Display products
    if (productCount === 0) {
      productsList.innerHTML = `
        <div class="empty">
          <div class="empty-icon">🛍️</div>
          <div class="empty-title">No products yet</div>
          <div class="empty-text">Visit Amazon or Takealot product pages<br>to start tracking prices!</div>
        </div>
      `;
      return;
    }
    
    const productsArray = Object.entries(products).map(([id, data]) => ({
      id,
      ...data
    }));
    
    // Sort by most recent
    productsArray.sort((a, b) => {
      const aLast = a.lastChecked || a.history[a.history.length - 1].timestamp;
      const bLast = b.lastChecked || b.history[b.history.length - 1].timestamp;
      return bLast - aLast;
    });
    
    productsList.innerHTML = productsArray.map(product => {
      const latest = product.history[product.history.length - 1];
      const siteName = formatSiteName(product.site);
      const currency = product.site === 'takealot' ? 'R' : '$';
      const imageHtml = product.image 
        ? `<img src="${product.image}" class="product-image" alt="${product.title}">` 
        : `<div class="product-image"></div>`;
      
      return `
        <div class="product" data-url="${product.url}">
          ${imageHtml}
          <div class="product-info">
            <div class="product-site">${siteName}</div>
            <div class="product-title">${escapeHtml(product.title)}</div>
            <div class="product-price">${currency}${latest.price.toFixed(2)}</div>
          </div>
        </div>
      `;
    }).join('');
    
    // Add click handlers
    document.querySelectorAll('.product').forEach(el => {
      el.addEventListener('click', () => {
        chrome.tabs.create({ url: el.dataset.url });
      });
    });
  });
}

function formatSiteName(site) {
  const names = {
    'amazon_us': 'Amazon.com',
    'amazon_za': 'Amazon.co.za',
    'takealot': 'Takealot'
  };
  return names[site] || site;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
