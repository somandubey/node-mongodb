/**
 * Created by Soman Dubey on 12/21/13.
 */
var constants = require('../util/constants');

var apis = (function () {
    var BsonTypes = {
        'double': 1,
        'string': 2,
        'object': 3,
        'array': 4,
        'binary_data': 5,
        'object_id': 7,
        'boolean': 8,
        'date': 9,
        'null': 10,
        'regular_expression': 11,
        'javascript': 13,
        'symbol': 14,
        'javascript_with_scope': 15,
        '32_bit_integer': 16,
        'timestamp': 17,
        '64_bit_integer': 18,
        'min_key': 255,
        'max_key': 127
    }

    var _responseObj = {
        "statusCode": 404,
        "headers": {},
        "content": null,
        "error": null,
        "stack": null
    };

    var defaultHandleSuccess = function (response) {
        console.log(response);
    };

    var defaultHandleError = function (response) {
        console.log(response);
    };

    var handleError = function (callback, error, statusCode, content, meta, modelRef) {
        var responseObj = _responseObj;
        responseObj['statusCode'] = statusCode || 500;
        responseObj['content'] = content || "not done.";

        responseObj['err'] = error;
        responseObj['stack'] = error || error.stack;
        responseObj = { 'data' : responseObj}
        responseObj['meta'] = meta;

        console.error(error);

        if(callback && callback.error) {
            callback.error(responseObj, modelRef);
        } else {
            defaultHandleError(responseObj, modelRef);
        }
        // return res.send(responseObj['statusCode'], responseObj);
    };

    var handleSuccess = function (callback, statusCode, content, meta, modelRef) {
        var responseObj = _responseObj;
        responseObj['statusCode'] = statusCode || 200;
        responseObj['content'] = { 'data' : content};
        responseObj['content']['meta'] = meta;

        if(callback && callback.success) {
            callback.success(responseObj, modelRef);
        } else {
            defaultHandleSuccess(responseObj, modelRef);
        }
        // return res.send(responseObj['statusCode'], responseObj);
    }

    /**
     * filters
     * operators
     * offset, limit
     * multi update true ?
     *
     * @param queries
     * @returns {{filters: {}, offset: number, limit: number, multi: boolean, select: *, sort: *}}
     */
    var resolveQueries = function(queries){
        // var queries = req.query;
        var filters = {};
        var offset = 0;
        var limit = 20;
        var select = {};
        var populate = null;
        var sort = null;
        var multi = false;
        var failed = false;
        var queryParams = {
            filters: filters,
            offset: offset,
            limit: limit,
            multi: multi,
            select: select,
            sort: sort
        };
        if(queries) {
            Object.keys(queries).forEach(function (query) {
                query = query.toLowerCase();
                // query, req.query[query]
                var opIdx = query.indexOf('__')
                if (opIdx > 0) {
                    var operator = query.substring(opIdx+2);  // operator
                    var operand = query.substring(0, opIdx);  // operand
                    var value = queries[query];  // value
                    try {
                        filters = getFilters(filters, operator, operand, value);
                    } catch (error) {
                        console.error(error);
                        throw new Error(error);
                    }
                } else {
                    switch(query) {
                        case 'offset':
                            offset =  parseInt(queries[query]);
                            break;
                        case 'limit':
                            limit =  parseInt(queries[query]);
                            break;
                        case 'multi':
                            multi =  queries[query].toLowerCase() == "true";
                            break;
                        case '_id':
                            filters['_id'] = new constants.types.ObjectId(queries[query]);
//                            filters['_id'] = { "$oid": queries[query] };
                            break;
                        case 'populate':
                            populate = queries[query];
                            break;
                        case 'select':
                            var selectArr = queries[query].split(',');
                            if(selectArr.length) {
                                select = {};
                                Object.keys(selectArr).forEach(function (s) {
                                    //                                select.push(selectArr[s]);
                                    select[selectArr[s]] = 1;
                                });
                                select =  select;
                            }

                            break;
                        case 'sort':
                            var sortVals = queries[query].split(',');
                            if(sortVals) {
                                sort = {};
                                var sortValsLength = sortVals.length;
                                for( var i=0; i<sortValsLength; i++) {
                                    var c = sortVals[i].charAt(0);
                                    switch (c) {
                                        case '-':
                                            sort[sortVals[i].substring(1)] = -1;
                                            break;
                                        case '+':
                                            sort[sortVals[i].substring(1)] = 1;
                                            break;
                                        default:
                                            sort[sortVals[i]] = 1;
                                    }
                                }
                            }
                            break;
                        default:
                            var msg = 'filters: unknown parameter ('+query+':'+queries[query]+') received.';
                            console.error(msg);
                            throw new Error(msg);
                    }
                }
                queryParams['filters'] = filters;
                queryParams['offset'] = offset;
                queryParams['limit'] = limit;
                queryParams['select'] = select;
                queryParams['multi'] = multi;
                queryParams['sort'] = sort;
                queryParams['populate'] = populate;
            });
        }
        console.log(JSON.stringify(queryParams));
        return queryParams;
    }

    var getFilters = function(filters, operator, operand, value) {

        if(!filters[operand]) {
            filters[operand] = {};
        }
        switch(operator.toLowerCase()) {
            case 'gt':
                // filters[operand] = { $gt : value };
                filters[operand]['$gt'] = value;
                break;
            case 'lt':
                // filters[operand] = { $lt : value };
                filters[operand]['$lt'] = value;
                break;
            case 'gte':
                // filters[operand] = { $gte : value };
                filters[operand]['$gte'] = value;
                break;
            case 'lte':
                // filters[operand] = { $lte : value };
                filters[operand]['$lte'] = value;
                break;
            case 'e':
                filters[operand] = value;
                break;
            case 'ne':
                // filters[operand] = { $ne : value };
                filters[operand]['$ne'] = value;
                break;
            case 'in':
                // filters[operand] = { $in : getList(value) };
                filters[operand]['$in'] = getList(value);
                break;
            case 'nin':
                // filters[operand] = { $nin : getList(value) };
                filters[operand]['$nin'] = getList(value);
                break;
            case 'all':
                // filters[operand] = { $all : getList(value) };
                filters[operand]['$all'] = getList(value);
                break;
            case 'regex':
                // filters[operand] = { $regex : value };
                filters[operand]['$regex'] = value;
                break;
            case 'type':
                // exception for arrray type here: http://docs.mongodb.org/manual/reference/operator/query/type/#op._S_type
                var type = BsonTypes[value.toLowerCase()];
                if(!type) {
                    throw new Error('filters: not a valid value for type filter');
                }
                if( type != 4 ) {
                    // filters[operand] = { $type :  type};
                    filters[operand]['$type'] = type;
                } else {
                    // filters['$where'] = "Array.isArray(this." + operand + ")";
                    if (filters['$where']) {
                        filters['$where'] = value + ' && ' + filters['$where'];
                    } else {
                        filters['$where'] = value;
                    }
                }
                break;
            case 'exists':
                value = value.toLowerCase();
                switch (value) {
                    case 1:
                        value = true;
                        break;
                    case 0:
                        value = false;
                        break;
                    case true:
                    case false:
                        break;
                    default:
                        throw new Error('filters: not a valid value for exists filter');
                }
                // filters[operand] = { $exists : value };
                filters[operand]['$exists'] = value;
                break;
            case 'mod':
                value = value.trim();
                if ( !value.startsWith('[') || !value.endsWith(']') ) {
                    throw new Error('filters: not a valid value for mod filter');
                }
                // filters[operand] = { $mod : value };
                filters[operand]['$mod'] = value;
        }
        return filters;
    }

    var getList = function(value) {
        var valueList = [];
        var valueArr = value.split(',');
        Object.keys(valueArr).forEach(function(idx) {
            valueList.push(valueArr[idx]);
        });

        return valueList;
    };

    var meta = function (select, filters, options, update, multi) {
        return {
            select : select,
            filters : filters,
            options : options,
            update : update,
            multi : multi
        };
    }

    return {

        responseObj: function () {
            var responseObj = _responseObj
            return responseObj;
        },

        obj_queries_get: function (ModelRef, queries, callback) {
            var queryParams = resolveQueries(queries);
            var options = {
                skip: queryParams.offset,
                limit: queryParams.limit,
                sort: queryParams.sort
            };
            var populate = queryParams.populate;

            this.obj_get(ModelRef, queryParams.filters, queryParams.select, options, populate, callback)
        },

        obj_queries_update: function (ModelRef, queries, update, callback) {
            var queryParams = resolveQueries(queries);
            this.obj_update(ModelRef, queryParams.filters, update, queryParams.multi, callback)
        },

        obj_queries_remove: function (ModelRef, queries, callback) {
            var queryParams = resolveQueries(queries);
            this.obj_remove(ModelRef, queryParams.filters, callback)
        },

        obj_create: function (ModelRef, objToCreate, callback) {
            var modelRef = new ModelRef(objToCreate)
            // ModelRef.create(objToCreate, function (error, results, num) {
            modelRef.save(function (error, results, num) {
                var message;
                if (error) {
                    switch (err.code) {
                        case 11000:
                        case 11001:
                            message = 'already exists';
                            break;
                        default:
                            message = "not created, please fill all the required fields";
                    }
                    handleError(callback, error, null, message, meta(), modelRef);
                } else {
                    handleSuccess (callback, 201, {"_id": modelRef._id}, meta(), modelRef);
                }
            });
        },

        obj_get_by_id: function (ModelRef, filters, select, options, populate, callback) {
            ModelRef.findOne(filters, select, options).exec(function (error, results) {
                if (error) {
                    handleError(callback, error, null, "not found.", meta(select, filters, options));
                } else {
                    handleSuccess (callback, 200, results, meta(select, filters, options));
                }
            });
        },

        obj_get: function (ModelRef, filters, select, options, populate, callback) {
//            ModelRef.find(filters, select, options, function (error, results) {
//                if (error) {
//                    handleError(callback, error, null, "not found.", meta(select, filters, options));
//                } else {
//                    handleSuccess (callback, 200, results, meta(select, filters, options));
//                }
//            });
            var q = ModelRef.find(filters, select, options);
            q = (populate) ? q.populate(populate) : q;
            q.exec(function (error, results) {
                if (error) {
                    handleError(callback, error, null, "not found.", meta(select, filters, options));
                } else {
                    handleSuccess (callback, 200, results, meta(select, filters, options));
                }
            });
        },

        obj_update:  function (ModelRef, filters, update, multi, callback) {
            ModelRef.update(filters, { $set: update}, {multi : multi}, function (error, results) {
                if (error) {
                    handleError(callback, error, null, "not found.", meta(null, filters, options, update, multi));
                } else {
                    handleSuccess (callback, 204, results, meta(null, filters, options, update, multi));
                }
            });
        },

        obj_remove: function (ModelRef, filters, callback) {
            ModelRef.remove(filters, function (error, results) {
                if (error) {
                    handleError(callback, error, null, "not found.", meta(null, filters));
                } else {
                    handleSuccess (callback, 200, results, meta(null, filters));
                }
            });
        }
    }

}());

module.exports = apis;