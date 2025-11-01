import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;//use req.body to get the data from frontend
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });//send the response to frontend
        }//as success is false, frontend will show the error message to the user which we pass
        const file = req.file; //to get file form the req object use req.file(which)
        if(!file)
        {
            return res.status(400).json({ message: "Profile photo is required", success: false });
        }
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exist with this email", success: false });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) return res.status(400).json({ message: "All fields are required", success: false });
        let user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Incorrect email or password" ,success: false});
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: "Incorrect email or password" ,success: false});

        // check role is correct or not (stduent or recruiter)
        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role" })
        }
        const tokenData = {
            userId: user._id,//_id is the unique id for each database entry created by mongodb
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });//genrate token using jwt
//  {
//     "userId": "679d055877f896c048946dc5",
//     "iat": 1738343785,
//     "exp": 1738430185
//   }
        //this is how token looks like after decoding(it is the payload of the token)
        
        //token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzlkMDU1ODc3Zjg5NmMwNDg5NDZkYzUiLCJpYXQiOjE3MzgzNDM3ODUsImV4cCI6MTczODQzMDE4NX0.3sP35l3w6nyrq-PpiB9ypGyMWz1Cs_biDjcxHQ30EXw

        //as we know we can see the payload of token without decoding it so we should not store sensitive data in the token
        //to see the data we can use jwt.io and paste the token value there(we can get token value by developer tools->application->cookies)
        //But when we try to modify the cookie value, to another value ( so that we hack into another account by changing the token value with another userId)
        //then it will give error , we cannot decode it our side , as the private key is different(the new created cookie will have other key)
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        //maxage is the time for which the cookie will be stored in the browser( it is in milliseconds)
        //for security reasons we use httpOnly and sameSite
        //.cookie(keu,value,{options})
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        //cleared the cookie by passing "" in the cookie value and maxAge as 0
        //or can use clearCookie("token",options) as done in chaiaurcode   
        //const options = {
        //     httpOnly: true,
        //     secure: true,
        //   };
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        if (!fullname || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const skillsArray = skills.split(",");
        const userId = req.id; //  req.id contains the user's ID which come from isAuthenticated middleware

        let user = await User.findById(userId);
        //can also use findByIdandUpdate as done studied in chaiaurcode
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        // Updating the profile( only the thingns which we recievewd to update)
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Update the resume URL and original file name
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save the original file name
        }

        await user.save();//save the updated user data

        // Prepare the user data to send in the response 
        //remove the password from the user object  before sending it to the frontend
        //can be done by use select("-password") as done in chaiaurcode
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};