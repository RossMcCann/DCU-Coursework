import './components.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'

function SingleModule ()
{
    const { code } = useParams();
    const [ module, setModule ] = useState(null);
    const [ cohorts, setCohorts ] = useState([])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/module/${code}/`)
            .then(response => response.json())
            .then(data => {
                setModule(data);
                if (data && data['delivered_to'])
                {
                    Promise.all(data['delivered_to'].map(cohortUrl =>
                        fetch(cohortUrl)
                            .then(response => response.json())
                    ))
                    .then(cohortsData =>{
                        setCohorts(cohortsData);
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }, [code]);

    if (!module)
    {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='Single-Module-Title'>
                <h1>{module.code} - {module.full_name}</h1>
            </div>
            <div className='Single-Module-Subtitle'>
                <h3>CA Split: {module.ca_split}%</h3>
            </div>

            <div className='Single-Module-Content-Container'>
                <h3 className='Single-Module-Content-Container-Title'>Cohorts Delivered To:</h3>

                <div className='Single-Module-Cohorts-Cards-Container'>
                    {cohorts.map(cohort => (
                        <Card key={cohort.id} style={{ width: '20rem' }} className="Single-Module-Cohorts-Cards">
                            <Card.Header>{cohort.id}</Card.Header>
                            <Card.Body>
                                <Card.Title>{cohort.name}</Card.Title>
                                <Button as={Link} to={`/cohorts/${cohort.id}/modules`} variant="primary">View Cohort</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SingleModule;