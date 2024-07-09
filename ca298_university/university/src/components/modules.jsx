import { ListGroup } from 'react-bootstrap';
import './components.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Modules ()
{
    const [ modules, setModules ] = useState([]);

    useEffect(() =>{
        fetch(`http://127.0.0.1:8000/api/module/`)
            .then(response=>response.json())
            .then(data =>{
                setModules(data);
            })
            .catch(err=>console.log(err))
    }, [])

    return (
        <div>
            <div className='Modules-Title'>
                <h1>View All Modules Below</h1>
            </div>
            
            <div className='Modules-List'>
                {modules.map(module =>(
                    <Link to={`/modules/${module.code}`} key={module.code} className='Modules-List-Link'>
                        <ListGroup as="ul" className='Modules-List-Item'>
                            <ListGroup.Item>{module.code} - {module.full_name}</ListGroup.Item>
                        </ListGroup>
                    </Link>
                ))}

            </div>

            <div className='Form-Link'>
                    <Link as={Link} to={`/modules/create`} className='Form-Link-Text'>
                        <h3>Click Here to Create A Module</h3>
                    </Link>
            </div>
        </div>
    );
}

export default Modules;