/**
 * Created by Soman Dubey on 12/31/13.
 */

var validator = function (schema) {
    return {
        _isNotBlank: function(value, condition) {
            if (condition) {
                return condition;
            }
            return value && value.length;
        },

        assertIsNotBlankPath: function (path, condition) {
            var self = this;

            schema.path(path).validate(function(value) {
                    return self._isNotBlank(value, condition);
                }, path + ' cannot be blank');
        },

        assertIsNotBlankForThirdPartyUserPath: function (path, authTypes) {
            var isThirdPartyLogin = (authTypes.indexOf(this.provider) !== -1);
            return this.assertIsNotBlankPath(path, isThirdPartyLogin);
        }
    }
};

module.exports = validator;