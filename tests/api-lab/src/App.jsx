import { useState } from 'react'
import './App.css'
import Speckle from '../../../src/Speckle'

const SPECKLE_TOKEN="6bc51117525a6f46a1c7b535e2d7e0aeb8f52a685f"
const SPECKLE_SERVER="https://sasaki.speckle.xyz/"

function App() {
  const [count, setCount] = useState(0)

  const client = new Speckle( {
    token: SPECKLE_TOKEN,
    server:SPECKLE_SERVER 
  } )


  console.log(client);

  return (
    <><h1>hi there world</h1>
    </>
  )
}

export default App
