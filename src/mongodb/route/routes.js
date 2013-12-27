/**
 * Created by Soman Dubey on 12/27/13.
 */

var routes = (function() {
    var app;
    var restApis = require('../api/restApis');

    function performanceMiddleware(req, res, next) {
        next();
    };

    /**
     * todo : to be updated later.
     * @param req
     * @param res
     * @param next
     */
    function ensureAuthenticationForApi (req, res, next) {
        next();
    };

    /**
     * todo : to be updated later.
     *
     * @param req
     * @param res
     * @param next
     */
    function ensureAuthorizationForApi (req, res, next) {
        next();
    };

    return {
        /**
         * This method initializes default paths.
         *
         * @param expressApp - express object
         */
        init: function (expressApp) {
            app = expressApp;

            app.post('/api/v1/:collection', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.create);        // Creates Object
            app.get('/api/v1/:collection', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.find);           // Gets All objects
            app.get('/api/v1/:collection/:id', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.find);       // Get One Specific Object
            app.put('/api/v1/:collection', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.update);     // Updates all Object
            app.put('/api/v1/:collection/:id', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.update);     // Updates specific Object
            app.delete('/api/v1/:collection/:id', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.delete);  // Deletes specific object
        }
    }
}());

module.exports = routes;