import './components.css'
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function CreateModule ()
{
    const [ code, setCode ] = useState('');
    const [ fullName, setFullName ] = useState('');
    const [ cohorts, setCohorts ] = useState([]);
    const [ selectedCohorts, setSelectedCohorts ] = useState([]);
    const [ caSplit, setCaSplit ] = useState(0);
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
            const response = await fetch(`http://localhost:8000/api/module/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    full_name: fullName,
                    delivered_to: selectedCohorts,
                    ca_split: caSplit,
                }),
            });

            if (response.ok) 
            {
                // set success message and clear data fields to be used again
                setSuccess('Module Created');
                setCode('');
                setFullName('');
                setSelectedCohorts([]);
                setCaSplit(0);
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
                <h1>Create A Module Below</h1>
            </div>

            <div className='Create-Form'>
                <Form onSubmit={submit}>
                    <Form.Group controlId='code' className='Form-Group'>
                        <Form.Label className='Form-Label'>Module Code:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='fullName' className='Form-Group'>
                        <Form.Label className='Form-Label'>Full Name:</Form.Label>
                        <Form.Control 
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='cohorts' className='Form-Group'>
                        <Form.Label className='Form-Label'>Delivered To:</Form.Label>
                        {cohorts.map(cohort => (
                        <Form.Check
                            key={cohort.id}
                            type="checkbox"
                            label={cohort.id}
                            onChange={(e) => {
                                const url = `http://localhost:8000/api/cohort/${cohort.id}/`;
                                if (e.target.checked)
                                {
                                    setSelectedCohorts(prevCohorts => [...prevCohorts, url]);
                                } 
                                else
                                {
                                    setSelectedCohorts(prevCohorts => prevCohorts.filter(c => c !== url));
                                }
                            }}
                        />
                        ))}
                        </Form.Group>

                    <Form.Group controlId='caSplit' className='Form-Group'>
                        <Form.Label className='Form-Label'>CA Split:</Form.Label>
                        <Form.Control
                            type="number"
                            value={caSplit}
                            onChange={(e) => setCaSplit(parseInt(e.target.value))}
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

export default CreateModule;