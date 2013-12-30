/**
 * Created by Soman Dubey on 12/29/13.
 */
var Schema = require('mongoose').Schema;
var schemaEnums = require('./schemaEnums');

// Todo - refactor move, some of user related information into node-auth module.
var customSchemaTypes = (function () {
    var nameSchemaTypeWithIndex = {
        first: { type: String, index: true },
        middle: { type: String, index: true },
        last: { type: String, index: true }
    };

    var nameSchemaType = {
        first: { type: String },
        middle: { type: String },
        last: { type: String }
    };

    var emailSchemaType = {
        email: {type: String, lowercase: true },
        type: {type: String, lowercase: true }    // It can have value as personal, work, admin, sales, info, hr, careers
    };

    var addressSchemaType = {
        no: String,
        street: String,
        street2: String,
        city: String,
        state: String,
        country: String,
        pinCode: String,
        googleMapsLocation: String,
        landmark: String
    };

    var phoneSchemaType = {
        phone: [{type: String, lowercase: true }],
        type: {type: String, lowercase: true }    // It can have value as work, home, sales, admin, mobile, hr, career, fax
    };

    var instantMessengersSchemaType = [{
        id: [{type: String}],
        type: {type: String, lowercase: true }    // It can have value as google+, yahoo, skype etc
    }];

    var contactSchemaType = {
        address : {
            current: addressSchemaType,
            permanent: addressSchemaType
        },
        phone: [phoneSchemaType],
        email: [emailSchemaType],
        fax: [phoneSchemaType],
        instantMessengers: [instantMessengersSchemaType]
    };

    var userSchemaType = {
        type: String, id: String // ToDo : add more here
    };

    var userRefSchemaType = {
        _id: String,
        name: nameSchemaType
    };

    return {
        nameSchemaTypeWithIndex: nameSchemaTypeWithIndex,
        nameSchemaType: nameSchemaType,
        emailSchemaType: emailSchemaType,
        addressSchemaType: addressSchemaType,
        phoneSchemaType: phoneSchemaType,
        contactSchemaType: contactSchemaType,
        userSchemaType: userSchemaType,
        userRefSchemaType: userRefSchemaType
    };
}());

module.exports = customSchemaTypes;