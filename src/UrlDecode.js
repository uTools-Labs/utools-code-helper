import React from 'react'
import TextField from '@material-ui/core/TextField'
import Output from './Components/Output'

export default class UrlDecode extends React.Component {
  state = {
    input: '',
    result: ''
  }

  componentDidMount () {
    if (this.props.type === 'regex') {
      const input = this.props.payload
      this.setState({ input })
      try {
        this.setState({ result: decodeURIComponent(input) })
      } catch (e) {
        this.setState({ result: '' })
      }
    }
  }

  handleInputChange = (e) => {
    const input = e.target.value
    this.setState({ input })
    try {
      this.setState({ result: decodeURIComponent(input) })
    } catch (e) {
      this.setState({ result: '' })
    }
  }

  render () {
    const { input, result } = this.state
    return (
      <div>
        <TextField
          label=''
          placeholder='字符串'
          autoFocus
          multiline
          rows={12}
          variant='filled'
          fullWidth
          onChange={this.handleInputChange}
          value={input}
        />
        <Output label='结果' value={result} copyIndex={this.props.copyIndex} index={1} />
      </div>
    )
  }
}
