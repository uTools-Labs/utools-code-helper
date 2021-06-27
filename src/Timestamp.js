import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SettingsIcon from '@material-ui/icons/Settings'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Output from './Components/Output'
import Drawer from '@material-ui/core/Drawer'

export default class Timestamp extends React.Component {
  timeZone = {
    // '-12':{
    //     text:'国际换日线',
    //     utc:'Etc/GMT+12'
    // },
    '-11': {
      text: '中途岛标准时间',
      utc: 'Pacific/Pago_Pago'
    },
    '-10': {
      text: '夏威夷-阿留申标准时间',
      utc: 'Pacific/Johnston'
    },
    '-9:30': {
      text: '马克萨斯群岛标准时间',
      utc: 'Pacific/Marquesas'
    },
    '-9': {
      text: '阿拉斯加标准时间',
      utc: 'America/Anchorage'
    },
    '-8': {
      text: '太平洋标准时间',
      utc: 'America/Los_Angeles'
    },
    '-7': {
      text: '北美山区标准时间',
      utc: 'America/Boise'
    },
    '-6': {
      text: '北美中部标准时间',
      utc: 'America/Bahia_Banderas'
    },
    '-5': {
      text: '北美东部标准时间',
      utc: 'America/Atikokan'
    },
    '-4': {
      text: '大西洋标准时间',
      utc: 'America/Anguilla'
    },
    '-3:30': {
      text: '纽芬兰岛标准时间',
      utc: 'America/St_Johns'
    },
    '-3': {
      text: '南美标准时间',
      utc: 'America/Argentina/Cordoba'
    },
    '-2': {
      text: '巴西时间',
      utc: 'America/Noronha'
    },
    '-1': {
      text: '佛得角标准时间',
      utc: 'Atlantic/Cape_Verde'
    },
    '+1': {
      text: '欧洲中部时区',
      utc: 'Africa/Algiers'
    },
    '+2': {
      text: '欧洲东部时区',
      utc: 'Africa/Cairo'
    },
    '+3': {
      text: '莫斯科标准时间',
      utc: 'Europe/Moscow'
    },
    '+3:30': {
      text: '伊朗标准时间',
      utc: 'Asia/Tehran'
    },
    '+4': {
      text: '海湾标准时间',
      utc: 'Asia/Dubai'
    },
    '+4:30': {
      text: '阿富汗标准时间',
      utc: 'Asia/Kabul'
    },
    '+5': {
      text: '巴基斯坦标准时间',
      utc: 'Asia/Karachi'
    },
    '+5:30': {
      text: '印度标准时间',
      utc: 'Asia/Calcutta'
    },
    '+5:45': {
      text: '尼泊尔标准时间',
      utc: 'Asia/Kathmandu'
    },
    '+6': {
      text: '孟加拉国标准时间',
      utc: 'Asia/Dhaka'
    },
    '+6:30': {
      text: '缅甸标准时间',
      utc: 'Asia/Yangon'
    },
    '+7': {
      text: '科布多标准时间',
      utc: 'Asia/Hovd'
    },
    '+8': {
      text: '中国标准时间',
      utc: 'Asia/Shanghai'
    },
    '+9': {
      text: '日本标准时间',
      utc: 'Asia/Tokyo'
    },
    '+9:30': {
      text: '澳大利亚中部标准时间',
      utc: 'Australia/Darwin'
    },
    '+10': {
      text: '澳大利亚东部标准时间',
      utc: 'Australia/Lindeman'
    },
    // '+10:30':{
    //     text:'豪勋爵岛时间',
    //     utc:'Australia/Lord_Howe'
    // },
    '+11': {
      text: '瓦努阿图标准时间',
      utc: 'Pacific/Efate'
    },
    // '+11:30':{
    //     text:'诺福克岛标准时间',
    //     utc:'Kingston'
    // },
    '+12': {
      text: '太平洋标准时间B',
      utc: 'Asia/Kamchatka'
    },
    '+12:45': {
      text: '查塔姆群岛标准时间',
      utc: 'Pacific/Chatham'
    },
    '+13': {
      text: '太平洋标准时间C',
      utc: 'Pacific/Fakaofo'
    },
    '+14': {
      text: '太平洋标准时间D',
      utc: 'Pacific/Kiritimati'
    }
  }

