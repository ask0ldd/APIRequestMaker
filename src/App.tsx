import { useState } from 'react'
import './App.css'

function App() {

  const formDefault = {
    baseIP: '127.0.0.1', 
    port : 9000,
    URIVar: 'users',
    verb: 'get',
    postDatas : ''
  }

  const [form, setForm] = useState<IForm>(formDefault)
  const [requestResult, setRequestResult] = useState<string>('')
  const [savedURI, setSavedURI] = useState<string[]>([])

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
    const {name, value} = event.currentTarget
    setForm({...form, [name] : value})
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    sendRequest()
  }

  function saveURI(event: React.FormEvent<HTMLButtonElement>){
    event.preventDefault()
    const input = event.currentTarget.previousSibling as HTMLInputElement
    if(!savedURI.includes(input.value)) setSavedURI([...savedURI, input.value])
  }

  function setUriAsActive(event: React.FormEvent<HTMLElement>){
    event.preventDefault()
    const uriInput = document.querySelector('[name="URIVar"]') as HTMLInputElement
    uriInput.value = (event.currentTarget as HTMLElement).innerHTML
  }

  async function sendRequest(){
    const url = 'http://' + form.baseIP + ':' + form.port + '/' + form.URIVar
    // console.log(form.postDatas)
    let datas

    if(form.verb == "get") {
      try{
        const response = await fetch(url)
        datas = await response.json()
      }catch(error){
        console.log(error)
      }
    }

    if(form.verb == "post") {
      try{
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: form.postDatas
        })
        if(response.status !== 200) return console.log(response.statusText)
        console.log(response.status)
        datas = await response.json()
        console.log('datas : ',datas)
      }catch(error){
        console.log(error)
      }
    }

    if(form.verb == "update") {
      try{
        const response = await fetch(url, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: form.postDatas
        })
        if(response.status !== 200) return console.log(response.statusText)
        datas = await response.text()
        if(datas?.length > 0) return console.log('datas : ', datas)
        console.log("Target not found.")
      }catch(error){
        console.log(error)
      }
    }

    if(form.verb == "delete"){
      try{
        const response = await fetch(url, {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
        datas = await response.text()
        if(response.status !== 200) return console.log(response.statusText)
        console.log(datas)
      }catch(error){
        console.log(error)
      }
    }

    if(datas) setRequestResult(JSON.stringify(datas))
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor='baseIP'>Base IP</label>
        <input name="baseIP" onChange={handleChange} type="text" value={form.baseIP}/>
        <label htmlFor="port">Port</label>
        <input name="port" onChange={handleChange} type="text" value={form.port}/>
        <label htmlFor="URIVar">URI + Vars</label>
        <div className='inputButtonContainer'>
          <input name="URIVar" onChange={handleChange} type="text" value={form.URIVar}/><button onClick={saveURI}>+</button>
        </div>
        <ul className='uriListContainer'>
          {
            savedURI.map((uri, index) => (<li key={'uri'+index} className='uriList' onClick={setUriAsActive}>{uri}</li>))
          }
        </ul>
        <label>Method</label>
        <select name="verb" onChange={handleChange}>
            <option value="get">Get</option>
            <option value="post">Post</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>  
        </select>
        <label>Object</label>
        <textarea name="postDatas" onChange={handleChange}/>
        <input type="submit" value="Send this Request"/>
      </form>
      { requestResult && <div className='requestResult'>{requestResult}</div> }
    </main>
  )
}

export default App

interface IForm{
  baseIP: string
  port: number
  URIVar: string
  verb: string
  postDatas : string
}