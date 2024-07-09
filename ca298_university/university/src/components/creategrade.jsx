import './components.css'
import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function CreateGrade ()
{
    const [ modules, setModules ] = useState([])
    const [ module, setModule ] = useState('');
    const [ caMark, setCaMark ] = useState(0);
    const [ examMark, setExamMark ] = useState(0);
    const [ cohorts, setCohorts ] = useState([])
    const [ cohort, setCohort ] = useState('');
    const [ student, setStudent ] = useState('');
    const [ success, setSuccess ] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/api/cohort/`)
            .then(response=>response.json())
            .then(data=>{
                const filteredData = data.filter(cohort => cohort.id !== '3')
                setCohorts(filteredData)
            })
            .catch(err=>console.log(err))

        fetch(`http://localhost:8000/api/module/`)
            .then(response=>response.json())
            .then(data=>{
                setModules(data)
            })
            .catch(err=>console.log(err))
    }, [])

    const submit = async (event) => {
        event.preventDefault();

        try
        {
            const response = await fetch(`http://localhost:8000/api/grade/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    module: `http://127.0.0.1:8000/api/module/${module}/`,
                    ca_mark: caMark,
                    exam_mark: examMark,
                    cohort: `http://127.0.0.1:8000/api/cohort/${cohort}/`,
                    student: `http://127.0.0.1:8000/api/student/${student}/`,
                }),
            });

            console.log(JSON.stringify({
                module: `http://127.0.0.1:8000/api/module/${module}/`,
                ca_mark: caMark,
                exam_mark: examMark,
                cohort: `http://127.0.0.1:8000/api/cohort/${cohort}/`,
                student: `http://127.0.0.1:8000/api/student/${student}/`,
            }))

            if (response.ok) 
            {
                // set success message and clear data fields to be used again
                setSuccess('Grade Created');
                setModule('');
                setCaMark('');
                setExamMark('');
                setCohort('');
                setStudent('');
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
                <h1>Create A Grade For A Student Below</h1>
            </div>

            <div className='Create-Form'>
                <Form onSubmit={submit}>
                    <Form.Group controlId='module' className='Form-Group'>
                        <Form.Label className='Form-Label'>Module:</Form.Label>
                        <Form.Select
                            value={module}
                            onChange={(e) => setModule(e.target.value)}
                            required
                        >
                            <option value="">Select Cohort</option>
                            {modules.map(module => (
                                <option key={module.code}>
                                    {module.code}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId='cohort' className='Form-Group'>
                        <Form.Label className='Form-Label'>Cohort:</Form.Label>
                        <Form.Select
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

                    <Form.Group controlId='student' className='Form-Group'>
                        <Form.Label className='Form-Label'>Student Number:</Form.Label>
                        <Form.Control 
                            type="number"
                            value={student}
                            onChange={(e) => setStudent(parseInt(e.target.value))}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='caMark' className='Form-Group'>
                        <Form.Label className='Form-Label'>CA Mark:</Form.Label>
                        <Form.Control 
                            type="number"
                            value={caMark}
                            onChange={(e) => setCaMark(parseInt(e.target.value))}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId='examMark' className='Form-Group'>
                        <Form.Label className='Form-Label'>Exam Mark:</Form.Label>
                        <Form.Control 
                            type="number"
                            value={examMark}
                            onChange={(e) => setExamMark(parseInt(e.target.value))}
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

export default CreateGrade;