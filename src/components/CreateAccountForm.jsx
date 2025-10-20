import Link from 'next/link';
import React from 'react'

const CreateAccountForm = () => {
    return (
        <div className='form-container'>
            <div className="image-container">

            </div>
            <form>
                <input type="text" name='patient_name' id='patient_name' placeholder='Enter patient name'/>
                <input type="text" name="email" id="email" placeholder='Enter Email' />
                <input type="text" name="hostpital_name" id="hostpital_name" placeholder='Enter Hostpital Name' />
                <input type="password" name="password" id="password" placeholder='Enter Password' />
                <Link className="btn filled" href={"/"}>Create Account</Link>
            </form>
        </div>
    )
}

export default CreateAccountForm;