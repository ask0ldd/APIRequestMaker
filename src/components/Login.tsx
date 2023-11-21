import { useState } from 'react'
import '../style/Login.css'

function Login(){

    const [credentials, setCredentials] = useState<Array<string>>(["", ""])

    function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
        if(event.currentTarget.name == "username") {
            const newCredentials = [...credentials]
            newCredentials[0] = event.currentTarget.value
            setCredentials(newCredentials)
            console.log(newCredentials)
        }
        if(event.currentTarget.name == "password") {
            const newCredentials = [...credentials]
            newCredentials[1] = event.currentTarget.value
            setCredentials(newCredentials)
            console.log(newCredentials)
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLElement>){
        event.preventDefault()
        const login = credentials[0]
        const password = credentials[1]
        // const credentialsB64 = btoa(login + ':' + password)
        try{
            const response = await fetch("http://127.0.0.1:9000/auth/login", {
            method: "POST",
            // mode: "cors",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": "Basic "+ credentialsB64
            },
            body: JSON.stringify({
                "username" : login,
                "password" : password
            })
            })
            if(response.ok) {
                const responseObj = await response.json()
                console.log(responseObj)
                return(responseObj)
            }
            const message = await response.text()
            if(message) return console.log(message)
            return console.log("LOGIN request failed.")
        }catch(error){
            console.error(error)
            return console.log("LOGIN request failed.")
        }
      
    }

    return(
        <form className="loginContainer" onSubmit={handleSubmit}>
          <label htmlFor='username'>Username</label>
          <input name="username" onChange={handleChange} type="text" value={credentials[0]}/>
          <label htmlFor="password">Password</label>
          <input name="password" onChange={handleChange} type="text" value={credentials[1]}/>
          <input type="submit" value="Receive your Token"/>
        </form>
    )
}

export default Login

/*

https://datatracker.ietf.org/doc/html/rfc7617

The user's name is "test", and the password is the string "123"
   followed by the Unicode character U+00A3 (POUND SIGN).  Using the
   character encoding scheme UTF-8, the user-pass becomes:

      't' 'e' 's' 't' ':' '1' '2' '3' pound
      74  65  73  74  3A  31  32  33  C2  A3

   Encoding this octet sequence in Base64 ([RFC4648], Section 4) yields:

      dGVzdDoxMjPCow==

Thus, the Authorization header field would be:

      Authorization: Basic dGVzdDoxMjPCow==

   Or, for proxy authentication:

      Proxy-Authorization: Basic dGVzdDoxMjPCow==


      btoa() & atob() js fn to encode & decode to & from base64
*/