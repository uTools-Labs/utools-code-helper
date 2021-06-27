import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import Timestamp from './Timestamp'
import Uuid from './Uuid'
import Hash from './Hash'
import Base64Encode from './Base64Encode'
import Base64Decode from './Base64Decode'
import UrlEncode from './UrlEncode'
import UrlDecode from './UrlDecode'
import Unicode from './Unicode'
import Hex from './Hex'
import HtmlEscape from './HtmlEscape'

window.platform = {
  isMacOs: window.utools.isMacOs(),
  isWindows: window.utools.isWindows(),
  isLinux: window.utools.isLinux()
}

const themeDic = {
  light: createMuiTheme({
    palette: {
      type: 'light'
    },
    props: {
      MuiButtonBase: {
        disableRipple: true
      }
    }
  }),
  dark: createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#90caf9'
      },
      secondary: {
        main: '#f48fb1'
      }
    },
    props: {
      MuiButtonBase: {
        disableRipple: true
      }
    }
  })
}

export default class App extends React.Component {
  state = {
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    enter: null,
    copyIndex: null
  }

  componentDidMount () {
    window.utools.onPluginEnter(enter => {
      this.setState({ enter })
    })
    window.utools.onPluginOut(() => {
      this.setState({ enter: null })
    })
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.setState({ theme: e.matches ? 'dark' : 'light' })
    })
    window.addEventListener('keydown', e => {
      if (/^Digit([1-9])$/.test(e.code) && (window.platform.isMacOs ? e.metaKey : e.altKey)) {
        e.stopPropagation()
        e.preventDefault()
        this.setState({ copyIndex: [parseInt(RegExp.$1)] })
      }
    })
  }

  getEnterPage = (enter) => {
    switch (enter.code) {
      case 'timestamp': return <Timestamp {...enter} copyIndex={this.state.copyIndex} />
      case 'uuid': return <Uuid {...enter} copyIndex={this.state.copyIndex} />
      case 'hash': return <Hash {...enter} copyIndex={this.state.copyIndex} />
      case 'base64encode': return <Base64Encode {...enter} copyIndex={this.state.copyIndex} />
      case 'base64decode': return <Base64Decode {...enter} copyIndex={this.state.copyIndex} />
      case 'urlencode': return <UrlEncode {...enter} copyIndex={this.state.copyIndex} />
      case 'urldecode': return <UrlDecode {...enter} copyIndex={this.state.copyIndex} />
      case 'unicode': return <Unicode {...enter} copyIndex={this.state.copyIndex} />
      case 'hex': return <Hex {...enter} copyIndex={this.state.copyIndex} />
      case 'htmlescape': return <HtmlEscape {...enter} copyIndex={this.state.copyIndex} />
      default: return false
    }
  }

  render () {
    const { enter, theme } = this.state
    if (!enter) return false
    return (
      <ThemeProvider theme={themeDic[theme]}>
        <div className='app-page'>{this.getEnterPage(enter)}</div>
      </ThemeProvider>
    )
  }
}
