import React from 'react'
import LeftSidebar from '../components/leftSidebar/LeftSidebar'
import RightSidebar from '../components/rightSidebar/RightSidebar'
import Vacation from '../components/vacation/Vacation'
import { useParams } from 'react-router-dom'

function VacationDetails() {
  const {id} = useParams()

  return (
    <>
        <div className='flex content-center justify-center'>
          <LeftSidebar/>
          <Vacation id={id}/>
          <RightSidebar/>
        </div>
    </>
  )
}

export default VacationDetails