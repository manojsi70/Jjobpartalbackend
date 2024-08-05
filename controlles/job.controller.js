import { Job } from "../models/job.model.js";

// Admin: Post a job
export const post = async (req, res) => {
   try {
      const {
         title,
         description,
         jobType,
         requirements,
         salary,
         location,
         exprence,
         position,
         companyId,
      } = req.body;
      const userId = req.userId; // Ensure this is set by your middleware

      if (
         !title ||
         !description ||
         !requirements ||
         !salary ||
         !location ||
         !exprence ||
         !position ||
         !companyId ||
         !jobType
      ) {
         return res.status(400).json({
            message: "Something is missing or required fields are empty",
            success: false,
         });
      }

      const job = await Job.create({
         title,
         description,
         requirements: requirements.split(","),
         salary: Number(salary.toString()),
         location,
         exprence,
         position,
         jobType,
         created_by: userId,
         companyId, // Include companyId if needed
         applications: [],
      });

      return res.status(201).json({
         message: "Job posted successfully",
         success: true,
         job,
      });
   } catch (error) {
      console.error(error.message);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

// Student: Get all jobs
export const getAllJobs = async (req, res) => {
   try {
      const keyWord = req.query.keyword || ""; // Fixed typo in query key
      const query = {
         $or: [
            { title: { $regex: keyWord, $options: "i" } },
            { description: { $regex: keyWord, $options: "i" } },
         ],
      };

      const jobs = await Job.find(query).populate({
        path:"company"
      }).sort({createdAt:-1});

      if (jobs.length === 0) {
         return res.status(404).json({
            message: "No jobs found",
            success: false,
         });
      }

      return res.status(200).json({
         jobs,
         success: true,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
   }
};

// Get job by ID
export const getJobById = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
         return res.status(404).json({
            message: "Job not found",
            success: false,
         });
      }

      return res.status(200).json({
         job,
         success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
         message: "Server error",
         success: false,
      });
    }
}

// Admin: Get all posted jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.userId; // Ensure this is set by your middleware
        const jobs = await Job.find({ created_by: adminId });

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found",
                success: false,
            });
        }

        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}
