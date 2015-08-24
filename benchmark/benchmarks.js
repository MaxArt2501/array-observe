
(function(root, tests) {
    if (!root.original) root.original = {
        push: Array.prototype.push,
        pop: Array.prototype.pop,
        unshift: Array.prototype.unshift,
        shift: Array.prototype.shift,
        splice: Array.prototype.splice
    };

    if (typeof define === "function" && define.amd)
        define(["expect", "object-observe"], tests);
    else if (typeof exports === "object")
        tests(require("benchmark"), root, require("object.observe"), require("../array-observe.js"));
    else tests(root.Benchmark, root);
})(typeof global !== "undefined" ? global : this, function(Benchmark, root) {
"use strict";

var onDOM = typeof document !== "undefined";

if (!Array.prototype.push._original) {
    var message = "This environment already supports Array.observe";

    if (onDOM) document.body.innerHTML = message;
    else console.log(message);

    return;
}

root.wrapped = {};
root.original = {};
root.foo = function(array) { array[100]--; };

var methods = "push pop unshift shift splice".split(" ");
for (var i = 0; i < methods.length; i++) {
    root.wrapped[methods[i]] = Array.prototype[methods[i]];
    root.original[methods[i]] = Array.prototype[methods[i]]._original;
}

var padspace = (new Array(81)).join(" ");
function padL(text, length) {
    return (padspace + text).slice(-length);
}
function padR(text, length) {
    return (text + padspace).slice(0, length);
}


if (onDOM) {
    var parent = document.getElementsByTagName("tbody")[0];

    var initBench = function() {
            var row = this.row = document.createElement("tr"),
                cell = document.createElement("td");
            cell.innerHTML = this.name;
            row.appendChild(cell);

            this.cells = [];
            cell = document.createElement("td");
            cell.className = "samples";
            this.cells.push(cell);
            row.appendChild(cell);
            cell = document.createElement("td");
            cell.className = "count";
            this.cells.push(cell);
            row.appendChild(cell);
            cell = document.createElement("td");
            cell.className = "frequency";
            this.cells.push(cell);
            row.appendChild(cell);

            parent.appendChild(row);
        },
        onCycle = function() {
            this.cells[0].innerHTML = ++this.samples;
            this.cells[1].innerHTML = this.count;
            this.cells[2].innerHTML = this.hz.toFixed(2);
        };
} else {
    var writeOut = typeof process === "undefined" || !process.stdout || !process.stdout.isTTY
            ? function(text) { console.log(text); }
            : function(text) { process.stdout.write(text); };
    writeOut("\x1b[1;37mMethod               Samples  Loops       FPS (Hz)\n");
    writeOut(          "---------------------------------------------------------");
    var initBench = function() {
            writeOut("\n\x1b[1;30m" + padR(this.name, 57));
        },
        onCycle = function() {
            writeOut("\x1b[38D\x1b[1;31m" + padL(++this.samples, 9) + "\x1b[1;36m" + padL(this.count, 12)
                    + "\x1b[1;32m" + padL(this.hz.toFixed(2), 17) + "\x1b[0;37m");
        };
}

function errorBench(e) {
    console.log(e);
}

var benches = [];

function generateBenchGroup(method, func) {
    var options = {
        setup: "\
        var array = [];\n\
        Array.prototype." + method + " = original." + method + ";\n",
        teardown: "        foo(array);", // To prevent dead code removal
        fn: func,
        onStart: initBench,
        onCycle: onCycle,
        onError: errorBench,
        onComplete: nextBench,
        async: true,
        samples: 0
    };
    benches.push(new Benchmark("Native ." + method, options));

    options.setup = "\
        var array = [];\n\
        Array.prototype." + method + " = wrapped." + method + ";\n";
    benches.push(new Benchmark("Wrapped ." + method, options));
}

generateBenchGroup("push", "        array.push();");
generateBenchGroup("pop", "\
        array[0] = item;\n\
        var item = array.pop();\n");

generateBenchGroup("unshift", "        array.unshift();");
generateBenchGroup("shift", "\
        array[0] = item;\n\
        var item = array.shift();\n");

generateBenchGroup("splice", "        array.splice(0, 1, 1);");

var index = 0;

function nextBench() {
    if (index >= benches.length) return;

    benches[index++].run();
}

nextBench();

});
