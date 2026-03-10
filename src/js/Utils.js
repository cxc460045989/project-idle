// 工具函数 - Utils.js

export const Utils = {
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomFloat: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    formatPercent: function(value, decimals = 0) {
        return (value * 100).toFixed(decimals) + '%';
    },
    
    formatNumber: function(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },
    
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    shuffle: function(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },
    
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
