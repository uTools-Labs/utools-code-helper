import React from 'react'
import Output from './Components/Output'

export default class HtmlEscape extends React.Component {
  data = {
    '&quot;': '双引号 "',
    '&amp;': '与和符 &',
    '&lt;': '小于号 <',
    '&gt;': '大于号 >',
    '&nbsp;': '不断开空格(non-breaking space)'
  }

  render () {
    if (this.props.type === 'regex') {
      return <div className='htmlescape-page-value'>{this.data[this.props.payload.toLowerCase()]}</div>
    }
    return (
      <div>
        {
          Object.keys(this.data).map((k, i) => (
            <Output key={i} label={this.data[k]} value={k} copyIndex={this.props.copyIndex} index={i + 1} />
          ))
        }
      </div>)
  }
}
