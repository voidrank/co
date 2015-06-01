var co      = require("co");
var assert  = require("assert");

var result = co(function * (){

    // test 1
    var test_promise_1 = Promise.resolve(123);
    var test_value_1 = yield test_promise_1;
    assert.equal(test_value_1, 123,
        "Test 1: single resolved promise test failed");

    var async_func = function(return_value) {
        return function(resolve, reject){
            setTimeout(function(){
                resolve(return_value);
            }, 0);
        };
    };

    // test 2
    var test_promise_2 = new Promise(async_func("123"));
    var test_value_2 = yield test_promise_1;
    assert.equal(test_value_2, "123",
        "Test 2: single deferred promise test failed");

    // test 3
    var test_promise_3 = [
        Promise.resolve(123),
        new Promise(async_func("wtf!!!!")),
        Promise.resolve([123, 123, 123]),
        [new Promise(async_func(123))], // promise in recursive array
        [new Promise(async_func(new Promise(async_func(123))))] // recursive promise
    ];
    var test_value_3 = yield test_promise_3;
    var std_value_3 = [123, "wtf!!!!", [123, 123, 123], [123], [123]];
    assert.deepEqual(test_value_3, std_value_3,
        "Test 3: promise array test failed");

    var test_promise_4 = {
        "test1": Promise.resolve(123),
        "test2": Promise.resolve([123, 123, 123]),
        "test3": new Promise(async_func(123)),
        "test4": {
            "sub_test1": new Promise(async_func(123)),
            "sub_test2": new Promise(async_func(new Promise(async_func(123)))),
        }
    };
    var test_value_4 = yield test_promise_4;
    var std_value_4 = {
        "test1": 123,
        "test2": [123, 123, 123],
        "test3": 123,
        "test4": {
            "sub_test1": 123,
            "sub_test2": 123
        }
    }
    assert.deepEqual(test_value_4, std_value_4,
        "Test 4: promise object test failed"
    );
})
.catch(function(err) {
    console.log(err);
});
