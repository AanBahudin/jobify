import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, Alert, FormRow } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true
}

const Register = () => {
  const { user, showAlert } = useAppContext()
  const navigate = useNavigate()

  const [values, setValues] = useState(initialState)
  const {isLoading, displayAlert, setupUser} = useAppContext()
 
  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, isMember } = values

    if( !email || !password || (!isMember && !name)) {
      displayAlert()
      return;
    }

    const currentUser = {name, email, password}
    if (isMember) {
      setupUser({currentUser, endPoint:'login', alertText: 'Login Successful! Redirecting ...'})
    } else {
      setupUser({currentUser, endPoint:'register', alertText: 'User Created! Redirecting ...'})
    }

  }
  const toggleMember = () => {
    setValues({...values, isMember: !values.isMember})
  }

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }, [user, navigate])

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}

        {/* toggle name field */}
        {!values.isMember && (
          <FormRow type='text' name='name' value={values.name} handleChange={handleChange} />
        )}
        <FormRow type='email' name='email' value={values.email} handleChange={handleChange} />
        {/* <FormRow type='email' name='email' value={test} handleChange={handleValue} /> */}
        <FormRow type='password' name='password' value={values.password} handleChange={handleChange} />

        <button type='submit' className='btn btn-block'>submit</button>

        {/* DEMO APP BUTTON */}
        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: { email: 'testuser@gmail.com', password: 'secret' },
              endPoint: 'login',
              alertText: 'Login Successful! Redirecting...',
            });
          }}
        >
          {isLoading ? 'loading...' : 'demo app'}
        </button>

        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button disabled={isLoading} type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>


      </form>
    </Wrapper>
  )
}

export default Register