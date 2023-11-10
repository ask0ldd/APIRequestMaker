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

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
    const {name, value} = event.currentTarget
    setForm({...form, [name] : value})
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    sendRequest()
  }

  async function sendRequest(){
    const url = 'http://' + form.baseIP + ':' + form.port + '/' + form.URIVar
    console.log(form.postDatas)
    let datas

    if(form.verb == "get") {
      try{
        const response = await fetch(url)
        datas = await response.json()
      }catch(error){
        console.error(error)
      }
    }

    if(form.verb == "post") {
      try{
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          /*cache: "no-cache",
          credentials: "same-origin",*/
          headers: {
            "Content-Type": "application/json",
          },
          body: form.postDatas
        })
        console.log(response.status)
        if(response.status != 200) return console.log(response.statusText)
        datas = await response.json()
      }catch(error){
        console.error(error)
      }
    }

    if(form.verb == "update") {
      try{
        const response = await fetch(url, {
          method: "PUT",
          mode: "cors",
          /*cache: "no-cache",
          credentials: "same-origin",*/
          headers: {
            "Content-Type": "application/json",
          },
          body: form.postDatas
        })
        console.log(response.status)
        if(response.status != 200) return console.log(response.statusText)
        datas = await response.json()
      }catch(error){
        console.error(error)
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
        <input name="URIVar" onChange={handleChange} type="text" value={form.URIVar}/>
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
      {requestResult && <div>{requestResult}</div> }
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