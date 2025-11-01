import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import Footer from './shared/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Jobnotfound from './Jobnotfound'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { setFilterText } from '@/redux/jobSlice'


const Jobs = () => {
    useGetAllJobs();
    const { authUser } = useSelector((store) => store.auth);
    const { allJobs, filterText } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        //console.log(FilterText)
        if (filterText) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(filterText.toLowerCase()) ||
                    job.description.toLowerCase().includes(filterText.toLowerCase()) ||
                    job?.location?.toLowerCase().includes(filterText.toLowerCase())
            })
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
        
    }, [allJobs, filterText]);


    useEffect(() => {
        if (authUser?.role === 'recruiter') {
            navigate("/admin/jobs");
        }
    },[authUser])

    useEffect(() => {
        // Cleanup function to reset search text when the component unmounts
        return () => {
            dispatch(setFilterText(""));
        };
        
    }, []);



    return (
        <div className='bg-gray-100 h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-[20%]'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs?.length <= 0 ? <Jobnotfound /> : (//if no job found then show job not found
                            <div className='flex-1 h-[88vh] overflow-y-auto  no-scrollbar pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs && filterJobs?.map((job) => (
                                            <motion.div
                                                key={job._id}
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Job job={job} />{/*passing the job details as props and displayig ht job card*/}
                                            </motion.div>
                                        ))
                                    }

                                </div>
                            </div>
                        )
                    }

                </div> 
            </div>
        </div>

            )
}

            export default Jobs