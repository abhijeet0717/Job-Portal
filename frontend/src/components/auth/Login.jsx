import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: ""
    });
    const { loading, authUser } = useSelector(store => store.auth);
    //or const loading = useSelector((store) => store.auth.loading);
    //or const authUser = useSelector((store) => store.auth.authUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const changeEventHandler = (e) => {//as we created name field so input so that we can use it in changeEventHandler to change the data
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true));//set the loading to true ( so the sumbit button will be disabled)
            const res = await axios.post("/api/v1/user/login", input, {
                headers: {//it is header send by client
                    'Content-Type': 'application/json'//as we are sending json data so used this to tell the backedn
                },
                withCredentials: true//so that the cookie can be stored in the browser (if not enable then cookie will not be stored in browser)
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));//stored the user data in redux(as backend send everything of user only password not sent)
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
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
                    <h1 className='font-bold text-xl mb-4'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input  //it is form shadcn ui <input> tag is normal input tag
                            type="email"
                            name="email"//used to tell this input field is for email so that can update accordingly
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="abhijeet@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="password"
                        />
                    </div>
                    <RadioGroup defaultValue="comfortable" className="flex items-center gap-4 my-5">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="student"
                                checked={input.role === 'student'}
                                onChange={changeEventHandler}
                            />
                            <Label htmlFor="r1">Students</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="role"
                                value="recruiter"
                                checked={input.role === 'recruiter'}
                                onChange={changeEventHandler}
                            />
                            <Label htmlFor="r2">Recruiter</Label>
                        </div>
                    </RadioGroup>
                    {
                        loading ? (//when the data is loading then show the loader
                            <Button className='w-full my-4'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />{/*loader2 is imported not default*/}
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className='w-full my-4'>Login</Button>
                        )
                    }
                    <span className='text-sm'>Don't have an account? <Link to={"/signup"} className='text-blue-500 cursor-pointer underline'>Signup</Link></span>
                </form>
            </div>
        </>
    )
}

export default Login