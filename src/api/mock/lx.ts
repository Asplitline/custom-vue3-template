const arr = ['猪', '牛', '羊', '禽类', '禽蛋', '奶制品']
const pid = '68B739E460C24182ACE653BAEFE58D7C'
const pic = 'xuqing'
const res = arr.map((i, index) => {
  return {
    name: i,
    description: i.repeat(3),
    icon: `${pic}_${index}.png`,
    createTime: Date.now(),
    pid,
  }
})

const api = (data) => {
  fetch('http://localhost:3000/api/apiLx/insert', {
    headers: {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'access-auth-token': '"590DA2C7F7DF4C13BCF2C2F869F899A4"',
      'content-type': 'application/json',
      'sec-ch-ua':
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    referrer: 'http://localhost:3000/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  })
}

res.forEach((item) => {
  api(item)
})