  constructor (props) {
    super(props)
    const settingDoc = window.utools.db.get('setting/date') || { data: [] }
    const timezoneOffset = (new Date()).getTimezoneOffset()
    const timezoneOffsetHours = -(timezoneOffset / 60 | 0)
    const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60)
    let localTimeZone = (timezoneOffsetHours > 0 ? '+' : '') + timezoneOffsetHours + (timezoneOffsetMinutes > 0 ? (':' + timezoneOffsetMinutes) : '')
    if (localTimeZone in this.timeZone) {
      localTimeZone = 'UTC' + localTimeZone + ' ' + this.timeZone[localTimeZone].text + '(本地时间)'
    } else {
      localTimeZone = 'UTC' + localTimeZone + ' 本地时间'
    }
    this.localTimeZoneText = localTimeZone
    this.state = {
      settingDoc,
      input: '',
      date: null,
      showTimezone: false
    }
  }

  componentDidMount () {
    if (this.props.type === 'regex') {
      return this.inputChange(this.props.payload)
    }
    const now = new Date()
    let input = ''
    const payWay = this.props.payload && this.props.payload.toLowerCase()
    if (payWay === 'timestamp') {
      input = '' + now.getTime()
    } else if (payWay === 'unixtime') {
      input = Math.floor(now.getTime() / 1000).toString()
    } else {
      input = this.getDateFormat(now)
    }
    this.inputChange(input)
    setTimeout(() => {
      document.getElementById('date-input').select()
    })
  }

  // getDateString=(date)=>{
  //   const year = date.getFullYear(),
  //   month = date.getMonth()+1,
  //   day = date.getDate();
  //   return year+'-'+(month<10?'0':'')+month+'-'+(day<10?'0':'')+day;
  // }

  // getTimeString=(date)=>{
  //   const hours = date.getHours(),
  //   minute = date.getMinutes(),
  //   seconds = date.getSeconds();
  //   return (hours<10?'0':'')+hours+':'+(minute<10?'0':'')+minute+':'+(seconds<10?'0':'')+seconds;
  // }

  getDateFormat = (date, timeZone) => {
    try {
      return date.toLocaleString('zh-Hans-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone }).replace(/\//g, '-').replace(' 24:', ' 00:')
    } catch (e) {
      return ''
    }
  }

  inputChange = (str) => {
    this.setState({ input: str })
    if (str.length < 4) {
      if (this.state.date) { this.setState({ date: undefined }) }
      return
    }
    if (/^\d{9,19}$/.test(str)) {
      do {
        if (str.length === 10 || str.length === 9) {
          str = parseInt(str) * 1000
          break
        }
        if (str.length === 13 || str.length === 12) {
          str = parseInt(str)
          break
        }
        if (str.length === 16 || str.length === 19) {
          str = parseInt(str.substr(0, 13))
          break
        }
        if (this.state.date) { this.setState({ date: undefined }) }
        return
      } while (false)
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      str = str + ' 00:00:00'
    }
    const date = new Date(str)
    if (isNaN(date) === false) {
      this.setState({ date })
    } else if (this.state.date) {
      this.setState({ date: undefined })
    }
  }

  handleInputChange = (event) => {
    this.inputChange(event.target.value)
  }

  handleTimezonePanelClose = () => {
    this.setState({ showTimezone: false })
  }

  handleTimezoneCheckboxChange = (e) => {
    const settingDoc = JSON.parse(JSON.stringify(this.state.settingDoc))
    if (e.target.checked) {
      settingDoc.data.push(e.target.value)
    } else {
      const indexAt = settingDoc.data.indexOf(e.target.value)
      if (indexAt === -1) return
      settingDoc.data.splice(indexAt, 1)
    }
    settingDoc._id = 'setting/date'
    const result = window.utools.db.put(settingDoc)
    if (result.error) return
    settingDoc._rev = result.rev
    this.setState({ settingDoc })
  }

  render () {
    const { settingDoc, input, date, showTimezone } = this.state
    let localDateString
    if (date) {
      localDateString = this.getDateFormat(date)
    }
    return (
      <div className='timestamp-page'>
        <TextField
          autoFocus
          className='timestamp-input'
          id='date-input'
          fullWidth
          variant='filled'
          onChange={this.handleInputChange}
          value={input}
          placeholder='任意时间格式'
        />
        <Output label={this.localTimeZoneText} value={date && localDateString} copyIndex={this.props.copyIndex} index={1} />
        <Output label={this.localTimeZoneText + ',日期'} value={date && localDateString.split(' ')[0]} copyIndex={this.props.copyIndex} index={2} />
        <Output label='时间戳(秒)' value={date && Math.floor(date.getTime() / 1000)} copyIndex={this.props.copyIndex} index={3} />
        <Output label='时间戳(毫秒)' value={date && date.getTime()} copyIndex={this.props.copyIndex} index={4} />
        <Output label='标准时间(UTC)' value={date && date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')} copyIndex={this.props.copyIndex} index={5} />
        {
          settingDoc.data.map((x, i) => <Output key={i} label={'UTC' + x + ' ' + this.timeZone[x].text} value={date && this.getDateFormat(date, this.timeZone[x].utc)} copyIndex={this.props.copyIndex} index={6 + i} />)
        }
        <Button className='timestamp-timezone-btn' size='small' startIcon={<SettingsIcon />} onClick={() => this.setState({ showTimezone: true })}>
          其他时区
        </Button>
        <Drawer open={showTimezone} anchor='right' onClose={this.handleTimezonePanelClose}>
          <div className='timestamp-timezone-box'>
            {
              Object.keys(this.timeZone).map(x => (
                <div key={x}>
                  <FormControlLabel checked={settingDoc.data.includes(x)} onChange={this.handleTimezoneCheckboxChange} control={<Checkbox value={x} />} label={'UTC' + x + ' ' + this.timeZone[x].text} />
                </div>))
            }
          </div>
        </Drawer>
      </div>
    )
  }
}
