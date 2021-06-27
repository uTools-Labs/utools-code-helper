import React from 'react'
import TextField from '@material-ui/core/TextField'

export default class Hex extends React.Component {
  state = {
    number: 0
  }

  componentDidMount () {
    if (this.props.type === 'regex') {
      const number = Number(this.props.payload)
      if (!Number.isNaN(number) && number <= Number.MAX_SAFE_INTEGER) {
        this.setState({ number })
      }
    }
  }

  handleInputChange = type => e => {
    const value = e.target.value
    if (!value) {
      return this.setState({ number: 0 })
    }
    if (type === 10) {
      if (!/^[1-9][0-9]*$/.test(value)) return
    } else if (type === 16) {
      if (!/^[1-9a-f][0-9a-f]*$/i.test(value)) return
    } else if (type === 8) {
      if (!/^[1-7][0-7]*$/.test(value)) return
    } else if (type === 2) {
      if (!/^1[0-1]*$/.test(value)) return
    } else if (type === 32) {
      if (!/^[1-9a-v][0-9a-v]*$/i.test(value)) return
    }
    let number = parseInt(value, type)
    if (number > Number.MAX_SAFE_INTEGER) {
      number = Number.MAX_SAFE_INTEGER
    }
    this.setState({ number })
  }

  render () {
    const { number } = this.state
    return (
      <div className='hex-page'>
        <TextField autoFocus fullWidth variant='filled' onChange={this.handleInputChange(10)} value={number ? number.toString(10) : ''} label='10 进制' />
        <TextField fullWidth variant='filled' onChange={this.handleInputChange(16)} value={number ? number.toString(16) : ''} label='16 进制' />
        <TextField fullWidth variant='filled' onChange={this.handleInputChange(8)} value={number ? number.toString(8) : ''} label='8 进制' />
        <TextField fullWidth variant='filled' onChange={this.handleInputChange(2)} value={number ? number.toString(2) : ''} label='2 进制' />
        <TextField fullWidth variant='filled' onChange={this.handleInputChange(32)} value={number ? number.toString(32) : ''} label='32 进制' />
      </div>
    )
  }
}
