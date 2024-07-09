import './components.css'
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function CreateCohort ()
{
    const [ id, setId ] = useState('');
    const [ year, setYear ] = useState(0);
    const [ degrees, setDegrees ] = useState([])
    const [ degree, setDegree ] = useState('');
    const [ success, setSuccess ] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/api/degree/`)
            .then(response=>response.json())
            .then(data=>{
                const filteredData = data.filter(degree => degree.full_name !== 'string')
                setDegrees(filteredData)
            })
            .catch(err=>console.log(err))
    }, [])

    const submit = async (event) => {
        event.preventDefault();

        try
        {
            const response = await fetch(`http://localhost:8000/api/cohort/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    year: year,
                    degree: `http://127.0.0.1:8000/api/degree/${degree}/`,
                }),
            });

            if (response.ok) 
            {
                // set success message and clear data fields to be used again
                setSuccess('Cohort Created');
                setId('');
                setYear(0);
                setDegree('');
            }
        }
        catch (error)
        {
            console.error('Error: ', error);
            setSuccess('An error occured creating the cohort');
        }
    };
    

    return (
        <div>
            <div className='Create-Title'>
                <h1>Create A Cohort Below</h1>
            </div>

            <div className='Create-Form'>
                <Form onSubmit={submit}>
                    <Form.Group controlId='id' className='Form-Group'>
                        <Form.Label className='Form-Label'>Cohort ID:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='year' className='Form-Group'>
                        <Form.Label className='Form-Label'>Year Number:</Form.Label>
                        <Form.Control 
                            type="number" // integer input
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))} // parse to int
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='degree' className='Form-Group'>
                        <Form.Label className='Form-Label'>Degree:</Form.Label>
                        <Form.Select
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            required
                        >
                            <option value="">Select Degree</option>
                            {degrees.map(degree => (
                                <option key={degree.shortcode} value={degree.shortcode}>
                                    {degree.shortcode}
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
        </div>
    )
}

export default CreateCohort;