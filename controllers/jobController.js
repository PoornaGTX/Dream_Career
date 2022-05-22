import Job from "../models/Job.js";
import JobApp from "../models/JobApplication.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(201).json({ job });
};

const getAllJobs = async (req, res) => {
  const { jobType, sort, search } = req.query;

  const queryObject = {
    // createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  // NO AWAIT

  let result = Job.find(queryObject);

  // chain sort conditions

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);

  res.status(200).json({ jobs, totalJobs });
};

const getAllJobRequests = async (req, res) => {
  const { search, Status, sort } = req.query;

  const queryObject = {
    recruiterID: req.user.userId,
  };
  if (Status !== "pending") {
    queryObject.Status = Status;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  //No AWAIT
  let result = JobApp.find(queryObject);
  //chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }
  const JobRequests = await result;
  //Response
  res.status(200).json({
    JobRequests,
    JobRequestsCount: JobRequests.length,
    JobRequestsNumOfPages: 1,
  });
};

const respondToJobReq = async (req, res) => {
  const { id: jobId } = req.params;
  const { Status } = req.body;

  if (!Status) {
    return res.status(400).json({ error: "Please provide all values" });
  }
  const job = await JobApp.findOne({ _id: jobId });

  if (!job) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  const updatedJob = await JobApp.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ updatedJob });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    return res.status(400).json({ error: "Please provide all values" });
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    return res.status(400).json({ error: `No job with id :${jobId}` });
  }

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    return res.status(400).json({ error: `No job with id :${jobId}` });
  }

  await job.remove();

  res.status(200).json({ msg: "Success! Job removed" });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobType", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    remote: stats.remote || 0,
    internship: stats.internship || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(200).json({ defaultStats, monthlyApplications });
};

export {
  createJob,
  getAllJobs,
  getAllJobRequests,
  showStats,
  updateJob,
  deleteJob,
  respondToJobReq,
};
