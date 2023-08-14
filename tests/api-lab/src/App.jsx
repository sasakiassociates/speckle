import { useState } from 'react'
import './App.css'
import Speckle from '../../../src/Speckle'

const SPECKLE_TOKEN="6bc51117525a6f46a1c7b535e2d7e0aeb8f52a685f"
const SPECKLE_SERVER="https://sasaki.speckle.xyz"

function App() {
  const [count, setCount] = useState(0)
  const client = new Client(SPECKLE_TOKEN,SPECKLE_SERVER);

  return (
    <><h1>hi there world</h1>
    </>
  )
}

 class Client{

  constructor(token, server){
    this.client = new Speckle( {token: token,server:server } )
    this._authenticate((t=>console.log(t)))

  }

    async _authenticate(callback){
      const user = await this.client.activeUser()
    callback(user)
  }

    
 }



export default App
