import { useState } from 'react'
import '../style/Login.css'

function Login(){

    const [credentials, setCredentials] = useState<Array<string>>([])

    function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
        if(event.currentTarget.name == "username") {
            const newCredentials = [...credentials]
            newCredentials[0] = event.currentTarget.value
            setCredentials(newCredentials)
        }
        if(event.currentTarget.name == "password") {
            const newCredentials = [...credentials]
            newCredentials[1] = event.currentTarget.value
            setCredentials(newCredentials)
        }
    }

    return(
        <form className="loginContainer">
          <label htmlFor='username'>Username</label>
          <input name="username" onChange={handleChange} type="text" value={credentials[0]}/>
          <label htmlFor="password">Password</label>
          <input name="password" onChange={handleChange} type="text" value={credentials[1]}/>
        </form>
    )
}

export default Login