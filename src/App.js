

import DeroBridgeApi from 'dero-rpc-bridge-api'
import React from 'react'
import ReactDOM from 'react-dom'
import to from 'await-to-js'
import './app.css'

const App = () => {


  const [availability, setAvailability] = React.useState('')
  const deroBridgeApiRef = React.useRef()
  const [bridgeInitText, setBridgeInitText] = React.useState('Not connected to extension')

  React.useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi()
      const deroBridgeApi = deroBridgeApiRef.current
      const [err] = await to(deroBridgeApi.init())
      if (err) {
        setBridgeInitText('failed to connect to extension')
      } else {
        setBridgeInitText('connected to extension')
      }
    }

    window.addEventListener('load', load)
    return () => window.removeEventListener('load', load)
  }, [])


  //------------------WALLET Functions ---------------------------------

  const updateContract = React.useCallback(async (event) => {
    event.preventDefault();
    var code = event.target.code.value
    var transfers = []
    if (event.target.amount.value){
      transfers.push(new Object({
        "burn":parseInt(event.target.amount.value),
          "scid":event.target.asset.value
      }))
    }
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "scid": event.target.scid.value,
      "ringsize": 2,
      "transfers":transfers,
      "fees": parseInt(event.target.fee.value) * 100000,
      "sc_rpc": [{
        "name": "entrypoint",
        "datatype": "S",
        "value": event.target.entrypoint.value
      },
      {
        "name": event.target.var.value,
        "datatype": "S",
        "value": code
      }]
    }))

    console.log(err)
    console.log(res)
  })

  const donate = React.useCallback(async (event) => {
    event.preventDefault();
   
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      "transfers": [{
        "destination": "apollo",
        "amount": 100000
      }
      ],
      "ringsize": 16
    }))

    console.log(err)
    console.log(res)
  })


  //----------------------------USER INTERFACE-----------------------------------------------------------------------------------


  return <div>

    <div>{bridgeInitText}</div>


    <div className="function">
      <h3> Update Contract Code </h3>
      <form onSubmit={updateContract}>
        <p>Your Contract's SCID</p>
        <input id="scid" type="text" />
        <p>Your Contract's Update Function Name (Entrypoint)</p>
        <input id="entrypoint" type="text" />
        <p>Your Contract's Variable Name For the New Code</p>
        <input id="var" type="text" />
        <p>Fee</p>
        <input id="fee" type="text" />
        <p>Asset</p>
        <input id="asset" type="text" />
        <p>Amount</p>
        <input id="amount" type="text" />
        <p>New Code</p>
        <textarea placeholder="Enter New Code Here" rows="44" cols="80" id="code" />
        <button type={"submit"}>Update</button>
      </form>
    </div>






    <footer><small onClick={donate}>Click here to buy a coffee for apollo</small></footer>
  </div>




}



export default App;