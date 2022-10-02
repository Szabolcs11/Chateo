import React, { useState } from 'react'
import { handleRegister } from '../../App'
import { changeAuthPage } from '../../pages/Auth/Auth'

function RegisterComponent() {

    const [regUsername, setRegUsername] = useState();
    const [regEmail, setRegEmail] = useState();
    const [regPassword, setRegPassword] = useState();

  return (
    <div className='Auth-Main'>
        <div className='Auth-Content'>

        <div className='Auth-Container-Title'>
            Register
        </div>

        <div className='SeparatorLine'></div>

        <div className='Auth-Main-Content'>
            <input type='text' placeholder='Username' className='Auth-Input' onChange={e => {
                setRegUsername(e.target.value)
            }} />
            <input type='email' placeholder='E-mail' className='Auth-Input' onChange={e => {
                setRegEmail(e.target.value)
            }}/>
            <input type='password' placeholder='Password' className='Auth-Input' onChange={e => {
                setRegPassword(e.target.value)
            }}/>

            <div className='Auth-Main-Button' onClick={() => handleRegister(regUsername, regEmail, regPassword)}>
            Regitser
            </div>
            <div className='Auth-Main-Button' onClick={() => changeAuthPage('login')}>
            Redirect to Login
            </div>
        </div>

        </div>
    </div>
  )
}

export default RegisterComponent