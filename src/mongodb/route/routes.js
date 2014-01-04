/**
 * Created by Soman Dubey on 12/27/13.
 */
var routes = (function() {
    var restApis = require('../api/restApis');
    var models = require('../model/models');
    var constants = require('../util/constants');
    var customSchemaTypes = require('../util/customSchemaTypes');
    var schemaEnums = require('../util/schemaEnums');
    var mongoose = require('mongoose');
    var apis = require('../api/apis');
    var mongooseUtil = require('../util/mongooseUtil');

    var mu;

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
        init: function () {
            this.mu = mongooseUtil()
            return this;
        },

        connect: function (host, port) {
            switch(arguments.length) {
                case 1:
                    console.log('mongodb url called:'+host);
                    this.mu.initUrl(host);
                    break;
                default:
                    console.log('mongodb params called:'+host+":"+port);
                    this.mu.init(host, port);
            }
            mongoose.set('debug', true);
            mongoose.set('verbose', true);
            return this;
        },

        initRoutes: function (app) {
            app.post('/api/v1/:collection', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.create);        // Creates Object
            app.get('/api/v1/:collection', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.find);           // Gets All objects
            app.get('/api/v1/:collection/:id', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.find);       // Get One Specific Object
            app.put('/api/v1/:collection', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.update);     // Updates all Object
            app.put('/api/v1/:collection/:id', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.update);     // Updates specific Object
            app.delete('/api/v1/:collection/:id', performanceMiddleware, ensureAuthenticationForApi, ensureAuthorizationForApi, restApis.delete);  // Deletes specific object

            return this;
        },

        constants: constants,
        customSchemaTypes: customSchemaTypes,
        schemaEnums: schemaEnums,
        models: models,
        mongoose: mongoose,
        apis: apis,
        getMU: function () {
            return this.mu;
        }
    }
}());

module.exports = routes;