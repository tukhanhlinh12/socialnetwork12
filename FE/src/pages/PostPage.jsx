import React from 'react'
import LeftSidebar from '../components/leftSidebar/LeftSidebar'
import RightSidebar from '../components/rightSidebar/RightSidebar'
import { useParams } from 'react-router-dom'
import PostDetails from '../components/post/PostDetails'

function PostPage() {
  const {id} = useParams()

  return (
    <>
        <div className='flex content-center justify-center'>
          <LeftSidebar/>
          <PostDetails id={id}/>
          <RightSidebar/>
        </div>
    </>
  )
}

export default PostPage