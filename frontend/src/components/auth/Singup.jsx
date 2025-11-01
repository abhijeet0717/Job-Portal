//all thte capital letter tag <Comonenet> are imported
//html tag are small letter tag <component> ex <input>


import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup, } from '../ui/radio-group'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Singup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const { loading, authUser } = useSelector(store => store.auth);//as it is in auth slice so used store.auth (auth: authSlice,)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {//it will keep all the previous value(...input) and update the new value([e.target.name]: e.target.value)
    setInput({ ...input, [e.target.name]: e.target.value });//due to [] it will take the value of name attribute of input field
    //as [variable]  will five  the value of variable 
    //as studied in js objects 
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  }

  const submitHandler = async (e) => {
    e.preventDefault();//to prevent the default behaviour of form submission
    const formData = new FormData();//as want to send image also so used formdata to send data
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    } 
    try {
      dispatch(setLoading(true));
      const res = await axios.post("/api/v1/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
          //"Content-Type": "multipart/form-data": Indicates that the request body contains form data that includes files. 
          //This is necessary when uploading files to the server.

          //but now day axios automatically set the content type to multipart/form-data when we send the file in the form data in the headers
        },
        withCredentials: true
        //withCredentials: true: This setting allows the request to include credentials (such as cookies) in cross-origin requests. 
        //This is important for maintaining sessions and handling authentication when the client and server are on different domains.
      });
      //In the context of your code, setting withCredentials: true ensures that any cookies (such as session cookies) are sent along with the request to the /api/v1/user/register endpoint. 
      //This is often necessary for endpoints that require authentication or need to maintain a session.
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);//added the <Toaster /> in main.jsx to show the toast messages
      }
    } catch (error) {//catch run when api status code is not in the range of 200 , then axios will throw an error
      //if success is false in api response then error will not be thrown by axios
      //it thrown due to status code not in the range of 200 by axios
      //so use the chaiaurcode method to  throw new ApiErorr way of writting the backend code
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
  useEffect(() => {
    if (authUser?.role === 'recruiter') {
      navigate("/admin/companies");
    } else if (authUser?.role === 'student') {
      navigate("/");
    }
  }, [])
  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
          <h1 className='font-bold text-xl mb-4'>Sign Up</h1>
          <div className='my-2'>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}//give the refrence of the function  as our changeEventHandler can differntiate between the input fields due to name attribute
              // is name field not then have to updapte it here as (e)=>(setInput({...input,fullname:e.target.value}))
              placeholder="Abhijeet"
            />
          </div>
          <div className='my-2'>
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="abhijeet@gmail.com"
            />
          </div>
          <div className='my-2'>
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="+918080808080"
            />
          </div>
          <div className='my-2'>
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="password"
            />
          </div>
          <div className='flex items-center justify-between'>
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input  //used input instead of radiogroupitem as that can easily get the value
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === 'student'}//checked will be true if input.role is student (if checked is true then radio button will be checked)
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Students</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === 'recruiter'}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className='flex items-center gap-2'>
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file" //type file is used to upload the file
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>
          {
            loading ? (
              <Button className='w-full my-4'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit' className='w-full my-4'>Sign Up</Button>// type='submit' is used to submit the form
            )
          }
          <span className='text-sm'>Already have an account? <Link to={"/login"} className='text-blue-500 cursor-pointer underline'>Login</Link></span>
        </form>
      </div>
    </>
  )
}

export default Singup