import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Mail, Contact } from 'lucide-react';
import { Badge } from '../ui/badge';
import Navbar from '../shared/Navbar';

const ApplicantProfile = () => {
  const { id } = useParams(); // applicant USER id
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const applicationId = queryParams.get('applicationId'); // get application ID from URL

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setApplicant(res.data.user);
        } else {
          toast.error("Applicant not found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch applicant");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, [id]);

  // Status update function
  const statusHandler = async (status) => {
    if (!applicationId) return toast.error("Application ID not found");

    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        // update local state to reflect new status
        setApplicant(prev => ({ ...prev, status }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!applicant) return <div className="text-center mt-10">No applicant data found</div>;

  return (
    <div>
      <div className="mb-24">
        <Navbar />
      </div>

      <Helmet>
        <title>CareerLaunch | {applicant.fullname}</title>
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={applicant.profile?.profilePhoto} alt="profile" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{applicant.fullname}</h1>
              <p className="text-gray-700">{applicant.profile?.bio || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{applicant.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{applicant.phoneNumber || "N/A"}</span>
          </div>
        </div>

        {/* Skills & Resume */}
        <div className="my-5">
          <h1 className="font-semibold text-lg">Skills</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {applicant.profile?.skills?.length > 0 ? (
              applicant.profile.skills.map((skill, idx) => <Badge key={idx}>{skill}</Badge>)
            ) : (
              <span>NA</span>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <span className="font-bold text-md">Resume</span>
            {applicant.profile?.resume ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={applicant.profile.resume}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {applicant.profile.resumeOriginalName || 'View Resume'}
              </a>
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        {/* Current Status */}
        {applicant.status && (
          <div className="mt-3">
            <span className="font-semibold">Current Status: </span>
            <Badge
              variant={applicant.status === "Accepted" ? "success" : "destructive"}
            >
              {applicant.status}
            </Badge>
          </div>
        )}

        {/* Accept / Reject Buttons */}
        <div className="flex gap-4 mt-5">
          <Button
            onClick={() => statusHandler("Accepted")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Accept
          </Button>

          <Button
            onClick={() => statusHandler("Rejected")}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
