import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    if (searchedQuery) {
      // ✅ Case 1: searchedQuery is an array (from checkboxes)
      if (Array.isArray(searchedQuery) && searchedQuery.length > 0) {
        const normalizedQueries = searchedQuery.map((q) =>
          q.toLowerCase().replace(/\s+/g, "")
        );

        const filtered = allJobs.filter((job) => {
          const normalizedTitle = job.title?.toLowerCase().replace(/\s+/g, "");
          const normalizedDesc = job.description
            ?.toLowerCase()
            .replace(/\s+/g, "");
          const normalizedLocation = job.location
            ?.toLowerCase()
            .replace(/\s+/g, "");

          // OR logic → if job matches any of the selected filters
          return normalizedQueries.some(
            (query) =>
              normalizedTitle.includes(query) ||
              normalizedDesc.includes(query) ||
              normalizedLocation.includes(query)
          );
        });

        setFilteredJobs(filtered);
      }

      // ✅ Case 2: searchedQuery is a string (search bar / carousel)
      else if (typeof searchedQuery === "string" && searchedQuery.trim() !== "") {
        const normalizedQuery = searchedQuery.toLowerCase().replace(/\s+/g, "");

        const filtered = allJobs.filter((job) => {
          const normalizedTitle = job.title?.toLowerCase().replace(/\s+/g, "");
          const normalizedDesc = job.description
            ?.toLowerCase()
            .replace(/\s+/g, "");
          const normalizedLocation = job.location
            ?.toLowerCase()
            .replace(/\s+/g, "");

          return (
            normalizedTitle.includes(normalizedQuery) ||
            normalizedDesc.includes(normalizedQuery) ||
            normalizedLocation.includes(normalizedQuery)
          );
        });

        setFilteredJobs(filtered);
      } 
      else {
        setFilteredJobs(allJobs);
      }
    } else {
      setFilteredJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Helmet>
        <title>CareerLaunch | Jobs</title>
      </Helmet>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 my-10">
        <div className="flex gap-5">
          <div className="w-20%">
            <FilterCard />
          </div>
          {filterJobs.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
