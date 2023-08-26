import React, { useEffect } from 'react'
import { useAppContext } from '../context/appContext'
import { Loading, Job, PageBtnContainer, Alert } from '../components'
import Wrapper from '../assets/wrappers/JobsContainer'

const JobsContainer = () => {

  const { 
    showAlert,
    getJobs, 
    jobs = [], 
    isLoading, 
    page, 
    totalJobs,
    search,
    searchStatus,
    searchType,
    numOfPages,
    sort } = useAppContext()

  useEffect(() => {
    getJobs()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, searchStatus, searchType, sort])

  if (isLoading) {
    return <Loading center />
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className='jobs'>
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
      {/* <PageBtnContainer /> */}
    </Wrapper>
  )
}

export default JobsContainer