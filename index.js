

var co = function(fn) {

    //TODO: type assert
    var gen = fn();

    var promise = new Promise(function(resolve, reject) {

        var next = function (gen, args) {

            var msg = gen.next(args);
            var value = msg.value;

            // can do next
            if (gen && typeof gen.next !== 'undefined') {
                value.then(function(ret){
                    try {
                        next(gen, ret);
                    }
                    catch (error) {
                        reject(error)
                    }
                });
            }
            // Done
            else {
                resolve(value);
            }
        };

        next(gen);
    });

    return promise;
};

module.exports = co;
