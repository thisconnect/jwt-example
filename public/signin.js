{
  const form = document.querySelector('form[name=signin]')
  const pre = document.getElementById('out')

  const log = (res) => {
    pre.textContent = `
    ${res.status} ${res.statusText}
    ${res.headers.get('content-type')}
    ${res.url}
    `
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    fetch('/token', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: form.querySelector('[name=user]').value,
        password: form.querySelector('[name=password]').value,
        keep: form.querySelector('[name=keep]').value == 'on'
    	})
    })
    .then(res => {
      log(res)
      if (res.status < 400){
        return res.json()
      }
      return Promise.reject(res.statusText)
    })
    .then(data => {
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('expires', data.expires)
      pre.textContent += JSON.stringify(data, null, '\t')
    })
    .catch(err => {
      console.error(err)
      pre.textContent += JSON.stringify(err, null, '\t')
    })

  })

  const preToken = document.getElementById('gettoken')
  const prePrivate = document.getElementById('getprivate')


}
