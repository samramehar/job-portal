import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { motion } from "framer-motion";
import Job from "./Job";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

const SavedJobs = () => {
  const { user } = useSelector((store) => store.auth);
  const [savedJobs, setSavedJobs] = useState([]);

  // Fetch saved jobs whenever user or their savedJobs list changes
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return;

      try {
        // Get all saved jobs from backend
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });

        if (res.data && res.data.success && Array.isArray(res.data.jobs)) {
          setSavedJobs(res.data.jobs);
        } else {
          setSavedJobs([]);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch saved jobs."
        );
      }
    };

    fetchSavedJobs();
  }, [user?.savedJobs]); // <- listen to changes in user's savedJobs

  return (
    <div>
      <Helmet>
        <title>CareerLaunch | Saved Jobs</title>
      </Helmet>

      <div className="mb-24">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Saved Jobs ({savedJobs.length})
        </h1>

        {savedJobs.length === 0 ? (
          <p className="text-gray-600">You haven't saved any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Job job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
