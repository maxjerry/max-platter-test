/**
 * Best Sellers Section JavaScript
 * Handles show more/less functionality on mobile and custom scrollbar
 */

class CustomScrollbar {
  constructor(section) {
    this.section = section;
    this.scrollContent = section.querySelector('.best-sellers-grid');
    
    if (!this.scrollContent) return;
    
    this.isDragging = false;
    this.startX = 0;
    this.startScrollLeft = 0;
    
    this.createScrollbar();
    this.init();
  }
  
  createScrollbar() {
    // Create scrollbar container
    this.customScrollbar = document.createElement('div');
    this.customScrollbar.className = 'custom-scrollbar';
    
    // Create scrollbar thumb
    this.scrollbarThumb = document.createElement('div');
    this.scrollbarThumb.className = 'custom-scrollbar-thumb';
    
    // Append thumb to scrollbar
    this.customScrollbar.appendChild(this.scrollbarThumb);
    
    // Append scrollbar to section container
    const container = this.section.querySelector('.container');
    if (container) {
      container.appendChild(this.customScrollbar);
    }
  }
  
  init() {
    // Update scrollbar on content scroll
    this.scrollContent.addEventListener('scroll', () => this.updateScrollbar());
    
    // Thumb drag functionality
    this.scrollbarThumb.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
    
    // Click on scrollbar track to jump
    this.customScrollbar.addEventListener('click', (e) => this.onTrackClick(e));
    
    // Initial update
    this.updateScrollbar();
    
    // Update on window resize
    window.addEventListener('resize', () => this.updateScrollbar());
  }
  
  updateScrollbar() {
    const scrollWidth = this.scrollContent.scrollWidth;
    const clientWidth = this.scrollContent.clientWidth;
    const scrollLeft = this.scrollContent.scrollLeft;
    
    // Calculate thumb width
    const thumbWidth = (clientWidth / scrollWidth) * clientWidth;
    this.scrollbarThumb.style.width = thumbWidth + 'px';
    
    // Calculate thumb position
    const thumbLeft = (scrollLeft / scrollWidth) * clientWidth;
    this.scrollbarThumb.style.left = thumbLeft + 'px';
    
    // Hide scrollbar if content doesn't overflow
    if (scrollWidth <= clientWidth) {
      this.customScrollbar.style.display = 'none';
    } else {
      this.customScrollbar.style.display = 'block';
    }
  }
  
  onMouseDown(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startScrollLeft = this.scrollContent.scrollLeft;
    this.customScrollbar.classList.add("dragging");
    e.preventDefault();
  }
  
  onMouseMove(e) {
    if (!this.isDragging) return;
    
    const deltaX = e.clientX - this.startX;
    const scrollWidth = this.scrollContent.scrollWidth;
    const clientWidth = this.scrollContent.clientWidth;
    
    const scrollRatio = scrollWidth / clientWidth;
    this.scrollContent.scrollLeft = this.startScrollLeft + (deltaX * scrollRatio);
  }
  
  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.customScrollbar.classList.remove("dragging");
    }
  }
  
  onTrackClick(e) {
    if (e.target === this.customScrollbar) {
      const rect = this.customScrollbar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const scrollWidth = this.scrollContent.scrollWidth;
      const clientWidth = this.scrollContent.clientWidth;
      this.scrollContent.scrollLeft = (clickX / clientWidth) * scrollWidth;
    }
  }
}

class BestSellersSection {
  constructor(section) {
    this.section = section;
    this.grid = section.querySelector('.best-sellers-grid');
    this.showMoreBtn = section.querySelector('.show-more-btn');
    this.isExpanded = false;

    // Initialize custom scrollbar
    this.customScrollbar = new CustomScrollbar(section);

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
