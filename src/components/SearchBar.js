import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import LocalBridge from 'utils/LocalBridge';

export default class SearchBar extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onClickCancel: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      value: props.value || '',
      showClear: false
    };
  }
  componentDidMount() {
    if (this.props.autoFocus) {
      this.searchInput.focus();
    }
    if (this.searchInput.value) {
      this.setState({
        showClear: true
      });
    }
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        showClear: true
      });
    }
  }
  onClear = () => {
    this.setState({
      value: '',
      showClear: false
    });
    this.searchInput.focus();
    if (this.props.onClear) this.props.onClear();
  }
  onChange = () => {
    if (this.searchInput.value.length === 0) {
      this.setState({showClear: false});
    } else {
      this.setState({showClear: true});
    }
    this.searchInput.focus();
    this.setState({
      value: this.searchInput.value
    });
    if (this.props.onChange) this.props.onChange(this.searchInput.value);
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.value);
    this.searchInput.blur();
  }
  render() {
    const {className, style, placeholder, onClickCancel} = this.props;
    return (
      <div className={`searchbar${className ? ' ' + className : ''}`} style={style}>
        <form className="searchbar-form" onSubmit={this.onSubmit}>
          <i className="icon searchbar-icon-search"></i>
          <input
            type="search"
            ref={input => this.searchInput = input}
            className="searchbar-input"
            placeholder={placeholder}
            onChange={this.onChange}
            value={this.state.value}
            // onBlur={LocalBridge.iosInputBounceBack}
          />
          {this.state.showClear && <i className="searchbar-icon-clear" onClick={this.onClear}></i>}
        </form>
        {onClickCancel && <div className="searchbar-button" onClick={onClickCancel}>取消</div>}
      </div>
    );
  }
}