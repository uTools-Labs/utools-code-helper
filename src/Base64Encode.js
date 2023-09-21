import React from 'react'
import Output from './Components/Output'
import DropInput from './Components/DropInput'

export default class base64Encode extends React.Component {
  state = {
    result: '',
    isWebImg: false
  }

  componentDidMount () {
    if (this.props.type === 'files') {
      this.dropInputRef.inputFile(this.props.payload[0])
    } else if (this.props.type === 'img') {
      this.setState({ isWebImg: true, result: this.props.payload })
    }
  }

  handleInputChange = (input) => {
    if (input.type === 'text') {
      this.setState({ result: window.services.base64Encode(input.value) })
    } else if (input.type === 'file') {
      window.services.base64EncodeImageFile(input.value.path, (result) => {
        if (result) {
          this.setState({ result })
        }
      })
    }
  }

  handleImageClick = () => {
    this.setState({ result: '', isWebImg: false })
    this.dropInputRef.focus()
  }

  render () {
    const { result, isWebImg } = this.state
    return (
      <div className='base64encode-page'>
        <div>
          <DropInput
            ref={c => { this.dropInputRef = c }}
            fileMatch={/.(jpg|png|jpeg|gif)/i}
            placeholder='输入字符串、粘贴图片、拖拽图片文件到这里'
            rows={12}
            onChange={this.handleInputChange}
          />
          {
            isWebImg && (
              <div onClick={this.handleImageClick} className='base64encode-page-img'>
                <img alt='' draggable='false' src={result} />
              </div>
            )
          }
        </div>
        <Output label='结果' value={result} copyIndex={this.props.copyIndex} index={1} />
      </div>
    )
  }
}
