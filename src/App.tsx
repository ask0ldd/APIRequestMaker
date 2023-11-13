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
    const datas = await sendRequest()
    if(datas) setRequestResult(datas)
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
    setForm({...form, URIVar : (event.currentTarget as HTMLElement).innerHTML})
  }

  async function sendRequest(){
    const url = 'http://' + form.baseIP + ':' + form.port + '/' + form.URIVar
    // console.log(form.postDatas)

    if(form.verb == "get") {
      try{
        const response = await fetch(url)
        if(response.ok) return(JSON.stringify(await response.json()))
        const message = await response.text()
        if(message) return message
        return "This GET request failed."
      }catch(error){
        console.error(error)
        return "This GET request failed."
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
        if(response.ok) return(JSON.stringify(await response.json()))
        const message = await response.text()
        if(message) return message
        return "This POST request failed."
      }catch(error){
        console.error(error)
        return "This POST request failed."
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
        if(response.ok) return(JSON.stringify(await response.json()))
        const message = await response.text()
        if(message) return message
        return "This UPDATE request failed."
      }catch(error){
        console.log(error)
        return "This UPDATE request failed."
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
        if(response.ok) return("User deleted successfully.")
        return "Can't delete the request User."
      }catch(error){
        console.log(error)
        return "Can't delete the request User."
      }
    }

  }

  return (
    <main>
      <div className='formnResultsContainer'>
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
      </div>
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