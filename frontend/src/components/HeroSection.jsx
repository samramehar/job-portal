import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hero1 from '../images/hero1.avif';
import hero2 from '../images/hero2.avif';
import hero4 from '../images/her04.avif';
import CategoryCarousel from './CategoryCarousel';

const slides = [
  {
    image: hero1,
    title: 'Find Your Dream Job',
    subtitle: 'Connect talented professionals with innovative companies.',
  },
  {
    image: hero2,
    title: 'Hire the Best Talent',
    subtitle: 'Your next career move or perfect candidate is just one click away.',
  },
  {
    image: hero4,
    title: 'Grow Your Career',
    subtitle: 'Explore opportunities tailored just for you.',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const searchJobHandler = () => {
    if (!query.trim()) return;
    navigate(`/search-results?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">

      {/* 1️⃣ Background slides */}
      <div className="absolute top-0 left-0 w-full h-full">
        <AnimatePresence initial={false}>
          {slides.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 1.2 }}
                className="absolute top-0 left-0 w-full h-full"
              >
                {/* Background image with blur and dim */}
                <div
                  className="w-full h-full bg-cover bg-center filter blur-sm brightness-75"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Optional overlay for extra dim */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* 2️⃣ Foreground content (fixed) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 gap-8 z-10 pt-[70px]">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
          {slides[currentSlide].subtitle}
        </p>

        {/* Search bar */}
        <div className="flex w-[50%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 bg-white">
          <input
            type="text"
            placeholder="Find your dream jobs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full px-4 py-2 rounded-l-full"
          />
          <Button
            onClick={searchJobHandler}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-r-full font-medium hover:from-blue-700 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Category carousel */}
        <div className="w-full flex justify-center mt-8 z-10">
            <CategoryCarousel />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
