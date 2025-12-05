import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import { motion } from 'framer-motion'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Helmet } from "react-helmet-async";

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div>
            <Helmet>
                    <title>CareerLaunch | All Jobs</title>
            </Helmet>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Explore Your Jobs ({allJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        allJobs.map((job) => {
                            return (
                                <motion.div
                                initial={{opacity: 0, y: 30}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.8}}
                                viewport={{once: true}}
                                >
                                <Job key={job._id} job={job}/>
                                </motion.div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse