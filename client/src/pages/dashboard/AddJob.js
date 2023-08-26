import React from 'react'
import { useAppContext } from '../../context/appContext'
import { FormRow, FormRowSelect, Alert } from '../../components'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
  
  const {isEditing, editJob, position, company, jobLocation, createJob, jobType, jobTypeOptions, status, statusOptions, displayAlert, showAlert, handleChange, clearValues} = useAppContext()

  const handleSubmit = (e) => {
    e.preventDefault()

    if(!position || !company || !jobLocation) {
      displayAlert()
      return
    }

    if(isEditing) {
      editJob()
      return
    }

    createJob()
  }

  const handleJobInput = (e) => {
    handleChange({name: e.target.name, value: e.target.value})
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}

        <div className='form-center'>
          {/* position */}
          <FormRow type='text' name='position' value={position} handleChange={handleJobInput} />

          {/* company */}
          <FormRow type='text' name='company' value={company} handleChange={handleJobInput} />

          {/* location */}
          <FormRow type='text' name='jobLocation' value={jobLocation} handleChange={handleJobInput} />

          {/* job status */}
          <FormRowSelect 
            name='status'
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />

          <FormRowSelect 
            name='jobType'
            labelText='type'
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />

          <div className='btn-container'>
            <button className='btn btn-block submit-btn' type='submit' onClick={handleSubmit}>submit</button>
            <button className='btn btn-block clear-btn' onClick={(e) => {
              e.preventDefault()
              clearValues()
            }}>clear</button>
          </div>
        </div>


      </form>
    </Wrapper>
  )
}

export default AddJob