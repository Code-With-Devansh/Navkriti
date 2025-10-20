import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header>
      <div className="logo">
        <Image src={"/images/navkriti-logo.png"} width={70} height={70} alt='Logo'/>
      </div>
      <nav>
        <ul>
          <li>
            <Link href={"/"} >Home</Link>
          </li>
          <li>
            <Link href={"/"} >About</Link>
          </li>
          <li>
            <Link href={"/"} >Features</Link>
          </li>
          <li className='rounded btn'>
            <Link href={"/create-account"} >Sign in</Link>
          </li>
          <li className='rounded btn filled'>
            <Link href={"/login"} className='filled' >Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header