import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';



const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    

    //gets the list of courses from the REST API
    useEffect(() => {
        // Make the API request when the component mounts
        axios.get('http://localhost:5000/api/courses')
            .then(response => {
                console.log('Axios request successful', response);
                setCourses(response.data); // Update state with fetched courses
            })
            .catch(error => {
                console.log('Error fetching and parsing courses', error);
                if (error.response && error.response.status === 500) {
                    // Redirect to the /error path for internal server errors
                    navigate('/error');
                }
            });
    }, [navigate]);

    return (
        <div className="wrap main--grid">
            {courses.map(course => (
                <NavLink to={`/courses/${course.id}`} key={course.id} className="course--module course--link">
                    <h2 className="course--label">Course</h2>
                    <h3 className="course--title">{course.title}</h3>
                </NavLink>
            ))}
                {/*Render "New Course" link if user is signed in*/}
                <NavLink to='/courses/create' className="course--module course--add--module">
                    <span className="course--add--title">
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            viewBox="0 0 13 13"
                            className="add"
                        >
                            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
                        </svg>
                        New Course
                    </span>
                </NavLink>
        </div>
    );
}

export default Courses;