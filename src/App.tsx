import { useState } from 'react'
import './App.css'

function App() {

  const formDefault = {
    baseIP: '127.0.0.1', 
    port : 9000,
    URIVar: 'users',
    verb: '',
  }

  const [form, setForm] = useState<IForm>(formDefault)

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
    const {name, value} = event.currentTarget
    setForm({...form, [name] : value})
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()
    console.log('http://' + form.baseIP + ':' + form.port + '/' + form.URIVar)
    // fetch('http://' + form.baseIP + ':' + form.port + '/' + form.URIVar).then(response => response.json()).then(json => console.log(json))
    const response = await fetch('http://' + form.baseIP + ':' + form.port + '/' + form.URIVar);
    const users = await response.json();
    console.log(users)
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
        <select onChange={handleChange}>
            <option value="get">Get</option>
            <option value="post">Post</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>  
        </select>
        <label>Object</label>
        <textarea/>
        <input type="submit" value="Send this Request"/>
      </form>
    </main>
  )
}

export default App

interface IForm{
  baseIP: string
  port: number
  URIVar: string
  verb: string
}