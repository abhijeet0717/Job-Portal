import { setAdminJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get('/api/v1/job/getadminjobs');
                if(res.data.success){ 
                    dispatch(setAdminJobs(res.data.jobs));//stored admin jobs in redux
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAdminJobs();
    }, []);
}
export default useGetAllAdminJobs;

//can also write it as ( without creating async function, instead we use .then of axios)

//import { setAdminJobs } from "@/redux/jobSlice";
// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// const useGetAllAdminJobs = () => {
//     const dispatch = useDispatch();
    
//     useEffect(() => {
//         axios.defaults.withCredentials = true;
//         axios.get('/api/v1/job/getadminjobs')
//             .then(res => {
//                 if(res.data.success){
//                     dispatch(setAdminJobs(res.data.jobs));
//                 }
//             })
//             .catch(error => console.log(error));
//     }, []);
// }

// export default useGetAllAdminJobs;