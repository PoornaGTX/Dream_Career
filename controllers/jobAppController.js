import JobApp from "../models/JobApplication.js";
import mongoose from "mongoose";
import moment from "moment";

const applyJob = async (req, res) => {
  const {
    position,
    education,
    location,
    experience,
    jobType,
    editJobCreateID,
    company,
    email,
    name,
  } = req.body;
  if (
    !position ||
    !education ||
    !location ||
    !experience ||
    !jobType ||
    !editJobCreateID ||
    !company ||
    !email ||
    !name
  ) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  const jobApplication = {
    appliedBy: req.user.userId,
    recruiterID: editJobCreateID,
    experience,
    jobType,
    education,
    position,
    location,
    company,
    email,
    name,
  };
  const jobApp = await JobApp.create(jobApplication);
  res.status(201).json({ jobApp });
};

const getAllAppliedJobs = async (req, res) => {
  const { search, jobType, sort } = req.query;
  const queryObject = {};
  if (jobType !== "all") {
    queryObject.jobType = jobType;
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
  const AppliedJobs = await result;
  //Response
  res.status(201).json({
    AppliedJobs,
    AppliedTotalJobs: AppliedJobs.length,
    AppliedJobsNumOfPages: 1,
  });
};

const deleteAppJob = async (req, res) => {
  const { id: jobAppId } = req.params;

  const deJobApp = await JobApp.findOne({ _id: jobAppId });

  if (!deJobApp) {
    return res.status(400).json({ error: `No job with id : ${jobAppId}` });
  }

  await deJobApp.remove();
  res.status(200).json({ msg: "Success! Job removed" });
};

const updateJobApp = async (req, res) => {
  const { id: jobId } = req.params;

  const { education } = req.body;

  if (!education) {
    return res.status(400).json({ error: "Please provide all values" });
  }

  const job = await JobApp.findOne({ _id: jobId });

  if (!job) {
    return res.status(400).json({ error: `No job with id ${jobId}` });
  }

  // check permissions

  const updatedJob = await JobApp.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ updatedJob });
};

const showStats = async (req, res) => {
  let stats = await JobApp.aggregate([
    { $match: { appliedBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobType", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  let monthlyApplications = await JobApp.aggregate([
    { $match: { appliedBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
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
      // accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(200).json({ stats, monthlyApplications });
};
export { applyJob, getAllAppliedJobs, showStats, deleteAppJob, updateJobApp };
