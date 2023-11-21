import { useState } from 'react'
import './App.css'
import Login from './components/Login'

function App() {

  const formDefault = {
    baseIP: '127.0.0.1', 
    port : 9000,
    URIVar: 'users',
    verb: 'get',
    postDatas : '',
    token : ''
  }

  const [form, setForm] = useState<IForm>(formDefault)
  const [requestResult, setRequestResult] = useState<string>('')
  const [savedRequests, setSavedRequests] = useState<IRequest[]>([])

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) : void{
    const {name, value} = event.currentTarget
    setForm({...form, [name] : value})
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) : Promise<void>{
    event.preventDefault()
    const datas = await sendRequest(form)
    if(datas) setRequestResult(datas)
  }

  function saveRequest(event: React.FormEvent<HTMLButtonElement>) : void{
    event.preventDefault()
    const endpointInput = event.currentTarget.previousSibling as HTMLInputElement
    const verbInput = document.querySelector('[name="verb"]') as HTMLInputElement
    if(endpointInput.value == "" || verbInput.value == "") return
    if(savedRequests.find(request => JSON.stringify(request) == JSON.stringify({endpoint: endpointInput.value, verb: verbInput.value.toUpperCase()})) != null) return
    if(['put', 'delete', 'get', 'post'].includes(verbInput.value)) setSavedRequests([...savedRequests /* replace with previous state*/, {endpoint: endpointInput.value, verb: verbInput.value.toUpperCase() as IRequest["verb"]} ])
  }

  function setRequestAsActive(event: React.FormEvent<HTMLElement>) : void{
    event.preventDefault()
    const endpointInput = document.querySelector('[name="URIVar"]') as HTMLInputElement
    const verbInput = document.querySelector('[name="verb"]') as HTMLSelectElement
    endpointInput.value = (event.currentTarget.querySelector('.listItemEndpoint') as HTMLElement).innerHTML
    verbInput.value = (event.currentTarget.querySelector('.listItemVerb') as HTMLElement).innerHTML.toLowerCase()
    setForm({...form, URIVar : endpointInput.value, verb : verbInput.value.toLowerCase()})
  }

  async function sendRequest(form : IForm) : Promise<string> {
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

    if(form.verb == "put") {
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

    return "Unknown Request."

  }

  return (
    <main>
      <Login/>
      <div className='formnResultsContainer'>
        <form onSubmit={handleSubmit}>
          <label htmlFor='baseIP'>Base IP</label>
          <input name="baseIP" onChange={handleChange} type="text" value={form.baseIP}/>
          <label htmlFor="port">Port</label>
          <input name="port" onChange={handleChange} type="text" value={form.port}/>
          <label htmlFor="URIVar">URI + Vars</label>
          <div className='inputButtonContainer'>
            <input name="URIVar" onChange={handleChange} type="text" value={form.URIVar}/><button onClick={saveRequest}>+</button>
          </div>
          {savedRequests.length > 0 && <ul className='uriListContainer'>
            {
              savedRequests.map((request, index) => (<li key={'uri'+index} className='uriList' onClick={setRequestAsActive}><span className='listItemEndpoint'>{request.endpoint}</span><span className='listItemVerb'>{request.verb}</span></li>))
            }
          </ul>}
          <label>Method</label>
          <select name="verb" onChange={handleChange}>
              <option value="get">Get</option>
              <option value="post">Post</option>
              <option value="put">Update</option>
              <option value="delete">Delete</option>  
          </select>
          <label htmlFor="token">Token</label>
          <input name="token" onChange={handleChange} type="text" value={form.token}/>
          <label>Object</label>
          <textarea name="postDatas" onChange={handleChange}/>
          <input type="submit" value="Send this Request"/>
        </form>
        <div className='requestResult'>{requestResult && requestResult}</div>
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
  postDatas : string,
  token : string,
}

interface IRequest{
  verb: "GET" | "PUT" | "DELETE" | "POST",
  endpoint: string
}

/*const baseRequest = {
  method: "",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
}*/


/*async function sendRequestV2(form : IForm) : Promise<string> {
  const url = 'http://' + form.baseIP + ':' + form.port + '/' + form.URIVar
  const body = (form.verb == "delete" || form.verb == "get") ? "" : form.postDatas
  const requestDetails = {...baseRequest, method : form.verb.toUpperCase(), body : body}
  
  try{
    const response = await fetch(url, requestDetails as RequestInit)
    if(response.ok) return(JSON.stringify(await response.json()))
    const message = await response.text()
    if(message) return message
    return "This " + form.verb.toUpperCase() + " request failed."
  }catch(error){
    console.error(error)
    return "This " + form.verb.toUpperCase() + " request failed."
  }

  return "Unknown Request."
}*/