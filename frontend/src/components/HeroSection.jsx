
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


const searchJobHandler = () => {
  if (!query.trim()) return; // avoid empty search
  navigate(`/search-results?query=${encodeURIComponent(query)}`);
};

    return (
        <div className='text-center w-[90%] mx-auto'>
            <div className='flex flex-col gap-5 my-10 mt-20'>
                <motion.h1
                initial= {{opacity: 0, y: 30}}
                animate= {{opacity: 1, y: 0}}
                transition= {{duration: 0.8}} 
                className='text-5xl font-bold'>Find Your Dream Job or<span className='block mt-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Perfect Hire</span>
                </motion.h1>
                <motion.p 
                initial= {{opacity: 0, y: 30}}
                animate= {{opacity: 1, y: 0}}
                transition= {{delay: 0.2, duration: 0.8}}
                className='text-xl text-gray-600 max-w-3xl mx-auto'>Connect talented professionals with innovative companies. Your next career move or perfect candidate is just one click away.
                </motion.p>
                <motion.div
                initial= {{opacity: 0, y: 30}}
                animate= {{opacity: 1, y: 0}}
                transition= {{delay: 0.4, duration: 0.8}}
                className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full'

                    />
                    <Button onClick={searchJobHandler} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-r-full font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md">
                        <Search className='h-5 w-5' />
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}

export default HeroSection