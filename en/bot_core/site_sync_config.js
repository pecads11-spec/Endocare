/**
 * Site DB Sync Configuration for EndoBot
 * This module provides mapping and integration logic between the bot's core 
 * and the main website's storage (e.g., localStorage, Database APIs).
 */

const SiteSyncConfig = {
    // Defines paths and access methods for website's dynamic content
    dbSources: {
        products: "endocare_products", // localStorage key used in the website
        articles: "endocare_articles"  // localStorage key for blog/articles
    },

    /**
     * Fetch relevant products based on query keywords
     * @param {string} query - The search string or keywords
     * @returns {Array} - List of matched products
     */
    searchProducts(query) {
        if (typeof window === 'undefined' || !window.localStorage) return [];
        try {
            const rawProducts = localStorage.getItem(this.dbSources.products);
            if (!rawProducts) return [];
            
            const products = JSON.parse(rawProducts);
            const lowerQuery = query.toLowerCase();
            
            return products.filter(p => 
                (p.nameAr && p.nameAr.toLowerCase().includes(lowerQuery)) ||
                (p.nameEn && p.nameEn.toLowerCase().includes(lowerQuery)) ||
                (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
                (p.desc && p.desc.toLowerCase().includes(lowerQuery))
            ).filter(p => p.status === 'نشط'); 
        } catch (error) {
            console.error("Error syncing with site products DB:", error);
            return [];
        }
    },

    /**
     * Get product details by exact name
     */
    getProductByName(name) {
         const products = this.searchProducts(name);
         return products.length > 0 ? products[0] : null;
    }
};

export default SiteSyncConfig;
