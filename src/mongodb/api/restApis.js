/**
 * Created by Soman Dubey on 12/23/13.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var apis = require('./apis');
var models = require('../model/models');

var restApis = (function() {
    var setHeader = function (res, start) {
        if (start) {
            var dbtime = ( new Date().getTime() - start );
            res.header('dbtime', dbtime);
        }
    };

    var handleError = function (res, error) {
        var responseObj = apis.responseObj;
        responseObj['statusCode'] = 500;
        responseObj['content'] = 'Error: ' + (error.message || 'Server Error');
        responseObj['response_error'] = error;
        responseObj['stack'] = error && error.stack;
        res.send(responseObj['statusCode'], responseObj);
    };

    return {
        create: function(req, res, next) {
            var start = new Date().getTime();
            var collection = req.params.collection;
            var ModelRef = models.getModel(collection);
            if (ModelRef == null) {
                handleError(res, {message: 'node-mongodb error: Model structure needs to be defined. Refer documentation at https://github.com/somandubey/node-mongodb'});
            } else {
                try {
                    if(req.body) {
                        apis.obj_create(ModelRef, req.body, {
                            success: function (response) {
                                setHeader(res, start);
                                res.send(response['statusCode'], response['content']);
                            },
                            error: function (response) {
                                setHeader(res, start);
                                res.send(response['statusCode'], response['content']);
                            }
                        });
                    } else {
                        var response = apis.response;
                        response['statusCode'] = 400;
                        response['content'] = 'Request Content missing';
                        res.send(response['statusCode'], response);
                    }
                } catch (error) {
                    handleError(res, error);
                }
            }
        },

        find: function(req, res, next) {
            var start = new Date().getTime();
            var collection = req.params.collection;
            var ModelRef = models.getModel(collection);
            if (ModelRef == null) {
                handleError(res, {message: 'node-restmongo error: Model structure needs to be defined. Refer documentation at https://github.com/somandubey/node-restmongo'});
            } else {
                var id = req.params.id;
                if (id) {
                    req.query['_id__e'] = id;
                }
                try {
                    apis.obj_queries_get(ModelRef, req.query, {
                        success: function (response) {
                            setHeader(res, start);
                            if (id) {
                                res.send(response['statusCode'], response['content'].length ? response['content'][0] : {});
                            } else {
                                res.send(response['statusCode'], response['content']);
                            }
                        },
                        error: function (response) {
                            setHeader(res, start);
                            res.send(response['statusCode'], response['content']);
                        }
                    });
                } catch (error) {
                    handleError(res, error);
                }
            }
        },

        update: function(req, res, next) {
            var start = new Date().getTime();
            var collection = req.params.collection;
            var ModelRef = models.getModel(collection);
            if (ModelRef == null) {
                handleError(res, {message: 'node-restmongo error: Model structure needs to be defined. Refer documentation at https://github.com/somandubey/node-restmongo'});
            } else {
                var id = req.params.id;
                if (id) {
                    req.query['_id__e'] = id;
                } else {
                    req.query['multi'] = "true";
                }
                try {
                    apis.obj_queries_update(ModelRef, req.query, req.body, {
                        success: function (response) {
                            setHeader(res, start);
                            res.send(response['statusCode'], response['content']);
                        },
                        error: function (response) {
                            setHeader(res, start);
                            res.send(response['statusCode'], response['content']);
                        }
                    });
                } catch (error) {
                    handleError(res, error);
                }
            }
        },

        delete: function(req, res, next) {
            var start = new Date().getTime();
            var collection = req.params.collection;
            var ModelRef = models.getModel(collection);
            if (ModelRef == null) {
                handleError(res, {message: 'node-restmongo error: Model structure needs to be defined. Refer documentation at https://github.com/somandubey/node-restmongo'});
            } else {
                try {
                    apis.obj_queries_remove(ModelRef, req.query, {
                        success: function (response) {
                            setHeader(res, start);
                            res.send(response['statusCode'], response['content']);
                        },
                        error: function (response) {
                            setHeader(res, start);
                            res.send(response['statusCode'], response['content']);
                        }
                    });
                } catch (error) {
                    handleError(res, error);
                }
            }
        }
    }
}());

module.exports = restApis;