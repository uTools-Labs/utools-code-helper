import React from 'react'
import TextField from '@mui/material/TextField'

export default class DropInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      text: ''
    }
  }

  inputFile = (file) => {
    this.setState({ file, text: '' })
    this.props.onChange({ type: 'file', value: file })
  }

  focus = () => {
    setTimeout(() => {
      document.getElementById('components-drop-input-text').focus()
    })
  }

  handleInputChange = (e) => {
    const text = e.target.value
    this.setState({ text })
    if (this.textInputDelayTimer) {
      clearTimeout(this.textInputDelayTimer)
    }
    this.textInputDelayTimer = setTimeout(function () {
      this.textInputDelayTimer = null
      this.props.onChange({ type: 'text', value: text })
    }.bind(this), 50)
  }

  handleDragOver = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  handleDrop = (event) => {
    if (event.dataTransfer.types.length !== 1 || event.dataTransfer.types[0] !== 'Files') {
      return
    }
    const fileItem = event.dataTransfer.items[0].webkitGetAsEntry()
    if (fileItem == null || fileItem.isDirectory) {
      return
    }
    const files = event.dataTransfer.files
    if (this.props.fileMatch && !this.props.fileMatch.test(files[0].name)) {
      return
    }
    this.inputFile({ name: files[0].name, path: files[0].path })
  }

  handleFileClick = () => {
    this.setState({ file: null, text: '' })
    this.props.onChange({ type: 'text', value: '' })
    this.focus()
  }

  render () {
    const { file, text } = this.state
    const { rows, placeholder } = this.props
    return (
      <div className='components-drop-input' onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
        <TextField
          id='components-drop-input-text'
          label=''
          placeholder={file ? '' : placeholder}
          autoFocus
          multiline
          rows={rows}
          variant='filled'
          fullWidth
          disabled={!!file}
          onChange={this.handleInputChange}
          value={text}
        />
        {
          file && (
            <div onClick={this.handleFileClick} className='components-drop-input-file'>
              <h3>{file.name}</h3>
              <div>{file.path}</div>
            </div>)
        }
      </div>
    )
  }
}
