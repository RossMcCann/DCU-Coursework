import './components.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

function SingleCohort ()
{
    const { id } = useParams();
    const [singleCohort, setSingleCohort] = useState(null);
    const [students, setStudents] = useState([])

    useEffect(() =>{
        fetch(`http://127.0.0.1:8000/api/cohort/${id}/`)
            .then(response=>response.json())
            .then(data=>{
                setSingleCohort(data);
            })
            .catch(err=>console.log(err))

        fetch(`http://127.0.0.1:8000/api/student/?cohort=${id}`)
            .then(response=>response.json())
            .then(data=>{
                setStudents(data);
            })
            .catch(err=>console.log(err));
    }, [id])

    if (!singleCohort)
    {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='Single-Cohort-Title'>
                <h1>{singleCohort.id} - {singleCohort.name}</h1>
            </div>
            <div className='Single-Cohort-Subtitle'>
                <h3>View All Students In {singleCohort.id} Below</h3>
            </div>

            <div className="Single-Cohort-Student-List">
                {students.map(student=> (
                    <Link to={`http://localhost:3000/students/${student.student_id}`} key={student.student_id} className='Single-Cohort-Student-Link'>
                        <ListGroup as="ul" className="Single-Cohort-Student-List-Item">
                            <ListGroup.Item>{student.first_name} {student.last_name} - {student.email}</ListGroup.Item>
                        </ListGroup>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SingleCohort;