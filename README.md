node-mongodb
==============

[node-mongodb](https://github.com/somandubey/node-mongodb) - An open source rest framework for mongodb for node.js.

# How to setup

This should work

	npm install node-mongodb

Or you will have to clone this repository (from github) in your local and then goto root directory of this node-mongodb and type

	npm link

Above will create a global soft link for node-mongodb. You can check that by typing

	npm ls -g

 Then goto your project root directory where you want use node-mongodb and type

	npm link node-mongodb

That's it you are good to use it.

# How to use


## Server Side usage
Documentation needs to be updated.

- Install
- Get
- Put
- Post
- Delete
 
## Client Side usage

GET (**FIND**) Api format

> 
	/api/v1/defaults?offset=1&limit=10&select=name,age&multi=true&name__in=Name1,Name2&age__e=18&date__lte=2013-12-12&date__gte=2013-12-01&sort=+name,-age,_id

Above will fetch initial 10 documents ( `name and age` attributes from all the documents ) `where name in ("Name1","Name2") and age = 18 and date <= 2013-12-12 and date >= 2013-12-01`. and returned results will be sorted in `ascending order of name` then `descending order of age` and then `ascending order of _id`

POST (**CREATE**) Api format

> 
	/api/v1/defaults?offset=1&limit=10&select=name,age&multi=true&name__in=SomeName&age__e=18&date__lte=2013-12-12&date__gte=2013-12-01&sort=+name,-age,_id

Above will create a document with `name with retest` `where age = 18 and date <= 2013-12-12 and date >= 2013-12-01`.

PUT (**UPDATE**) Api format

> 
	/api/v1/defaults?multi=true&name__in=SomeName&age__e=18&date__lte=2013-12-12&date__gte=2013-12-01
	Request Body:
	{"name": "retest"}

Above will update all the documents' `name with retest` `where age = 18 and date <= 2013-12-12 and date >= 2013-12-01`.

DELETE (**DELETE**) Api format

> 
	/api/v1/defaults/<id>

Above will delete the documents `where id = <id>`.


# Available REST filters
 
## limiting no of documents in results
1. Use filter as `offset=1&limit=10`. This will return initial 10 documents.
2. Use `offset=15&limit=10` to get 15 to 25 documents (total 10 documents).
3. TODO - Use `limit=-1` to get all the documents. **USE OF THIS IS DISCOURAGED AND MAY HAVE PERFORMANCE IMPACTS.**
4. TODO - Use `offset=15&limit=-1` to get all the documents leaving initial 15 documents. **USE OF THIS IS DISCOURAGED AND MAY HAVE PERFORMANCE IMPACTS.**
5. if `offset` and `limit` are not passed as url query parameters, by default it will restrict and return initial 20 documents.

## selecting specific attributes from document
1. Use filter as `select=col1,col2`. This will return col1 and col2 in result.

## available results filters

* equal
 	1. Use filter as `col__e=10`. This will return all the results where `col=10`. ex: name__e=NAME1
* not equals
 	1. Use filter as `col__ne=10`. This will return all the results where `col!=10`. ex: age__ne=10
* greater than
 	1. Use filter as `col__gt=10`. This will return all the results where `col>10`. ex: date__gt=2013-12-18
* greater than and equals to
 	1. Use filter as `col__gte=10`. This will return all the results where `col>=10`. ex: date__gte=2013-12-18
* less than
 	1. Use filter as `col__lt=10`. This will return all the results where `col<10`. ex: date__lt=2013-12-18
* less than and equals to
 	1. Use filter as `col__lte=10`. This will return all the results where `col<=10`. ex: date__lte=2013-12-18
* in
 	1. Use filter as `col__in=NAME1,NAME2`. This will return all the results where `col in ("NAME1","NAME2")`. ex: name__in=NAME1,NAME2
* not in
 	1. Use filter as `col__nin=NAME1,NAME2`. This will return all the results where `col not in ("NAME1","NAME2")`. ex: name__nin=NAME1,NAME2
* alll
 	1. Use filter as `col__all=NAME1,NAME2`. This will return all the documents where value of a field is an array that contains all the specified element. ex: date__all=NAME1,NAME2

* regex
 	1. Use filter as `col__regex=/.*/`. This will return all the documents where sepcific column data matches agains mentioned regular expression.
 
* type
 	1. Use filter as `col__type=1`. This will return all the results where `type(col)=value`. ex: date__type=9
 	2. Here value is a symbolic representation for various mongodb data types. Refer below table for reference

| data type             | data type value |
| --------------------- |----------------:|
| double                | 1               |
| string                | 2               |
| object                | 3               |
| array                 | 4               |
| binary_data           | 5               |
| object_id             | 7               |
| boolean               | 8               |
| date                  | 9               |
| null                  | 10              |
| regular_expression    | 11              |
| javascript            | 13              |
| symbol                | 14              |
| javascript_with_scope | 15              |
| 32_bit_integer        | 16              |
| timestamp             | 17              |
| 64_bit_integer        | 18              |
| min_key               | 255             |
| max_key               | 127             |


* mod
 	1. To udpate

# Wiki

Refer [Wiki](https://github.com/somandubey/node-mongodb/wiki) for more details.

# Issues

Refer issues [here](https://github.com/somandubey/node-mongodb/issues).

# Contributors

Everybody is invited to contribute here.

# The MIT License (MIT)

Copyright (c) 2013

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Refer [MIT License](https://github.com/somandubey/node-mongodb/blob/master/LICENSE) for details.
