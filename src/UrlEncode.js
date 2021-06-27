import React from 'react'
import TextField from '@material-ui/core/TextField'
import Output from './Components/Output'

export default class UrlEncode extends React.Component {
  state = {
    input: ''
  }

  handleInputChange = (e) => {
    const input = e.target.value
    this.setState({ input })
  }

  render () {
    const { input } = this.state
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
        <Output label='结果' value={encodeURIComponent(input)} copyIndex={this.props.copyIndex} index={1} />
      </div>
    )
  }
}
