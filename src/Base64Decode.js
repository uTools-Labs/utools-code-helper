import React from 'react'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Output from './Components/Output'

export default class Base64Decode extends React.Component {
  state = {
    input: '',
    result: '',
    isBase64Img: false,
    isImageCopy: true
  }

  isBase64String = (str) => {
    return /^(?:[A-Za-z0-9+/][A-Za-z0-9+/][A-Za-z0-9+/][A-Za-z0-9+/])*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str)
  }

  isImgBase64String = (str) => {
    return /^data:image\/(jpg|jpeg|gif|png);base64,(?:[A-Za-z0-9+/][A-Za-z0-9+/][A-Za-z0-9+/][A-Za-z0-9+/])+(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str)
  }

  componentDidMount () {
    if (this.props.type === 'regex') {
      if (this.isBase64String(this.props.payload)) {
        this.setState({ input: this.props.payload, result: window.services.base64Decode(this.props.payload) })
      } else if (this.isImgBase64String(this.props.payload)) {
        this.setState({ input: this.props.payload, isBase64Img: true })
      }
    }
  }

  handleInputChange = (e) => {
    const input = e.target.value
    this.setState({ input })
    if (this.isBase64String(input)) {
      this.setState({ isBase64Img: false })
      if (this.textInputDelayTimer) {
        clearTimeout(this.textInputDelayTimer)
      }
      this.textInputDelayTimer = setTimeout(() => {
        this.textInputDelayTimer = null
        const result = window.services.base64Decode(input)
        this.setState({ result })
      }, 50)
    } else if (this.isImgBase64String(input)) {
      this.setState({ result: '', isBase64Img: true })
    } else {
      this.setState({ result: '', isBase64Img: false })
    }
  }

  handleCopyImg = () => {
    window.utools.hideMainWindow()
    window.utools.copyImage(this.state.input)
  }

  render () {
    const { result, input, isBase64Img } = this.state
    return (
      <div className='base64decode-page'>
        <TextField
          label=''
          placeholder='base64 编码字符串'
          autoFocus
          multiline
          rows={12}
          variant='filled'
          fullWidth
          onChange={this.handleInputChange}
          value={input}
        />
        {
          isBase64Img
            ? <Paper className='base64decode-page-img'>
                <Tooltip title='点击复制图片' placement='top'>
                  <img alt='' draggable='false' onClick={this.handleCopyImg} src={input} />
                </Tooltip>
              </Paper>
            : <Output label='结果' value={result} copyIndex={this.props.copyIndex} index={1} />
        }
      </div>
    )
  }
}
