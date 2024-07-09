import './components.css'
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function CreateDegree ()
{
    const [ fullName, setFullName ] = useState('');
    const [ shortCode, setShortCode ] = useState('');
    const [ success, setSuccess ] = useState('');

    const submit = async (event) => {
        event.preventDefault();

        try
        {
            const response = await fetch(`http://localhost:8000/api/degree/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: fullName,
                    shortcode: shortCode,
                }),
            });

            if (response.ok) 
            {
                // set success message and clear data fields to be used again
                setSuccess('Degree Created');
                setFullName('');
                setShortCode('');
            }
        }
        catch (error)
        {
            console.error('Error: ', error);
            setSuccess('An error occured creating the degree');
        }
    };

    const capitaliseShortCode = (e) => {
        setShortCode(e.target.value.toUpperCase());
    };
    

    return (
        <div>
            <div className='Create-Title'>
                <h1>Create A Degree Below</h1>
            </div>

            <div className='Create-Form'>
                <Form onSubmit={submit}>
                    <Form.Group controlId='fullName' className='Form-Group'>
                        <Form.Label className='Form-Label'>Full Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='shortCode' className='Form-Group'>
                        <Form.Label className='Form-Label'>Short Code:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={shortCode}
                            onChange={capitaliseShortCode}
                            required
                        />
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

export default CreateDegree;