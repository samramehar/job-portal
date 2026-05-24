import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Data Scientist",
    "Full Stack Developer",
    "Devops Engineer"
];

const CategoryCarousel = () => {
    const navigate = useNavigate();

    const searchJobHandler = (cat) => {
        navigate(`/search-results?query=${encodeURIComponent(cat)}`);
    };

    return (
        <motion.div>
            <Carousel className="w-full max-w-xl mx-auto my-5 bg-transparent">
                <CarouselContent>
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <Button
                                onClick={() => searchJobHandler(cat)}
                                variant="outline"
                                className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </motion.div>
    );
};

export default CategoryCarousel;
