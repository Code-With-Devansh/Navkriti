import Link from 'next/link'
import React from 'react'

const LoginForm = () => {
    return (
        <div className='form-container'>
            <div className="image-container">

            </div>
            <form>
                <input type="text" name="email" id="email" placeholder='Enter Email'/>
                <input type="password" name="password" id="password" placeholder='Enter Password'/>
                <Link className="btn filled" href={"/"}>Login</Link>
            </form>
        </div>
    )
}

export default LoginForm