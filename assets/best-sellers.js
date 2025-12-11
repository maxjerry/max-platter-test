/**
 * Best Sellers Section JavaScript
 * Handles show more/less functionality on mobile
 */

class BestSellersSection {
  constructor(section) {
    this.section = section;
    this.grid = section.querySelector('.best-sellers-grid');
    this.showMoreBtn = section.querySelector('.show-more-btn');
    this.isExpanded = false;

    if (this.showMoreBtn && this.grid) {
      this.init();
    }
  }

  init() {
    this.showMoreBtn.addEventListener('click', () => this.toggleProducts());
  }

  toggleProducts() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.showAllProducts();
    } else {
      this.hideExtraProducts();
    }
  }

  showAllProducts() {
    this.grid.classList.add('show-all');
    this.showMoreBtn.textContent = this.showMoreBtn.dataset.showLessText;

    // Add staggered animation delay
    const hiddenProducts = this.grid.querySelectorAll('.product-card:nth-child(n+5)');
    hiddenProducts.forEach((product, index) => {
      product.style.animationDelay = `${index * 0.1}s`;
    });
  }

  hideExtraProducts() {
    this.grid.classList.remove('show-all');
    this.showMoreBtn.textContent = this.showMoreBtn.dataset.showText;

    // Scroll to top of section
    this.section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Initialize all best sellers sections
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.best-sellers-section');
  sections.forEach(section => new BestSellersSection(section));
});

// Re-initialize on Shopify section events (theme editor)
if (window.Shopify && window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector('.best-sellers-section');
    if (section) {
      new BestSellersSection(section);
    }
  });
}
