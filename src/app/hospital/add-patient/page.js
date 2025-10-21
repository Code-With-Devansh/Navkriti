import React from 'react'
import CreateAccountForm from '@/components/AddPatientForm'
import SideBar from '@/components/SideBar'

const AddPatient = () => {
  return (
    <>
    <SideBar active={"add-patient"} />
    <CreateAccountForm />
    </>
  )
}

export default AddPatient