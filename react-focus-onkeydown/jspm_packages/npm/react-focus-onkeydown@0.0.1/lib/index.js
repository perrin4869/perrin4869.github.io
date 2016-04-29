'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _reactDisplayName = require('react-display-name');

var _reactDisplayName2 = _interopRequireDefault(_reactDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Input) {
  var FocusOnKeyDown = function (_Component) {
    _inherits(FocusOnKeyDown, _Component);

    function FocusOnKeyDown() {
      var _Object$getPrototypeO;

      var _temp, _this, _ret;

      _classCallCheck(this, FocusOnKeyDown);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(FocusOnKeyDown)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.syncEventListener = function (focusOnKeyDown) {
        if (focusOnKeyDown) {
          window.addEventListener('keydown', _this.windowKeyDown);
        } else {
          window.removeEventListener('keydown', _this.windowKeyDown);
        }
      }, _this.windowKeyDown = function (e) {
        // Auto-focus the current input when a key is typed
        if (!(e.ctrlKey || e.metaKey || e.altKey)) {
          _this.focus();
        }
      }, _this.focus = function () {
        _this.messageInput.focus();
      }, _this.storeMessageInput = function (c) {
        _this.messageInput = c;
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(FocusOnKeyDown, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var focusOnKeyDown = this.props.focusOnKeyDown;

        this.syncEventListener(focusOnKeyDown);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var focusOnKeyDown = this.props.focusOnKeyDown;


        if (focusOnKeyDown !== nextProps.focusOnKeyDown) {
          this.syncEventListener(nextProps.focusOnKeyDown);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.syncEventListener(false);
      }
    }, {
      key: 'render',
      value: function render() {
        return (0, _react.createElement)(Input, _extends({}, this.props, { ref: this.storeMessageInput }));
      }
    }]);

    return FocusOnKeyDown;
  }(_react.Component);

  FocusOnKeyDown.propTypes = {
    focusOnKeyDown: _react.PropTypes.bool
  };
  FocusOnKeyDown.defaultProps = {
    focusOnKeyDown: true
  };
  FocusOnKeyDown.displayName = 'FocusOnKeyDown(' + (0, _reactDisplayName2.default)(Input) + ')';


  return (0, _hoistNonReactStatics2.default)(FocusOnKeyDown, Input);
};