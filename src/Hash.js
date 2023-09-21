import React from 'react'
import Output from './Components/Output'
import DropInput from './Components/DropInput'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

export default class Hash extends React.Component {
  constructor (props) {
    super(props)
    const outType = window.localStorage.getItem('hashOutType') || 'lower'
    this.hashs = ['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512']
    this.state = {
      outType,
      hashOutput: null
    }
  }

  componentDidMount () {
    if (this.props.type === 'files') {
      return this.dropInputRef.inputFile(this.props.payload[0])
    }
    const hashType = this.props.payload.toLowerCase()
    if (hashType === 'md5') return
    this.hashs.splice(this.hashs.indexOf(hashType), 1)
    this.hashs.unshift(hashType)
    this.setState({})
  }

  handleInputChange = (input) => {
    if (input.type === 'text') {
      const hashOutput = window.services.textHashs(this.hashs, input.value)
      return this.setState({ hashOutput })
    }
    if (input.type === 'file') {
      window.services.fileHashs(this.hashs, input.value.path, (hashOutput) => {
        this.setState({ hashOutput })
      })
    }
  }

  handleChangeOutType = (e) => {
    const outType = e.target.value
    this.setState({ outType })
    window.localStorage.setItem('hashOutType', outType)
  }

  render () {
    const { hashOutput, outType } = this.state
    return (
      <div>
        <DropInput
          ref={c => { this.dropInputRef = c }}
          rows={4}
          placeholder='输入明文字符串、粘贴文件、拖拽文件到这里'
          onChange={this.handleInputChange}
        />
        <div style={{ paddingTop: 10 }}>
          <RadioGroup row onChange={this.handleChangeOutType} value={outType}>
            <FormControlLabel value='lower' control={<Radio color='primary' />} label='小写' />
            <FormControlLabel value='upper' control={<Radio color='primary' />} label='大写' />
          </RadioGroup>
        </div>
        <div>
          {
            this.hashs.map((hash, index) => (
              <Output
                key={hash}
                label={hash.toUpperCase()}
                value={hashOutput ? (outType === 'upper' ? hashOutput[hash].toUpperCase() : hashOutput[hash]) : ''}
                copyIndex={this.props.copyIndex}
                index={index + 1}
              />))
          }
        </div>
      </div>
    )
  }
}
