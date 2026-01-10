import { ThemeManager } from './modules/theme.js';
import { NavigationManager } from './modules/navigation.js';
import { CalendarManager } from './modules/calendar.js';

class CRMApp {
    constructor() {
        this.themeManager = null;
        this.navigationManager = null;
        this.calendarManager = null;
        this.init();
    }

    init() {
        this.initializeModules();
        this.bindGlobalEvents();
        this.simulateLoading();
    }

    initializeModules() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.calendarManager = new CalendarManager();
        
        // Make calendar manager globally accessible for navigation
        window.calendarManager = this.calendarManager;
    }

    bindGlobalEvents() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        menuToggle?.addEventListener('click', () => {
            sidebar?.classList.toggle('mobile-open');
        });

        // Add customer button
        const addCustomerBtn = document.getElementById('addCustomerBtn');
        const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');
        
        addCustomerBtn?.addEventListener('click', () => this.showAddCustomerPage());
        cancelCustomerBtn?.addEventListener('click', () => this.cancelAddCustomer());
    }

    showAddCustomerPage() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.page-view').forEach(page => page.classList.add('hidden'));
        document.getElementById('addCustomerPage')?.classList.remove('hidden');
        document.getElementById('pageTitle').textContent = 'Add Customer';
    }

    cancelAddCustomer() {
        document.querySelectorAll('[data-page="customers"]')[0]?.click();
    }

    simulateLoading() {
        setTimeout(() => {
            const statusIndicator = document.getElementById('statusIndicator');
            if (statusIndicator) {
                statusIndicator.innerHTML = '<i class="fas fa-check-circle"></i> <span>System is running normally</span>';
                statusIndicator.className = 'status-indicator status-running';
            }
        }, 2000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CRMApp();
});