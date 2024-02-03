import React from 'react'
import LeftSidebar from '../components/leftSidebar/LeftSidebar'
import RightSidebar from '../components/rightSidebar/RightSidebar'
import Profiles from '../components/leftSidebar/Profiles'

function Profile() {
  return (
    <>
        <div className='flex content-center justify-center'>
          <LeftSidebar/>
          <Profiles/>
          <RightSidebar/>
        </div>
    </>
  )
}

export default Profile