// Load and display tracked products
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
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
      totalChecks += p.history.length;
    });
    document.getElementById('price-checks').textContent = totalChecks;
    
    // Display products
    if (productCount === 0) {
      return; // Keep empty state
    }
    
    const productsArray = Object.entries(products).map(([asin, data]) => ({
      asin,
      ...data
    }));
    
    // Sort by most recent
    productsArray.sort((a, b) => {
      const aLast = a.history[a.history.length - 1].timestamp;
      const bLast = b.history[b.history.length - 1].timestamp;
      return bLast - aLast;
    });
    
    productsList.innerHTML = productsArray.map(product => {
      const latest = product.history[product.history.length - 1];
      return `
        <div class="product" data-url="${product.url}">
          <div class="product-title">${product.title}</div>
          <div class="product-price">$${latest.price.toFixed(2)}</div>
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
