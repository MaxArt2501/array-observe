(function(root, tests) {
    if (typeof define === "function" && define.amd)
        define(["expect", "object-observe", "array-observe"], tests);
    else if (typeof exports === "object")
        tests(require("expect.js"), require("object.observe"), require("../array-observe.js"));
    else tests(root.expect);
})(this, function(expect) {
"use strict";

function looseIndexOf(pivot, array) {
    for (var i = 0, r = -1; i < array.length && r < 0; i++)
        if (expect.eql(array[i], pivot)) r = i;
    return r;
};

expect.Assertion.prototype.looselyContain = function(obj) {
    this.assert(~looseIndexOf(obj, this.obj),
        function(){ return 'expected ' + expect.stringify(this.obj) + ' to contain ' + expect.stringify(obj) },
        function(){ return 'expected ' + expect.stringify(this.obj) + ' to not contain ' + expect.stringify(obj) }
    );
    return this;
};

if (typeof Object.observe === "function") {
    console.log(/\{ \[native code\] \}/.test(Object.observe.toString())
            ? "Object.observe is natively supported by the environment"
            : "Object.observe has been correctly polyfilled");
} else console.log("Object.observe has NOT been polyfilled");

if (typeof Array.observe === "function") {
    console.log(/\{ \[native code\] \}/.test(Array.observe.toString())
            ? "Array.observe is natively supported by the environment"
            : "Array.observe has been correctly polyfilled");
} else console.log("Array.observe has NOT been polyfilled");

var timeout = 30;

describe("Array.observe", function() {
    it("should notify 'add', 'update' and 'delete' changes", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(3)
                    .and.to.looselyContain({ type: "add", name: "test", object: array })
                    .and.to.looselyContain({ type: "update", name: "0", object: array, oldValue: "foo" })
                    .and.to.looselyContain({ type: "delete", name: "foo", object: array, oldValue: "bar" });
                tested = true;
            } catch (e) { done(e); }
        }

        var array = [ "foo" ],
            tested = false;
        array.foo = "bar";
        Array.observe(array, handler);

        array.test = "Hello!";
        array[0] = "bar";
        delete array.foo;

        Array.unobserve(array, handler);

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });

    it("should notify 'splice' changes when using 'push'", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(1)
                    .and.to.looselyContain({ type: "splice", object: array, addedCount: 2, removed: [], index: 1 });
                tested = true;
            } catch (e) { done(e); }
        }

        var array = [ "foo" ],
            tested = false;
        Array.observe(array, handler);

        var len = array.push("bar", "baz");

        Array.unobserve(array, handler);

        expect(len).to.be(3);
        expect(array).to.eql([ "foo", "bar", "baz" ]);

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });

    it("should notify 'splice' changes when using 'pop'", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(1)
                    .and.to.looselyContain({ type: "splice", object: array, addedCount: 0, removed: [ "bar" ], index: 1 });
                tested = true;
            } catch (e) { done(e); }
        }

        var array = [ "foo", "bar" ],
            tested = false;
        Array.observe(array, handler);

        var item = array.pop();

        Array.unobserve(array, handler);

        expect(item).to.be("bar");

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });

    it("should not notify 'splice' changes when popping an empty array", function(done) {
        function handler() {
            done(new Error("expected no changes"));
        }

        var array = [];
        Array.observe(array, handler);

        array.pop();

        Array.unobserve(array, handler);

        setTimeout(done, timeout);
    });

    it("should notify 'splice' changes when using 'unshift'", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(1)
                    .and.to.looselyContain({ type: "splice", object: array, addedCount: 2, removed: [], index: 0 });
                tested = true;
            } catch (e) { done(e); }
        }

        var array = [ "foo" ],
            tested = false;
        Array.observe(array, handler);

        var len = array.unshift("bar", "baz");

        Array.unobserve(array, handler);

        expect(len).to.be(3);
        expect(array).to.eql([ "bar", "baz", "foo" ]);

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });

    it("should notify 'splice' changes when using 'shift'", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(1)
                    .and.to.looselyContain({ type: "splice", object: array, addedCount: 0, removed: [ "foo" ], index: 0 });
                tested = true;
            } catch (e) { done(e); }
        }

        var array = [ "foo", "bar" ],
            tested = false;
        Array.observe(array, handler);

        var item = array.shift();

        Array.unobserve(array, handler);

        expect(item).to.be("foo");

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });

    it("should not notify 'splice' changes when shifting an empty array", function(done) {
        function handler() {
            done(new Error("expected no changes"));
        }

        var array = [];
        Array.observe(array, handler);

        array.shift();

        Array.unobserve(array, handler);

        setTimeout(done, timeout);
    });

    it("should notify 'splice' changes when using 'splice'", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(1)
                    .and.to.looselyContain({ type: "splice", object: array, addedCount: 2, removed: [ "bar" ], index: 1 });
                tested = true;
            } catch (e) { done(e); }
        }

        var array = [ "foo", "bar", "baz" ],
            tested = false;
        Array.observe(array, handler);

        var removed = array.splice(1, 1, "lorem", "ipsum");

        Array.unobserve(array, handler);

        expect(removed).to.eql([ "bar" ]);
        expect(array).to.eql([ "foo", "lorem", "ipsum", "baz" ]);

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });

    it("should not notify 'splice' changes when splicing with no effect", function(done) {
        function handler() {
            done(new Error("expected no changes"));
        }

        var array = [ "foo" ];
        Array.observe(array, handler);

        array.splice(2, 1);
        array.splice(1, 0);

        Array.unobserve(array, handler);

        setTimeout(done, timeout);
    });

    it("should be stopped when using 'Object.unobserve'", function(done) {
        function handler() {
            done(new Error("expected no changes"));
        }

        var array = [];
        Array.observe(array, handler);
        Object.unobserve(array, handler);

        array.push("foo");

        setTimeout(done, timeout);
    });
});

describe("Array.unobserve", function() {
    it("should work just like 'Object.unobserve'", function(done) {
        function handler(changes) {
            try {
                expect(tested).to.be(false);
                expect(changes).to.have.length(1);
                expect(changes[0]).to.eql({ type: "add", name: "foo", object: obj });
                tested = true;
            } catch (e) { done(e); }
        }

        var obj = {},
            tested = false;
        Object.observe(obj, handler);

        obj.foo = 6;

        Array.unobserve(obj, handler);

        obj.foo = 28;

        setTimeout(function() {
            try {
                expect(tested).to.be(true);
                done();
            } catch (e) { done(e); }
        }, timeout);
    });
});

});
