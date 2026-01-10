export class NavigationManager {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.pageViews = document.querySelectorAll('.page-view');
        this.pageTitle = document.getElementById('pageTitle');
        this.sidebar = document.querySelector('.sidebar');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e, item));
        });
    }

    handleNavigation(e, item) {
        e.preventDefault();
        
        // Update active nav item
        this.navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show selected page
        const pageId = item.getAttribute('data-page') + 'Page';
        this.showPage(pageId);
        
        // Update page title
        this.pageTitle.textContent = item.querySelector('span').textContent;
        
        // Close mobile menu
        this.sidebar?.classList.remove('mobile-open');
        
        // Initialize calendar if needed
        if (pageId === 'calendarPage') {
            window.calendarManager?.init();
        }
    }

    showPage(pageId) {
        this.pageViews.forEach(page => {
            page.classList.add('hidden');
            if (page.id === pageId || page.id === 'addCustomerPage') {
                page.classList.remove('hidden');
            }
        });
    }
}