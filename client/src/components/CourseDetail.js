import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import ReactMarkdown from 'react-markdown';


const CourseDetail = () => {
    const navigate = useNavigate(); //get the navigate object
    const { id } = useParams();
    const [courseDetail, setCourseDetail] = useState(null);
    const { authUser } = useContext(UserContext);

    //gets the specific course data from the REST API
    useEffect(() => {
        axios.get(`http://localhost:5000/api/courses/${id}`)
            .then(response => {
                setCourseDetail(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log('Error fetching course details', error);
                if (error.response && error.response.status === 500) {
                    // Redirect to the /error path for internal server errors
                    navigate('/notfound');
                } else {
                    navigate('/error');
                }
            });
        
    }, [id, navigate]);


    const handleDelete = () => {
        if (!authUser) {
            // Handle the case where the user is not authenticated
            return;
        }
    
        const { emailAddress, password } = authUser;
    
        const encodedCredentials = btoa(`${emailAddress}:${password}`);
        
        //send delete request to delete the course
        const url = `http://localhost:5000/api/courses/${id}`
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`, // You may need to adjust the authorization header
            },
        })
        .then(response => {
            if (response.status === 204) {
                navigate('/');
                //navigate to course list after successfully deleting the course                
            }
        })
            .catch(error => {
                console.log('Error deleting course', error);
                if (error.response && error.response.status === 500) {
                    // Redirect to the /error path for internal server errors
                    navigate('/error');
                } 
            });
    };

    //checks if the use is the owner of the course
    const isCourseOwner = () => {
        return authUser && courseDetail && courseDetail.User && authUser.id === courseDetail.User.id;
    };

    return (
        <div className="course-detail">
            <div className="actions--bar">
                <div className="wrap">
                    {isCourseOwner() && (
                        <NavLink className="button" to={`/courses/${id}/update`}>
                            Update Course
                        </NavLink>
                    )}
                    {isCourseOwner() && (
                        <button className="button" onClick={handleDelete}>
                            Delete Course
                        </button>
                    )}
                    <NavLink className="button button-secondary" to="/">
                        Return to List
                    </NavLink>
                </div>
            </div>
            {courseDetail && (
                <div className="course-detail-content wrap">
                    <h2>Course Detail</h2>
                    <div className="course-header">
                        <h1 className="course-title">{courseDetail.title}</h1>
                        {courseDetail.User && (
                            <p className="course-owner">By {courseDetail.User.firstName} {courseDetail.User.lastName}</p>
                        )}
                    </div>
                    <div className="course-section">
                        <h3 className="section-title">Description</h3>
                        <div className="section-content">
                            <ReactMarkdown children={courseDetail.description} />
                        </div>
                    </div>
                    <div className="course-section">
                        <h3 className="section-title">Estimated Time</h3>
                        <p className="section-content">{courseDetail.estimatedTime}</p>
                    </div>
                    <div className="course-section">
                        <h3 className="section-title">Materials Needed</h3>
                        <div className="section-content">
                            <ReactMarkdown children={courseDetail.materialsNeeded} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseDetail;