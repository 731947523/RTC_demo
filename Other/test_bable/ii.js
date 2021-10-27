"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var name = function name() {
  console.log('test的fun name is name...');
};

var a = function a() {
  name();
};

window.name = name;

function filterDevices(devices, flag) {}

var test = /*#__PURE__*/function () {
  function test() {
    _classCallCheck(this, test);

    this.name = '小腿';
  }

  _createClass(test, [{
    key: "eat",
    value: function eat() {
      console.log(this.name + '是很强壮的');
    }
  }]);

  return test;
}();

exports.test = test;
