import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Helmet } from "react-helmet-async";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

const AdminCompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

  const fetchCompany = async () => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCompany(res.data.company);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load company details");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Company deleted successfully");
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete company");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  if (!company)
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading company details...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-10">
      <Helmet>
        <title>Admin | Company Details</title>
      </Helmet>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-16 h-16">
            <AvatarImage src={company.logo} alt={company.name} />
          </Avatar>
          <h1 className="text-2xl font-bold">{company.name}</h1>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate(`/admin/companies/${id}/edit`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Edit
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-sm hover:shadow-md">
                Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-white shadow-lg rounded-xl border border-gray-200">
              <p className="text-center font-medium text-gray-700 mb-3">
                 Are you sure you want to delete this company?
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
          <strong>Email:</strong> {company.email}
        </p>
        <p>
          <strong>Description:</strong> {company.description}
        </p>
        <p>
          <strong>Website:</strong> {company.website}
        </p>
        <p>
          <strong>Founded:</strong> {company.createdAt.split("T")[0]}
        </p>
      </div>
    </div>
  );
};

export default AdminCompanyDetails;
