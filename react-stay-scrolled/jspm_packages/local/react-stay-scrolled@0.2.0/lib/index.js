'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StayScrolled = function (_Component) {
  _inherits(StayScrolled, _Component);

  function StayScrolled(props) {
    _classCallCheck(this, StayScrolled);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StayScrolled).call(this, props));

    _this.onScroll = function () {
      _this.wasScrolled = _this.isScrolled();

      if (_this.wasScrolled && _this.props.onScrolled) {
        _this.props.onScrolled();
      }
    };

    _this.getDOM = function () {
      return _reactDom2.default.findDOMNode(_this.dom);
    };

    _this.storeDOM = function (dom) {
      _this.dom = dom;
    };

    _this.stayScrolled = function () {
      var notify = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      var onStayScrolled = _this.props.onStayScrolled;


      if (_this.wasScrolled) {
        _this.scrollBottom();
      }

      if (notify && onStayScrolled) {
        onStayScrolled(_this.wasScrolled);
      }
    };

    _this.scrollBottom = function () {
      var _this$props = _this.props;
      var Velocity = _this$props.Velocity;
      var onScrolled = _this$props.onScrolled;
      var debug = _this$props.debug;

      var dom = _this.getDOM();

      if (!dom) return; // Necessary in case this method is called before the component rendered

      var scrollHeight = dom.scrollHeight;


      debug('Scrolling bottom: scrollHeight=' + scrollHeight);

      if (Velocity) {
        // Use smooth scrolling if available
        Velocity(dom.firstChild, 'scroll', {
          container: dom,
          offset: scrollHeight,
          duration: 300,
          easing: 'ease-out',
          complete: onScrolled
        });
      } else {
        dom.scrollTop = scrollHeight;

        if (onScrolled) {
          onScrolled();
        }
      }
    };

    _this.wasScrolled = props.startScrolled;
    return _this;
  }

  _createClass(StayScrolled, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        scrollBottom: this.scrollBottom,
        stayScrolled: this.stayScrolled
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var startScrolled = this.props.startScrolled;


      if (startScrolled) {
        this.scrollBottom();
      }
    }
  }, {
    key: 'isScrolled',
    value: function isScrolled() {
      var _props = this.props;
      var stayInaccuracy = _props.stayInaccuracy;
      var debug = _props.debug;

      var dom = this.getDOM();
      var scrollTop = dom.scrollTop;
      var clientHeight = dom.clientHeight;
      var scrollHeight = dom.scrollHeight;


      debug('isScrolled: scollTop=' + scrollTop + ', clientHeight=' + clientHeight + ', scrollHeight=' + scrollHeight);

      // scrollTop is a floating point, the rest are integers rounded up
      // naively: actualScrollHeight = scrollHeight - (Math.ceil(scrollTop) - scrollTop)
      return Math.ceil(scrollTop) + clientHeight >= scrollHeight - stayInaccuracy;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var component = _props2.component;
      var children = _props2.children;

      var rest = _objectWithoutProperties(_props2, ['component', 'children']);

      return _react2.default.createElement(
        'component',
        _extends({
          ref: this.storeDOM,
          onScroll: this.onScroll
        }, rest),
        children
      );
    }
  }]);

  return StayScrolled;
}(_react.Component);

StayScrolled.propTypes = {
  component: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func, _react.PropTypes.element]),
  children: _react2.default.PropTypes.node,
  startScrolled: _react.PropTypes.bool,
  onStayScrolled: _react.PropTypes.func,
  onScrolled: _react.PropTypes.func,
  stayInaccuracy: _react.PropTypes.number,
  Velocity: _react.PropTypes.func,
  debug: _react.PropTypes.func
};
StayScrolled.defaultProps = {
  component: 'div',
  startScrolled: true,
  stayInaccuracy: 0,
  debug: function debug() {}
};
StayScrolled.childContextTypes = {
  scrollBottom: _react.PropTypes.func,
  stayScrolled: _react.PropTypes.func
};
exports.default = StayScrolled;