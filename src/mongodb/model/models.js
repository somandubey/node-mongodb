/**
 * Created by Soman Dubey on 12/27/13.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

var models = (function () {
    var defaultSchema = new Schema({
        //_id: ObjectId,
        "name": String
    });
    var defaultsModel = mongoose.model('defaults', defaultSchema);

    var models = {
        defaults: defaultsModel
    };

    var endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    return {
        getModel: function (collectionName) {
            return models[collectionName] || null;
        },

        setModel: function (collectionName, schema) {
            models[collectionName.toLowerCase()] = mongoose.model(collectionName.toString(), schema);
            if ( !endsWith(collectionName, "s") ) {
                console.log('model created but its a good practise to pluralize your model name as mongodb collection name will always be plural.');
            }
            return true;
        }
    };
}());

module.exports = models;