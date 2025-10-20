import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LoginFormHospital = () => {
  return (
    <div className='form-container'>
        <div className="left">
          <Image src={"/images/doctor-loginpage.png"} fill={true}/>
        </div>
        <div className="right">
            <h2>Hospital Login</h2>
            <input type="text" placeholder='Enter hosptial email id' />
            <input type="text" placeholder='Enter password'/>
            <Link href={"/hospital/dashboard"}>Login</Link>
        </div>
    </div>
  )
}

export default LoginFormHospital