/*global Mocha, mochaPhantomJS*/
var filter = (function() {
  var slash = '/'
  var cwd = (typeof location === 'undefined' ? window.location : location).href.replace(/\/[^\/]*$/, '/')

  function isExpectInternal(line) {
    return ~line.indexOf('~' + slash + ' expect' + slash + 'lib' + slash)
  }
  function isMochaInternal(line) {
    return (~line.indexOf('node_modules' + slash + 'mocha' + slash))
      || (~line.indexOf(slash + 'mocha.js'))
  }

  return function(stack) {
    stack = stack.split('\n')

    stack = stack.reduce(function(list, line) {
      if (isMochaInternal(line)) {
        return list
      }
      if (isExpectInternal(line)) {
        return list
      }
      //line = line.match(/\((.*)\)/)[1]
      line = line.replace(/^.*\(/, '').replace(/\)$/, '')
      list.push(line.replace(cwd, ''))
      return list
    }, [])

    return stack.join('\n')
  }
})()
var notifications = {}
window.addEventListener('beforeunload', function () {
  for (var k in notifications) {
    var notification = notifications[k]
    notification.close()
  }
})
function notify(msg, options) {
  var notification
  options.body = msg
  if (!('Notification' in window)) { alert('This browser does not support desktop notification') }
  else if (Notification.permission === 'granted') {
    notification = new Notification(options.title, options)
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        notification = new Notification(options.title, options)
      }
    })
  }
  if (options.tag) notifications[options.tag] = notification
  if (options.title === 'Passed') {
    setTimeout(function() {
      notification.close()
    }, 1500)
  } else {
    setTimeout(function() {
      notification.close()
    }, 10000)
  }
}



