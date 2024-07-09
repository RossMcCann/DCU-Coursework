import './components.css';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function SingleDegree ()
{
    const { shortcode } = useParams();
    const [ singleDegree, setSingleDegree ] = useState(null);
    const [ cohorts, setCohorts] = useState([]);

    useEffect(() =>{
        fetch(`http://127.0.0.1:8000/api/degree/${shortcode}`)
            .then(response=>response.json())
            .then(data=>{
                setSingleDegree(data);
            })
            .catch(err=>console.log(err))

        fetch(`http://127.0.0.1:8000/api/cohort/?degree=${shortcode}`)
            .then(response=>response.json())
            .then(data=>{
                const filteredData = data.filter(cohort => cohort.id !== '3') 
                setCohorts(filteredData);
            })
            .catch(err=>console.log(err))
    }, [shortcode])

    if (!singleDegree) {
        return <div>Loading...</div>;
    } // need this if statement or else the whole site crashes

    return (
        <div>
            <div className='Single-Degree-Title'>
                <h1>{singleDegree.shortcode} - {singleDegree.full_name}</h1>
            </div>
            <div className='Single-Degree-Subtitle'>
                <h3>View All {singleDegree.shortcode} Cohorts Below</h3>
            </div>

            <div className='Single-Degree-Card-Container'>
                {cohorts.map(cohort => (
                    <Card key={cohort.year} style={{ width: '20rem' }} className="Single-Degree-Cards">
                        <Card.Header>{cohort.id}</Card.Header>
                        <Card.Body>
                            <Card.Title>{cohort.name}</Card.Title>
                            <Button as={Link} to={`/cohorts/${cohort.id}`} variant="primary">View Cohort</Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default SingleDegree;