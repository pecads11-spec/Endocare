// js/db.js
// Fake Database using localStorage

const INITIAL_ARTICLES = [];

// Initialize DB
if (!localStorage.getItem("endocare_articles")) {
    localStorage.setItem("endocare_articles", JSON.stringify(INITIAL_ARTICLES));
}

// API for Articles
const db = {
    getArticles: function() {
        return JSON.parse(localStorage.getItem("endocare_articles")) || [];
    },
    getPublicArticles: function() {
        return this.getArticles().filter(a => a.status === 'active');
    },
    getArticleById: function(id) {
        return this.getArticles().find(a => a.id == id);
    },
    
    // Site Settings Methods
    getSiteSettings: function() {
        const isEnglish = window.location.pathname.includes('/en/');
        var defaultSettings = isEnglish ? {
            siteName: "EndoCare Yemen",
            siteEmail: "info@endocare-ye.com",
            sitePhone: "+967 712 345 678",
            siteAddress: "Hadda Street, Al-Barakah Commercial Building, Sana'a",
            siteDesc: "Your trusted partner for supplying certified medical vitamins and hormones in Yemen.",
            siteFb: "https://facebook.com/endocare",
            siteWa: "https://wa.me/967712345678",
            siteTg: "https://telegram.me/endocare",
            siteLi: "https://linkedin.com/company/endocare"
        } : {
            siteName: "EndoCare اليمن",
            siteEmail: "info@endocare-ye.com",
            sitePhone: "+967 712 345 678",
            siteAddress: "شارع حدة، مبنى البركة التجاري، صنعاء",
            siteDesc: "شريكك الموثوق لتوريد الفيتامينات والهرمونات الطبية المعتمدة في اليمن.",
            siteFb: "https://facebook.com/endocare",
            siteWa: "https://wa.me/967712345678",
            siteTg: "https://telegram.me/endocare",
            siteLi: "https://linkedin.com/company/endocare"
        };
        var stored = localStorage.getItem("endocare_settings");
        if(stored) {
            return Object.assign({}, defaultSettings, JSON.parse(stored));
        }
        return defaultSettings;
    },
    saveSiteSettings: function(settings) {
        localStorage.setItem("endocare_settings", JSON.stringify(settings));
    },
    saveArticles: function(articles) {
        localStorage.setItem("endocare_articles", JSON.stringify(articles));
    },
    addArticle: function(article) {
        const articles = this.getArticles();
        article.id = Date.now();
        articles.push(article);
        this.saveArticles(articles);
    },
    updateArticle: function(id, updatedData) {
        const articles = this.getArticles();
        const index = articles.findIndex(a => a.id == id);
        if (index !== -1) {
            articles[index] = { ...articles[index], ...updatedData };
            this.saveArticles(articles);
        }
    },
    deleteArticle: function(id) {
        let articles = this.getArticles();
        articles = articles.filter(a => a.id != id);
        this.saveArticles(articles);
    },

    // API for Products
    getProducts: function() {
        return JSON.parse(localStorage.getItem("endocare_products")) || [];
    },
    getFeaturedProducts: function() {
        return this.getProducts().filter(p => p.featured === 'yes' && p.status === 'نشط');
    },
    getProductById: function(id) {
        return this.getProducts().find(p => p.id == id);
    },
    saveProducts: function(products) {
        localStorage.setItem("endocare_products", JSON.stringify(products));
    },
    addProduct: function(product) {
        const products = this.getProducts();
        product.id = Date.now();
        products.push(product);
        this.saveProducts(products);
    },
    updateProduct: function(id, updatedData) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            this.saveProducts(products);
        }
    },
    deleteProduct: function(id) {
        let products = this.getProducts();
        products = products.filter(p => p.id != id);
        this.saveProducts(products);
    },

    // API for Orders
    getOrders: function() {
        return JSON.parse(localStorage.getItem("endocare_orders")) || [];
    },
    saveOrders: function(orders) {
        localStorage.setItem("endocare_orders", JSON.stringify(orders));
    },
    addOrder: function(order) {
        const orders = this.getOrders();
        order.id = Date.now();
        orders.push(order);
        this.saveOrders(orders);
    },
    deleteOrder: function(id) {
        let orders = this.getOrders();
        orders = orders.filter(o => o.id != id);
        this.saveOrders(orders);
    },

    // API for Inquiries
    getInquiries: function() {
        return JSON.parse(localStorage.getItem("endocare_inquiries")) || [];
    },
    saveInquiries: function(inquiries) {
        localStorage.setItem("endocare_inquiries", JSON.stringify(inquiries));
    },
    addInquiry: function(inquiry) {
        const inquiries = this.getInquiries();
        inquiry.id = Date.now();
        inquiries.push(inquiry);
        this.saveInquiries(inquiries);
    },
    deleteInquiry: function(id) {
        let inquiries = this.getInquiries();
        inquiries = inquiries.filter(i => i.id != id);
        this.saveInquiries(inquiries);
    },

    // API for PV Reports
    getPVReports: function() {
        return JSON.parse(localStorage.getItem("endocare_pv_reports")) || [];
    },
    savePVReports: function(reports) {
        localStorage.setItem("endocare_pv_reports", JSON.stringify(reports));
    },
    addPVReport: function(report) {
        const reports = this.getPVReports();
        report.id = Date.now();
        reports.push(report);
        this.savePVReports(reports);
    },
    deletePVReport: function(id) {
        let reports = this.getPVReports();
        reports = reports.filter(r => r.id != id);
        this.savePVReports(reports);
    }
};

window.db = db;
