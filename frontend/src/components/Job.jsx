import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { updateSavedJobs } from "@/redux/authSlice"; // import the new action

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [isSaved, setIsSaved] = useState(false);

  // Check if job is already saved for this user
  useEffect(() => {
    if (user?.savedJobs) {
      setIsSaved(user.savedJobs.includes(job._id));
    }
  }, [user, job._id]);

  const toggleSaveJob = async () => {
    if (!user) {
      toast.error("Please login to save jobs.");
      return;
    }

    try {
      let res;
      let updatedSavedJobs;

      if (isSaved) {
        // Remove saved job
        res = await axios.delete(`${USER_API_END_POINT}/save-job/${job._id}`, {
          withCredentials: true,
        });
        toast.success("Removed from saved jobs");

        updatedSavedJobs = user.savedJobs.filter(id => id !== job._id);
      } else {
        // Save job
        res = await axios.post(`${USER_API_END_POINT}/save-job/${job._id}`, {}, {
          withCredentials: true,
        });
        toast.success("Job saved successfully");

        updatedSavedJobs = [...(user.savedJobs || []), job._id];
      }

      // Update Redux state so it persists globally
      dispatch(updateSavedJobs(updatedSavedJobs));

      // Update local state
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
      toast.error(isSaved ? "Failed to remove job" : "Failed to save job");
    }
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 relative">
      {/* Bookmark Button */}
      {user?.role === "student" && (
        <button
          onClick={toggleSaveJob}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Bookmark
            className={`w-5 h-5 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`}
          />
        </button>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">Pakistan</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
