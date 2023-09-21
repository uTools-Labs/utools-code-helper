import React from 'react'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

export default class Output extends React.Component {
  handleCopy = () => {
    window.utools.hideMainWindow()
    window.utools.copyText(String(this.props.value))
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.copyIndex !== this.props.copyIndex) {
      if (nextProps.copyIndex[0] === this.props.index && this.props.value) {
        this.handleCopy()
      }
      return false
    }
    return true
  }

  render () {
    const { label, value, index } = this.props
    return (
      <Paper className='components-output'>
        {label && <div className='components-output-label'>{label}</div>}
        <div className='components-output-value'>
          {value && value.length > 10000 ? value.substr(0, 10000) + '......' : value}
        </div>
        {value && (
          <div className='components-output-handle'>
            {
              index < 10
                ? <Tooltip title='复制' placement='left'>
                    <Button endIcon={<ContentCopyIcon />} onClick={this.handleCopy} color='primary' size='small'>
                      {(window.platform.isMacOS ? '⌘+' : 'Alt+') + index}
                    </Button>
                  </Tooltip>
                : <Button onClick={this.handleCopy} color='primary' size='small'>复制</Button>
            }
          </div>)}
      </Paper>
    )
  }
}
