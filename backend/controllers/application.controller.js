import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const { id: jobId } = req.params;//or const jobId = req.params.id;

        if (!jobId) return res.status(400).json({ message: "Job Id required", success: false });

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });//used findOne as it will return only one application(we can apply for only one job at a SAME COMPANY)
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);//added the application id to the job database ( aS applications is an array of application id's so push operation is used)
        //as we store the application id in the job database so that we can get the details of the applicant who applied for the job

        await job.save();

        return res.status(201).json({
            message: "Job Applied successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to apply for the job.',
            success: false
        });
    }
};
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path:"job",//all the job details are populated
            options:{sort:{createdAt:-1}},
            populate:{//inside the job details(we get this by populate) we have company (we want to get the company details) --> so used populate again
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        });
        if (!application) return res.status(404).json({ message: "No Application", success: false });
        

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        return res.status(400).json({ message: "Failed to get applied jobs" });
    }
}

//used by admin to see the number of applicants for a particular job
export const getApplicants = async (req, res) => {
    try {
        const { id } = req.params;//or const id = req.params.id; {id } means {id:id}
        const job = await Job.findById(id).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant"// so that can get the details of the applicant who applied for the job
            }
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        }  
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Failed to get job applicants"
        })
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicantionId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }

        // Find the application by applicant ID
        const application = await Application.findOne({ _id: applicantionId});

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }
      
        // Update the status
        application.status = status.toLowerCase();
        await application.save();//use save when we update the data in the database

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to update status",
            success: false
        });
    }
};
