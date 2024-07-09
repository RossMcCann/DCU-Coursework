import './components.css'
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CreateStudent ()
{
    const [ sid, setSid ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ cohorts, setCohorts ] = useState([])
    const [ cohort, setCohort ] = useState('');
    const [ success, setSuccess ] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/api/cohort/`)
            .then(response=>response.json())
            .then(data=>{
                const filteredData = data.filter(cohort => cohort.id !== '3')
                setCohorts(filteredData)
            })
            .catch(err=>console.log(err))
    })

    const submit = async (event) => {
        event.preventDefault();

        try
        {
            const response = await fetch(`http://localhost:8000/api/student/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: sid,
                    first_name: firstName,
                    last_name: lastName,
                    cohort: `http://localhost:8000/api/cohort/${cohort}/`,
                }),
            });

            if (response.ok) 
            {
                // set success message and clear data fields to be used again
                setSuccess('Student Created');
                setSid('');
                setFirstName('');
                setLastName('');
                setCohort('');
            }
        }
        catch (error)
        {
            console.error('Error: ', error);
            setSuccess('An error occured creating the student');
        }
    };
    
    return (
        <div>
            <div className='Create-Title'>
                <h1>Create A Student Below</h1>
            </div>

            <div className='Create-Form'>
                <Form onSubmit={submit}>
                    <Form.Group controlId='sid' className='Form-Group'>
                        <Form.Label className='Form-Label'>Student ID:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={sid}
                            onChange={(e) => setSid(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='firstName' className='Form-Group'>
                        <Form.Label className='Form-Label'>First Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='lastName' className='Form-Group'>
                        <Form.Label className='Form-Label'>Last Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='cohort' className='Form-Group'>
                        <Form.Label className='Form-Label'>Student Cohort:</Form.Label>
                        <Form.Select
                            type="text"
                            value={cohort}
                            onChange={(e) => setCohort(e.target.value)}
                            required
                        >
                            <option value="">Select Cohort</option>
                            {cohorts.map(cohort => (
                                <option key={cohort.id}>
                                    {cohort.id}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" className='Form-Button'>
                        Submit
                    </Button>
                </Form>
            </div>
            {success && <Alert variant="success" className='Success-Alert'>{success}</Alert>}

            <div className='Form-Link'>
                    <Link as={Link} to={`/students/grades`} className='Form-Link-Text'>
                        <h3>Click Here to Create A Students Grade</h3>
                    </Link>
            </div>
        </div>
    )
}

export default CreateStudent;