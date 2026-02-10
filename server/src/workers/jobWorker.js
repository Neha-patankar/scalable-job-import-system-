import { Worker } from "bullmq";
import Job from "../models/Job.js";
import ImportLog from "../models/ImportLog.js";
import { redis } from "../config/redis.js";

new Worker(
  "job-import-queue",
  async (job) => {
    console.log("🚀 Worker started processing job:", job.id);

    const { jobs, sourceUrl } = job.data;

    let newJobs = 0;
    let updatedJobs = 0;
    let failedJobs = [];

    for (const j of jobs) {
      try {
        const existingJob = await Job.findOne({ jobId: j.id });

        if (existingJob) {
          await Job.updateOne({ jobId: j.id }, { $set: j });
          updatedJobs++;
        } else {
          await Job.create({ ...j, jobId: j.id });
          newJobs++;
        }
      } catch (err) {
        console.error("❌ Job failed:", j.id, err.message);
        failedJobs.push({ jobId: j.id, reason: err.message });
      }
    }

    const log = await ImportLog.create({
      fileName: sourceUrl,
      totalFetched: jobs.length,
      totalImported: newJobs + updatedJobs,
      newJobs,
      updatedJobs,
      failedJobs,
    });

    console.log("✅ Import log saved:", log._id);
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