function image(stat) {
  if (stat === 'ok') return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAABFCAYAAAARk1tuAAAABGdBTUEAALGPC/xhBQAABlRJREFUeAHlXG9oHEUUf5uzJl5MTSStDTUlJ2P8IDaCFVGKouA304Ii/kFKYmiVSKGgCPkgxE9SsAqVCEbBNG1yvQsoNv0kglahX1RsaxFijiRt1BNT9Whyl7u2l/HNXu5u9272Zmdub283LpSdffPmzXu/vPnz3sxVg//TQ+lNADO3AMw1AbTcyJmeyIDWm2JlbUNjQS+1AUzuhfjlQ5DM9FjbugJAog0bEww6vhti33xnbXxpTRbBOBZAt9lAD6UaxA/+hEBU8AKOvc2p8zhG1jYOGGw+iA1c55gqJnVse5IxNYg5fcDBPEIVCHLjNdA+WGJWbgzPWBycU/qTkdUjoIU/zLf1v2ek3/oIMpmuvEG2381JnCfCbxj5/b2a0KN9EDv3qdEge2XcVpCTDThpUiO/fz2DnrlPDYg1BCK1uRQIBoo/waC0BWLHLhj/qrbLBHaCdmqZx+/PCTQ2cJVnjJBGMrhyTPxsxec/z1g6dMbKmIr09uRpBKKwcvB4/QUGfW8QElcf5RlSkRZYTUBbpLciD1b6ZzXRJ0yVeUKPO5rQ0owIDH94BqWN6hPmzffYAYIB5Y8JdP7An6K/KreepPtBm/yVW8chet8z6PC7kM22cnSvTGpP44Q5OVaZyVzr7TmDfoZ5idMSeYm8cZisuTsqbZt3PYPSoBoQbIeZ3pyHRebtXTDmD/wuY0iBl2QftNphFngsCt4EQ3WeIOm3QTv+g4WtQrL0uBJKrJaBnsUA7BP5uKNxZQF2REPVdO8tMJRTd5jtI8c34X5iPf2vBom3hkn8oJqLk0CoWiAYfN4Bg470QTIll9VmFuiR6NgCK1b7eGOYUNqGCd1/pI1pXf0WtoQfk25n0cAbYMy+bEq/WehaQsa4i0wEcHjgxsKZp/7DhC2jKg8J3OkkEEyF+oJBz3VD7PLr0ljoAdi42qasQmf1Gya5gx95F3d4njBiUz/PSA5NGBWxV8Z5oj38uD1eea76gEG/3AXxv16QVpdsYvsJeW+y2ZH7YFDaALGT39vUr8jm4H6iKNRccj/TlXjzC7MKNr70o8BIxcy2DSlCFnc9gyVrrvz9lFArEwPGHR2RXSZSjT7cA0MfHgpZK9LEErpVBWB2sXNvmKgMD7KCVwaithO6do224nNnn8FWD9lJM5BMwF0RvKDm3iMeJsy99X9fq3mR0uqBq2dodYd7MOR64hvIdofw/rOwOHsYo8muglLpF0ehafKVwredQnLohB02Ew/J7FHNY5rkSH6UDxM60guxH09ZyiErmGeMDlvWGyv02OPojJEkLLeuYFgedSwsF/ZnYCiCwVJui4Oz4itB+tmlvRSbdGjufFhusFVYzM0Z+hkFXhu0dTcqgEJfelooWSU0J0G2jNZsuy3SOQdGbCApYjTVL147bPou/aBXtkuH5vrNu49dW0ZLVWbfuFKg4rJPJtgFtDdo2Wx+6KJlHbcCjwNLbt5x2WpMRM8Y3yvfB3OoYB+3HbtQIntQTO7YypXlMhGteuIrpT5jdKSsnT73XCynlzEaCHo0mruha6DWpYhg9MTVer4VgO7rNrWNHzxr+hZ9BJYTontWIhFO1jN/xwGr+MRXo4WWdHq33LkH22VmXN9lFvTlFPCWrEahOXieUycmJVt6gO7vxu06Xh/4XO4eBUn212OXWcko5hmYL+hUyEeui41lZ3DLLrc0Ny4vgDY1ti7BM68cGLBvyj2NcAfbmb7Xvf7s97QOxrZL9ptUyUmuYRA2napSSk2a58Bg80bn9tGa9GAUmvtZw7SR5KXyumegSo3PHKmtYjg8OiIP1baP6qQXwYCe2epECVrrw0N8S1cgpabVRTDYUOnYGq5Jbx4fHnmbi2AwSvOed/IVzr3Z8Eg94py82kkygwEPS0abNhQj2ee8unqUam8Gw+mhwm7gaSeKW/bS3j32bQaDKdf8/LAzOmLs0Zne6Ywsd6SUg6Hd70y2iaziT6D4vwVzxzT5XsrBYDLIA/3yogwt2AGQVvuDYkOPjhT5YMDgeFXSQ2vmPEdVwtxrzAdD09aUvUO/vz215J4JzvVUPDfhyZzb/69UPrMO56M8tVVpfM/ISwuNbskXhe8OGoZQ5HYhn4cZKntGXnF6AU/Df0FgfsMs9nX8/2ryj5YGuG0e4NU/9IxZnuzT938oyMrDt9j2FAAAAABJRU5ErkJggg=='
  if (stat === 'error') return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAYAAAAc0MJxAAAABGdBTUEAALGPC/xhBQAABPJJREFUeAHt3E1v1EYYB/Dx7IK4oIQAVZO0kAgBahHaqnDgQFFVlRsgTlR8gR64wxmucObQL9BDjoQbBUHLAaGqAqGCoh4ILWSRaEOQ+gJh12b/WT2L15m1580zs+s+UjK21575+5dZJ9l4w5hh3eF7zjzmk48Nuynt8Ou12fklPnmvtAFkOgbSPT6d4CNELCBRPlOsSAZEtA+QNrF/LqcfG2Px4mzcnE1v87UMpK3J6rH0+B+w+P5U3PwsvU12WQtKhEQDhoAlQqJ8uljKUHlIFMYnVh4S5dPBUoKSQaIwPrBkkCifKpY0lAoShXGJpYJE+VSwpKB0kCiMCywdJMoni1UIZYJEYcrEMkGifDJYuVA2kChMGVg2kChfEdZAKJtIFMYmlk0kypeHJYQqA4nC2MAqA4nyDcJaB1UmEoUxwSoTifKJsPqgXCBRGB0sF0iUL4vVg3KJRGFUsFwiUb401hqUDyQKI4PlA4nyEVZ0k+8+O87+vUgP+GjzsHwikcXOqP0j3xxteEIbfLWvGJ8RvZ4VAhJMxhN+lR9oP5xbjcZP+EKicbNYoSA1WPtCFC9d6l3M79b2Hd+YrFyh4L7aMZYsvo7qv79J2kd8ZaBxu0jPz2O9B4WVULCQxXelkZClDwobfqnv/5rHy9ewXNXKIsFhHRQ2VhlLhDQQqqpYg5ByoaqGlYdUCFUVrCIkKahRx5JBkoYaVSxZJCWoUcNSQVKGwgEL9cbh/+I/f8LysJYqEs5T+HNUEcAwY+kgaUPhwGHE0kUygho2LBMknCvHJ93a27p/u8W3faF7vKvjTJGQU+salT3BnzsX+HqgF3gbSNag0FGIWLaQcH5GTz10QHWw8zR8EdDT0CYSztEaFDrbFP99Em0I1WSR1SxWrlGAucVnvxtjq9+GgEQZ8v66Q/vItlZm1C2+KzgkAGT/YCGLItrPeEZ1kV4HNZOyJ2pjZhlBDQMSoW1k8cqncXMLrau22lDDhEQoJlhaUDf4zPcT7O1pCjBMrS6WMtQwI9EXVAdLCWoUkNJYn8TNiQ5AQtvyWmmoUUIiEMwsWSwpqFFEUsUqhBplJBWsXKgqIMliDYSqEpIMlhCqikhFWOugrtd2dt452ep75yR1UpVW9N2wD+p/pPdTIYvVe5klFKQGS85NB3BP6Srj44/45HLnp9G1ybQGFQ5S98bS7e1f50O4ATeFxaMrnXdz78i8m/v9BHS3JHqNO5R7SsdYazF6yb6cecJ/8/oPHkRI9CUK4TbJRpSc4FvYzcWt8d6PKJjrNg8JWT5vPfgh5hNHXeei8RoR+yZqL833vuv9wb6a/osvPKUdXLRFSOkMPmZWF+nZHHL0oLDiEksFCdlQLrHSSBi7DwobXGDpICEbygVWFgnjroPCxjKxTJCQDVUmlggJYwqh8EAZWDaQkA1VBtYgJIw3EAoP2sSyiYRsKJtYeUgYKxcKO9jAKgMJ2VA2sIqQME4hFHYywSoTCdlQJrdJyiBhDCko7KiD5QIJ2VA6WLJI6F8aCjurYLlEQjaUCpYKEvpWgsIBMlg+kJANJYOlioR+e69HYUWmPmY3nuX9bugTCfmLbsDVQUK/yjMKB6FEM8s3UjdZ97PonlJdpHS/WsvAon/fmPAPz2t1UuJBwOrlq02fKnGo4q4fsUMzCZ86U7ynnz0W6vsOJ7Wp46ajvwNn2UGL+XiyUAAAAABJRU5ErkJggg=='
}




// change growl function
Mocha.prototype._growl = function(runner, reporter) {
  runner.on('pass', function (test) {
    var notification = notifications[test.title]
    if (notification) notification.close()
  })

  runner.on('fail', function (test, err) {
    notify(filter(err.stack), {
      tag: test.title,
      title: test.title,
      icon: image('error')
    })
  })
  runner.on('end', function(){
    var stats = reporter.stats
    if (stats.failures) {
      //var msg = stats.failures + ' of ' + runner.total + ' tests failed'
      //notify(msg, {title: 'Failed', icon: image('error') })
    } else {
      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
          title: 'Passed'
        , icon: image('ok')
      })
    }
  })
}

process.nextTick(function() {
  delete require.cache[module.id]
  if(typeof window !== 'undefined' && window.mochaPhantomJS) {
    mochaPhantomJS.run()
  } else {
    mocha.run()
  }
})
