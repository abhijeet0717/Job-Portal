import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

//wrap all the admin components in this component to protect them from unauthorized access
//inside componenet will be pass as children to this component
const ProtectedRoute = ({ children }) => {
    const { authUser } = useSelector(store => store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (authUser === null || authUser?.role !== 'recruiter') {
            navigate("/");
        }
    }, [])
    return (
        <>{children}</>
    )
}

export default ProtectedRoute