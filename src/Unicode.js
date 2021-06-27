import React from 'react'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Output from './Components/Output'

export default class Unicode extends React.Component {
  state = {
    outType: window.localStorage.getItem('unicodeOutType') || 'upper',
    input: '',
    inputArray: []
  }

  hackConvert = (input) => {
    return JSON.parse(`["${input.replace(/"/g, '\\"')}"]`)[0]
  }

  onInputChange = (input) => {
    if (/(^(\\u[a-f0-9]{4})+$)|(^(\\u\{[a-f0-9]{2,5}\})+$)/i.test(input)) {
      input = this.hackConvert(input.replace(/\\U/g, '\\u'))
    } else if (/^(\\x[a-f0-9]{2})+$/i.test(input)) {
      try { input = decodeURIComponent(input.replace(/\\x/gi, '%')) } catch (e) { }
    } else if (/^(u\+[a-f0-9]{2,5})+$/i.test(input)) {
      const payload = input.replace(/u\+/gi, '}\\u{').replace(/^\}/, '') + '}'
      input = this.hackConvert(payload)
    } else if (/^(?:&#\d{2,7};)+$/i.test(input)) {
      const payload = '\\u{' + input.match(/\d+/g).map(x => parseInt(x, 10).toString(16)).join('}\\u{') + '}'
      input = this.hackConvert(payload)
    } else if (/^(?:&#x[a-f0-9]{2,5};)+$/i.test(input)) {
      const payload = input.replace(/&#x/gi, '}\\u{').replace(/;/g, '').replace(/^\}/, '') + '}'
      input = this.hackConvert(payload)
    }
    this.setState({ input, inputArray: Array.from(input || '') })
  }

  TEN_BITS = parseInt('1111111111', 2)

  _u = (codeUnit) => {
    const hex = this.state.outType === 'lower' ? codeUnit.toString(16).toLowerCase() : codeUnit.toString(16).toUpperCase()
    return '\\u' + '0000'.substr(0, 4 - hex.length) + hex
  }

  toUTF16 = (codePoint) => {
    if (codePoint <= 0xFFFF) {
      return this._u(codePoint)
    }
    codePoint -= 0x10000
    const leadSurrogate = 0xD800 + (codePoint >> 10)
    const tailSurrogate = 0xDC00 + (codePoint & this.TEN_BITS)
    return this._u(leadSurrogate) + this._u(tailSurrogate)
  }

  toUTF8 = (char) => {
    const codePoint = char.codePointAt(0)
    if (codePoint <= 0x007F) {
      return '\\x' + (this.state.outType === 'lower' ? codePoint.toString(16).toLowerCase() : codePoint.toString(16).toUpperCase())
    }
    return (this.state.outType === 'lower' ? encodeURIComponent(char).toLowerCase() : encodeURIComponent(char).toUpperCase()).replace(/%/g, '\\x')
  }

  componentDidMount () {
    if (this.props.type === 'regex') {
      this.onInputChange(this.props.payload)
    }
  }

  handleChangeOutType = (e) => {
    const outType = e.target.value
    this.setState({ outType })
    window.localStorage.setItem('unicodeOutType', outType)
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault()
      const val = e.target.value
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      e.target.value = val.substring(0, start) + '\t' + val.substring(end)
      e.target.selectionStart = e.target.selectionEnd = start + 1
      this.onInputChange(e.target.value)
      return false
    }
  }

  handleInputChange = (e) => {
    this.onInputChange(e.target.value)
  }

  render () {
    const { input, inputArray, outType } = this.state
    return (
      <div>
        <TextField
          label=''
          placeholder='字符串'
          autoFocus
          multiline
          rows={4}
          variant='filled'
          fullWidth
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          value={input}
        />
        <div style={{ paddingTop: 10 }}>
          <RadioGroup row onChange={this.handleChangeOutType} value={outType}>
            <FormControlLabel value='lower' control={<Radio color='primary' />} label='小写' />
            <FormControlLabel value='upper' control={<Radio color='primary' />} label='大写' />
          </RadioGroup>
        </div>
        <Output label='码位' value={outType === 'lower' ? inputArray.map(x => 'U+' + x.codePointAt(0).toString(16).toLowerCase()).join('') : inputArray.map(x => 'U+' + x.codePointAt(0).toString(16).toUpperCase()).join('')} copyIndex={this.props.copyIndex} index={1} />
        <Output label='UTF-8编码' value={inputArray.map(x => this.toUTF8(x)).join('')} copyIndex={this.props.copyIndex} index={2} />
        <Output label='UTF-16编码' value={inputArray.map(x => this.toUTF16(x.codePointAt(0))).join('')} copyIndex={this.props.copyIndex} index={3} />
        <Output label='\u{}表达码位' value={outType === 'lower' ? inputArray.map(x => '\\u{' + x.codePointAt(0).toString(16).toLowerCase() + '}').join('') : inputArray.map(x => '\\u{' + x.codePointAt(0).toString(16).toUpperCase() + '}').join('')} copyIndex={this.props.copyIndex} index={4} />
        <Output label='HTML实体(10进制)' value={inputArray.map(x => '&#' + x.codePointAt(0) + ';').join('')} copyIndex={this.props.copyIndex} index={5} />
        <Output label='HTML实体(16进制)' value={outType === 'lower' ? inputArray.map(x => '&#x' + x.codePointAt(0).toString(16).toLowerCase() + ';').join('') : inputArray.map(x => '&#x' + x.codePointAt(0).toString(16).toUpperCase() + ';').join('')} copyIndex={this.props.copyIndex} index={6} />
      </div>
    )
  }
}
