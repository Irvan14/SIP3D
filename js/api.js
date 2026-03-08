const API_URL =
"https://script.google.com/macros/s/AKfycbziTjfC3Sh0jor3rLIeUkseqQ6EUIfNjDorS8WQsSuiVsbgH27N0VyO822ezRlz_X-RQw/exec"

let CACHE_DATA = null
let CACHE_TIME = 0

async function getData(){

  const res = await fetch(API_URL + "?t=" + Date.now())
  const data = await res.json()

  return data
}

async function postData(data){

  const res = await fetch(API_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify(data)
  })

  return await res.json()
}
