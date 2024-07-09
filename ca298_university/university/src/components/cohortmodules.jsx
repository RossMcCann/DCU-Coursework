import './components.css'
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'

function CohortModules ()
{
    const { id } = useParams();
    const [ modules, setModules ] = useState([]);

    useEffect(() =>{
        fetch(`http://127.0.0.1:8000/api/module/?delivered_to=${id}`)
            .then(response=>response.json())
            .then(data =>{
                setModules(data);
            })
            .catch(err=>console.log(err));
    }, [id])

    return (
        <div>
            <div className='Cohort-Modules-Title'>
                <h1>Modules Deliverd To {id}</h1>
            </div>
            
            <div className='Cohort-Modules-Card-Container'>
                {modules.map(module =>(
                    <Card key={module.code} style={{ width: '20rem' }} className="Cohort-Modules-Cards">
                        <Card.Header>{module.code}</Card.Header>
                        <Card.Body>
                            <Card.Title>{module.full_name}</Card.Title>
                            <Card.Subtitle>CA Split: {module.ca_split}%</Card.Subtitle>
                            <Button as={Link} to={`/modules/${module.code}`} variant="primary">View Module</Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default CohortModules;