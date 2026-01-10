export class ThemeManager {
    constructor() {
        this.body = document.body;
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('i');
        this.themeText = this.themeToggle?.querySelector('span');
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.bindEvents();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
    }

    setLightTheme() {
        this.body.classList.replace('theme-dark', 'theme-light');
        if (this.themeIcon) this.themeIcon.className = 'fas fa-moon';
        if (this.themeText) this.themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }

    setDarkTheme() {
        this.body.classList.replace('theme-light', 'theme-dark');
        if (this.themeIcon) this.themeIcon.className = 'fas fa-sun';
        if (this.themeText) this.themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }

    bindEvents() {
        this.themeToggle?.addEventListener('click', () => {
            this.body.classList.contains('theme-dark') 
                ? this.setLightTheme() 
                : this.setDarkTheme();
        });
    }
}
