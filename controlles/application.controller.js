import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
export const applyJob = async (req, res) => {
   try {
      const userId = req.id;
      const jobId = req.params.id;

      console.log(`Applying for job ID: ${jobId} by user ID: ${userId}`);

      if (!jobId) {
         return res.status(400).json({
            message: "Invalid job ID",
            success: false,
         });
      }

      if (!userId) {
         return res.status(400).json({
            message: "User not authenticated",
            success: false,
         });
      }

      const existingApplication = await Application.findOne({
         job: jobId,
         applicant: userId,
      });

      if (existingApplication) {
         return res.status(400).json({
            message: "You already applied for this job",
            success: false,
         });
      }

      const job = await Job.findById(jobId);
      if (!job) {
         return res.status(404).json({
            message: "Job not found",
            success: false,
         });
      }

      // Create a new application
      const newApplication = await Application.create({
         job: jobId,
         applicant: userId,
         // status: "Applied" // If you have a status field
      });

      job.applications.push(newApplication._id);
      await job.save();

      res.status(200).json({
         message: "Job applied successfully",
         success: true,
         application: newApplication,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

// Get all applied jobs for a user
export const getAppliedJobs = async (req, res) => {
   try {
      const userId = req.id;

      console.log(`Fetching applications for user ID: ${userId}`);

      if (!userId) {
         return res.status(400).json({
            message: "User not authenticated",
            success: false,
         });
      }

      const applications = await Application.find({ applicant: userId })
         .sort({ createdAt: -1 })
         .populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
               path: "company",
               options: { sort: { createdAt: -1 } },
            },
         });

      if (!applications.length) {
         return res.status(404).json({
            message: "No applications found",
            success: false,
         });
      }

      res.status(200).json({
         message: "Applications fetched successfully",
         success: true,
         applications,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

// Get applicants for a job
export const getApplicants = async (req, res) => {
   try {
      const jobId = req.params.id;

      console.log(`Fetching applicants for job ID: ${jobId}`);

      const job = await Job.findById(jobId).populate({
         path: 'applications',
         options: { sort: { createdAt: -1 } },
         populate: {
            path: 'applicant'
         },
      });

      if (!job) {
         return res.status(404).json({
            message: 'Job not found',
            success: false,
         });
      }

      res.status(200).json({
         message: 'Applicants fetched successfully',
         job,
         success: true,
         applicants: job.applications,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

// Update application status
export const updateStatus = async (req, res) => {
   try {
      const { status } = req.body;
      const applicationId = req.params.id;

      console.log(`Updating status for application ID: ${applicationId} to ${status}`);

      if (!status) {
         return res.status(400).json({
            message: 'Status is required',
            success: false,
         });
      }

      const application = await Application.findById(applicationId);
      if (!application) {
         return res.status(404).json({
            message: 'Application not found',
            success: false,
         });
      }

      // Update status
      application.status = status.toLowerCase();
      await application.save();

      res.status(200).json({
         message: 'Application status updated successfully',
         application,
         success: true,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};
