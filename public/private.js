{
  const pre = document.getElementById('out2')

  const log = (res) => {
    pre.textContent = `
${res.status} ${res.statusText}
${res.headers.get('content-type')}
${res.url}
`
  }

  document.querySelector('#getprivate')
  .addEventListener('click', () => {

    fetch('/api/private', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-access-token': sessionStorage.getItem('token')
      }
    })
    .then(res => {
      log(res)
      if (res.status >= 400){

      }
      return res.json()
    })
    .then(data => {
      pre.textContent += JSON.stringify(data, null, '\t')
    })
    .catch(err => {
      console.error(err)
      // pre.textContent = JSON.stringify(err, null, '\t')
    })


  })
}
