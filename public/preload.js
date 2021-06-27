const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

window.services = {
  textHashs: (hashs, text) => {
    const result = {}
    if (text) {
      hashs.forEach(x => {
        result[x] = crypto.createHash(x).update(text).digest('hex')
      })
    } else {
      hashs.forEach(x => {
        result[x] = ''
      })
    }
    return result
  },
  fileHashs: (hashs, filename, callback) => {
    if (!fs.existsSync(filename)) {
      return callback(null)
    }
    const hashsums = []
    for (const hm of hashs) {
      hashsums.push(crypto.createHash(hm))
    }
    try {
      const s = fs.ReadStream(filename)
      s.on('data', (data) => {
        hashsums.forEach(x => x.update(data))
      })
      s.on('end', () => {
        const resulthashs = hashsums.map(x => x.digest('hex'))
        const reuslt = {}
        hashs.forEach((x, i) => {
          reuslt[x] = resulthashs[i]
        })
        callback(reuslt)
      })
    } catch (error) {
      callback(null)
    }
  },
  base64Encode: (string) => {
    return Buffer.from(string).toString('base64')
  },
  base64EncodeImageFile: (filename, callback) => {
    if (!fs.existsSync(filename)) {
      callback(null)
    }
    fs.readFile(filename, (err, data) => {
      if (err) callback(null)
      const prev = 'data:image/' + path.extname(filename).replace('.', '').toLowerCase() + ';base64,'
      callback(prev + new Buffer(data).toString('base64')) // eslint-disable-line
    })
  },
  base64Decode: (string) => {
    return Buffer.from(string, 'base64').toString()
  }
}
