import './components.css';
import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Degrees ()
{
    const [ degrees, setDegrees ] = useState([]);

    useEffect(() =>{
        fetch("http://127.0.0.1:8000/api/degree/")
            .then(response=>response.json())
            .then(data=>{
                const filteredData = data.filter(degree => degree.full_name !== 'string')
                setDegrees(filteredData)
            })
            .catch(err=>console.log(err))
    }, [])
    
    return (
        <div>
                <div className='Degrees-Title'>
                    <h1>View All Degrees Below</h1>
                </div>
                <div className="Degrees-Card-Container">
                    {degrees.map(degree => (
                        <Card key={degree.id} style={{ width: '20rem' }} className="Degrees-Cards">
                            <Card.Header>{degree.full_name}</Card.Header>
                            <Card.Body>
                                <Card.Title>{degree.full_name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{degree.shortcode}</Card.Subtitle>
                                <Button variant="primary" as={Link} to={`/degrees/${degree.shortcode}`}>View Degree</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <div className='Form-Link'>
                    <Link as={Link} to={`/degrees/create`} className='Form-Link-Text'>
                        <h3>Click Here to Create A Degree</h3>
                    </Link>
                </div>
        </div>
    );
}

export default Degrees;