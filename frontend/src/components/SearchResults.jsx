import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Job from "./Job";
import { Helmet } from "react-helmet-async";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";

  const { allJobs } = useSelector((state) => state.job);

  const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
  const filteredJobs = allJobs.filter((job) =>
    job.title.toLowerCase().replace(/\s+/g, "").includes(normalizedQuery)
  );

  return (
    <div className="p-5">
      <Helmet>
        <title>
          {query ? `CareerLaunch | ${query}` : "CareerLaunch | Searched Job"}
        </title>
      </Helmet>

      <h2 className="text-2xl font-bold mb-5">
        {query ? `Search results for "${query}"` : "Search Results"}
      </h2>
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <p>No jobs found for "{query}"</p>
      )}
    </div>
  );
};
export default SearchResults;
