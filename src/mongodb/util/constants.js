/**
 * Created by Soman Dubey on 12/21/13.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

exports.autoIndexWhileStartup = false;
exports.safe = true;
exports.bufferCommands = false;
exports.strict = 'throw';

exports.schemaType = {
    ObjectId: ObjectId
};

exports.types = {
    ObjectId: mongoose.Types.ObjectId
};