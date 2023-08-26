import React from 'react'
import { Outlet } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/SharedLayout'
import { SmallSidebar, BigSidebar, Navbar } from '../../components'
import { useAppContext } from '../../context/appContext'

const SharedLayout = () => {

    // eslint-disable-next-line
    const {user} = useAppContext()

    return (
        <>
            <Wrapper>
                <main className='dashboard'>
                    <SmallSidebar />
                    <BigSidebar />

                    <div>
                        <Navbar />
                        <div className='dashboard-page'>
                            <Outlet />
                        </div>
                    </div>
                </main>
            </Wrapper>
        </>
    )
}

export default SharedLayout