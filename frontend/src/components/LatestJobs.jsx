import React from 'react';
import { motion } from 'framer-motion';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15, // delay between each card
    },
  },
};

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  return (
    <motion.div
      className='max-w-[90%] mx-auto my-20'
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <h1 className='text-4xl font-bold'>
        <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2'>
          Latest & Top 
        </span> Job Openings
      </h1>
      <div className='grid grid-cols-3 gap-4 my-5'>
        {allJobs.length <= 0 ? (
          <span>No Job Available</span>
        ) : (
          allJobs.slice(0, 6).map(job => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </motion.div>
  );
};

export default LatestJobs;
