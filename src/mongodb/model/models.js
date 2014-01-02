/**
 * Created by Soman Dubey on 12/27/13.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var validator = require('./validator');
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

        setModel: function (modelName, schema) {
            var model = mongoose.model(modelName, schema);
            if ( !endsWith(modelName, "s") ) {
                models[modelName.toLowerCase()+"s"] = mongoose.model(modelName.toString(), model);
                console.log('model created with pluralized syntax ('+modelName.toLowerCase()+'s) as its a good practise to pluralize your model name as mongodb collection name follows plural.');
            } else {
                models[modelName.toLowerCase()] = mongoose.model(modelName.toString(), model);
            }
            return true;
        },

        validator: function (schema) {
            return validator(schema);
        }
    };
}());

module.exports = models;