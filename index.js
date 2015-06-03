

var co = function(fn) {

    //TODO: type assert
    var gen = fn();

    return new Promise(function(resolve, reject) {

        var next = function (gen, args) {

            if (args instanceof Error) {
                var msg = gen.throw(args);
            }
            else {
                var msg = gen.next(args);
            }
            var done = msg.done;
            if (done === true) resolve(this);
            var value = msg.value;

            // can do next
            if (gen && typeof gen.next !== 'undefined') {

                // Decompose
                var promise = decompose(value);

                function decompose(value) {

                    // promise
                    if (value instanceof Promise) {
                        return value
                    }

                    // Array
                    else if (value instanceof Array) {
                        return Promise.all(value.map(decompose));
                    }

                    // Object
                    else if (value instanceof Object) {

                        var keys = Object.keys(value);
                        var toDoList = [];
                        for (var i = 0; i < keys.length; ++i) {
                            var key = keys[i];
                            toDoList[i] = decompose(value[key]);
                        }

                        return Promise.all(toDoList)
                            .then(function (toDoList) {
                                var ret = {};
                                for (var i = 0; i < keys.length; ++i) {
                                    key = keys[i];
                                    ret[key] = toDoList[i];
                                }
                                return ret;
                            }, function (error) {
                                console.log("other" + error);
                            });
                    }
                    else
                        return value;
                    /*
                    // not promise included
                    else {
                        return Promise.resolve(value);
                    }
                    */
                };

                promise.then(function(value){
                    try {
                        next(gen, value);
                    }
                    catch (error) {
                        reject(error);
                    };
                }, function(error){
                    try {
                        if (!(error instanceof Error))
                            error = new Error(error);
                        next(gen, error);
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            }
        };

        next(gen);

    });
};

module.exports = co;
