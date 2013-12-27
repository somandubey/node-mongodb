/**
 * Created by Soman Dubey on 12/27/13.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var models = (function () {
    var defaultSchema = new Schema({
        _id: Object
    });
    var defaultModel = mongoose.model('default', defaultSchema);

    var models = {
        default: defaultModel
    };

    return {
        getModel: function (collectionName) {
            return models[collectionName] || null;
        },

        setModel: function (collectionName, schema) {
            models[collectionName] = mongoose.model(collectionName.toString(), schema);
            return true;
        }
    };
}());

module.exports = models;