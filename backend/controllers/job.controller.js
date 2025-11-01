import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        //requirements is a string given by user to frontend in comma separated way and we need to convert it into array when storing in the database
        //example : api,react,node

        const userId = req.id;//by isAuthenicated middlware

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),//split the string by comma and store in array
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Failed to creating a new job." ,success:false});
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";// ?keyword=developer in the url
        //query mean ? in the url and we write query.keyword as in te url it is ?keyword=developer 
        
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };
        //$or: This is a logical operator in MongoDB that allows you to specify multiple conditions. 
        //Documents that satisfy at least one of these conditions will be returned.
        //i means case-insensitive

        const jobs = await Job.find(query).populate({ path: "company" }).sort({createdAt:-1});
        //const jobs = await Job.find(query) it will return the company id not the company details as in company field we have only company id
        //to get the compnay details we use populate({path:"company"})
        //we get all the details of the company (present in company database --> name,description,website,location,logo) 
        //-1 means descending order
        if (!jobs) return res.status(404).json({ message: "Jobs are not found!", success: false });

        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        return res.status(400).json({ message: "Failed to get jobs" });
    }
}
export const getJobById = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications",
        });
        if(!job) return res.status(404).json({
            message:"Job not found.",
            success:false
        }) 
        return res.status(200).json({success:true, job});
    } catch (error) {
        return res.status(400).json({message:"Failed to get job"});
    }
}

// admin
export const getJobByLoggedAdminUser = async (req, res) => {
    try {
        const userId = req.id;
        const jobs = await Job.find({ created_by: userId }).populate({path:'company', createdAt:-1});
        if (!jobs) return res.status(404).json({ message: "Jobs are not found", success: false });
        
        return res.status(200).json({
            jobs,
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error });
    }
}
