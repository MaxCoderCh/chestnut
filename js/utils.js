!(function(win, doc){
    win.myLocal = new Object();
    myLocal.setItem = function(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }
    myLocal.getItem = function(key, data) {
        return JSON.parse(window.localStorage.getItem(key));
    }
    myLocal.deleteItem = function(key) {
        window.localStorage.removeItem(key);
    }
    myLocal.clearItem = function() {
        window.localStorage.clear();
    }
})(window, document);
