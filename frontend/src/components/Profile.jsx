import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { Helmet } from "react-helmet-async";
import AdminJobsTable from "./admin/AdminJobsTable";
import ApplicantsTable from "./admin/ApplicantsTable";
import CompaniesTable from "./admin/CompaniesTable";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  if (!user) return null;

  return (
    <div>
      <Navbar />

      {/* Profile Header (common) */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              {user?.role === "student" && (
                <p className="text-gray-700">{user?.profile?.bio}</p>
              )}
              {user?.role === "recruiter" && (
                <p className="text-gray-600">
                  {user?.profile?.position || "Recruiter"}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>

        {/* Common Info */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber || "NA"}</span>
          </div>
        </div>

        {/* Student Extra Info */}
        {user.role === "student" && (
          <>
            <div className="my-5">
              <h1 className="font-semibold text-lg">Skills</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((item, index) => (
                    <Badge key={index}>{item}</Badge>
                  ))
                ) : (
                  <span>NA</span>
                )}
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="text-md font-bold">Resume</Label>
              {user?.profile?.resume ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={user.profile.resume}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  {user.profile.resumeOriginalName}
                </a>
              ) : (
                <span>NA</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Student Section: Applied Jobs */}
      {user.role === "student" && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl">
          <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
          <AppliedJobTable />
        </div>
      )}

      {/* Recruiter Section: Companies, Jobs & Applicants */}
      {user.role === "recruiter" && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl mb-40">
          <h1 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg my-5">
            Companies
          </h1>
          <CompaniesTable />

          <h1 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg my-5">
            Posted Jobs
          </h1>
          <AdminJobsTable />

          <h1 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg my-5">
            Applicants
          </h1>
          <ApplicantsTable />
        </div>
      )}

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
