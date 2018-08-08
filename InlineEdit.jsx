import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class InlineEdit extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    paramName: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    validate: PropTypes.func,
    style: PropTypes.object,
    editing: PropTypes.bool,
  }

  static defaultProps = {
    minLength: 1,
    maxLength: 255,
    disabled: false,
    editing: false,
  }

  constructor(props) {
    super(props)

    this._finishEditing = ::this._finishEditing

    this.state = {
      editing: this.props.editing,
      text: this.props.text,
      minLength: this.props.minLength,
      maxLength: this.props.maxLength,
    }
  }

  _finishEditing() {
    if (this._isInputValid() && this.props.text !== this.state.text) {
      this.setState({ editing: false })
      const newProp = {}
      newProp[this.props.paramName] = this.state.text
      this.props.onChange(newProp)
    } else if (this.props.text === this.state.text || !this._isInputValid()) {
      this.setState({ editing: false, text: this.props.text })
    }
  }

  _isInputValid() {
    return this.props.validate ?
      this.props.validate(this.state.text) &&
        (this.state.text.length >= this.state.minLength && this.state.text.length <= this.state.maxLength) :
      (this.state.text.length >= this.state.minLength && this.state.text.length <= this.state.maxLength)
  }

  render() {

    const {
      className,
      style,
      disabled,
      placeholder,
      text,
    } = this.props

    const newStyle = this._isInputValid(this.state.text) ? style : Object.assign({}, style, { color: 'red' })

    if(this.props.disabled) {
      return (
        <span
          className={className}
          style={style}
        >
          {this.state.text || placeholder}
        </span>
      )
    } else if (!this.state.editing) {
      return (
        <span
          className={className}
          style={style}
          onClick={() => {
            this.setState({ editing: true, text})
          }}
        >
          {this.state.text || placeholder}
        </span>
      )
    } else {
      return (
        <input
          className={className}
          style={newStyle}
          onBlur={this._finishEditing}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              this._finishEditing()
            } else if (e.keyCode === 27) {
              this.setState({ editing: false, text })
            }
          }}
          placeholder={placeholder}
          defaultValue={this.state.text}
          onChange={e => {
            this.setState({ text: e.target.value })
          }}
        />

      )
    }
  }
}
