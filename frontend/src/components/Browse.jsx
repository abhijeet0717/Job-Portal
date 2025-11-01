import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import Job from './Job';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchText } from '@/redux/jobSlice';

const Browse = () => {
  useGetAllJobs();//it will run first (the useEffect will work)
  const { allJobs } = useSelector(store => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    //cleanup code(run when umounting of component)
    return () => {
      console.log("Browse component unmounted");
      dispatch(setSearchText(""));
    }
  }, [])//when [] is the depency array it will run only once when component is mounted(after the intial render)
  //in the intial render conponenet are intialized , the methods are called  and after that the useEffect will run

  //so no problem as the allJobs will be  of serachText which is stored
  //then useEffect make the searchText empty

 // In the Browse component, the useGetAllJobs hook will run first, followed by the useEffect hook. 
  //This is because the useGetAllJobs hook is called directly within the component body, whereas the useEffect hook is scheduled to run after the initial render.
  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-xl my-10'>Search Results ({allJobs?.length})</h1>
        <div className='flex-1 h-[88vh] overflow-y-auto  no-scrollbar pb-5'>
          <div className='grid grid-cols-3 gap-4'>

            {
              allJobs?.length !== 0 ? allJobs?.map((job) => {
                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Job job={job} />
                  </motion.div>
                )
              }) : <span>No Job Found</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Browse