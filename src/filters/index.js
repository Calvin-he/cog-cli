import moment from 'moment'

function dateFormat (value) {
  if (value) {
    return moment(value).format('YYYY-MM-DD')
  } else {
    return ''
  }
}

function datetimeFormat (value) {
  if (value) {
    var m = moment(value)
    var now = moment()
    if (now.year() === m.year()) {
      if (now.dayOfYear() === m.dayOfYear()) {
        return m.format('HH:mm')
      } else {
        return m.format('MM-DD HH:mm')
      }
    } else {
      return m.format('YYYY-MM-DD HH:mm')
    }
  }
}

export {
  dateFormat,
  datetimeFormat
}
