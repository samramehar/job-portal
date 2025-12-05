import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

const AdminJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setJob(res.data.job);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load job details");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Job deleted successfully");
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete job");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (!job)
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading job details...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-10">
      <Helmet>
        <title>Admin | Job Details</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(`/admin/jobs/${id}/edit`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Edit
          </Button>
          <Button
            onClick={() => navigate(`/admin/jobs/${id}/applicants`)}
            className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View Applicants
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-sm hover:shadow-md">
                Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-white shadow-lg rounded-xl border border-gray-200">
              <p className="text-center font-medium text-gray-700 mb-3">
                 Are you sure you want to delete this job?
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                >
                  Yes, Delete
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <p>
          <strong>Company:</strong> {job.company?.name}
        </p>
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Salary:</strong> {job.salary} LPA
        </p>
        <p>
          <strong>Experience:</strong> {job.experienceLevel} years
        </p>
        <p>
          <strong>Description:</strong> {job.description}
        </p>
        <p>
          <strong>Applicants:</strong> {job.applications?.length}
        </p>
        <p>
          <strong>Posted on:</strong> {job.createdAt.split("T")[0]}
        </p>
      </div>
    </div>
  );
};

export default AdminJobDetails;
