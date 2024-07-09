import { Container, Nav, Navbar }  from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Degrees from './degrees';
import HomePage from './home';
import Cohorts from './cohorts';
import Modules from './modules';
import SingleDegree from './singledegree';
import SingleCohort from './singlecohort';
import SingleModule from './singlemodule';
import CohortModules from './cohortmodules';
import SingleStudent from './singlestudent';
import CreateDegree from './createdegree';
import CreateCohort from './createcohort';
import CreateStudent from './students';
import CreateModule from './createmodule';
import CreateGrade from './creategrade';

function NavBar()
{
    return (
    <div>
        <BrowserRouter>
            <Navbar bg="primary" data-bs-theme="dark" sticky='top'>
            <Container>
                <Navbar.Brand as={Link} to="/home">Ross's University</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/degrees">Degrees</Nav.Link>
                    <Nav.Link as={Link} to="/cohorts">Cohorts</Nav.Link>
                    <Nav.Link as={Link} to="/modules">Modules</Nav.Link>
                    <Nav.Link as={Link} to="/students">Students</Nav.Link>
                </Nav>
            </Container>
            </Navbar>

            <div>
                <Routes>
                    <Route path="/home" element={<HomePage />}/>
                    <Route path="/degrees" element={<Degrees />}/>
                    <Route path="/degrees/create" element={<CreateDegree />}/>
                    <Route path="/degrees/:shortcode" element={<SingleDegree />}/>
                    <Route path="/cohorts" element={<Cohorts />}/>
                    <Route path="cohorts/create" element={<CreateCohort />} />
                    <Route path="/cohorts/:id" element={<SingleCohort />} />
                    <Route path="/modules" element={<Modules />}/>
                    <Route path="/modules/:code" element={<SingleModule />}/>
                    <Route path="/modules/create" element={<CreateModule />} />
                    <Route path="/cohorts/:id/modules" element={<CohortModules />}/>
                    <Route path="/students" element={<CreateStudent />} />
                    <Route path="/students/:id" element={<SingleStudent />} />
                    <Route path="/students/grades" element={<CreateGrade />} />
                    <Route path="/" element={<Navigate to="/home" />}/>
                </Routes>
            </div>
        </BrowserRouter>
    </div>
    );
}

export default NavBar;