module.exports = {
    select: function (selected, option) {
        return (selected == option) ? 'selected="selected"' : '';
    },
    nullcheck: function(value) {
        return (value !== undefined) ? true : false;
    },
    upperCase: function(value) {
        return value.toUpperCase();
    },
    lowerCase: function(value) {
        return value.toLowerCase();
    }
};
