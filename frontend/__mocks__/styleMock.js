export default new Proxy({}, {
    get: function(target, prop) {
        return prop;
    }
});
