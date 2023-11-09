import './App.css'

function App() {

  return (
    <main>

      <label>Base IP</label>
      <input type="text" value="127.0.0.1"/>
      <label>Port</label>
      <input type="text" value="8080"/>
      <label>URI + Vars</label>
      <input type="text" value="user"/>
      <label>Method</label>
      <select>
          <option value="get">Get</option>
          <option value="post">Post</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>  
      </select>
      <label>Object</label>
      <input type='textarea'/>
    </main>
  )
}

export default App
