import React from 'react'
import Button from '@mui/material/Button'
import Output from './Components/Output'
import AutorenewIcon from '@mui/icons-material/Autorenew'

export default class Uuid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uuid: ''
    }
  }

  componentDidMount () {
    this.setState({ uuid: this.uuid() })
  }

  uuid = () => {
    let d = Date.now()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  }

  handleRefreshClick = () => {
    this.setState({ uuid: this.uuid() })
  }

  render () {
    const { uuid } = this.state
    const copyIndex = this.props.copyIndex
    return (
      <div>
        <Output label='小写' value={uuid} copyIndex={copyIndex} index={1} />
        <Output label='大写' value={uuid && uuid.toUpperCase()} copyIndex={copyIndex} index={2} />
        <Output label='去掉[-]小写' value={uuid && uuid.replace(/-/g, '')} copyIndex={copyIndex} index={3} />
        <Output label='去掉[-]大写' value={uuid && uuid.replace(/-/g, '').toUpperCase()} copyIndex={copyIndex} index={4} />
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          <Button variant='contained' color='primary' startIcon={<AutorenewIcon />} onClick={this.handleRefreshClick}>重新生成</Button>
        </div>
      </div>
    )
  }
}
