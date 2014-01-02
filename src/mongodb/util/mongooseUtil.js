/**
 * Created by Soman Dubey on 12/27/13.
 */
var mongoose = require('mongoose');

var mongodbUtil = (function () {
    var db;
    return {
        init: function (mongodbHost, mongodbDb) {
            var _mongodbUrl = (mongodbHost && mongodbDb) ? "mongodb://" + mongodbHost + "/" + mongodbDb : "mongodb://localhost/test";
            this.initUrl(_mongodbUrl);
        },

        initUrl: function (_mongodbUrl) {
            console.log('mongodb connection url: %s', _mongodbUrl);
            // connect to Mongo when the app initializes
            this.db = mongoose.connect(_mongodbUrl, { server: { poolSize: 5 }});
            this._start();
        },

        _start: function () {
            mongoose.connection.on('error', function(err) {
                console.log('Error connecting to DB:\n %s', err);
                // res.send(503, 'ERR');
            });
            mongoose.connection.on('open', function() {
                mongoose.connection.db.serverConfig.options.auto_reconnect = true;
            });

            mongoose.connection.on('connected', function() {
                console.log('Connection to MongoDB connected');
            });

            mongoose.connection.on('close', function() {
                console.log('Connection to MongoDB closed');
            });
        },

        getDB: function() {
            return this.db;
        }
    };
});

module.exports = mongodbUtil;