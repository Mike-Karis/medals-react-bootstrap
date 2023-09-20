// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx
import React, { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { PlusCircleFill } from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Country from './components/Country';
import Modal from 'react-bootstrap/Modal';
import './App.css';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
// import axios from 'axios';

const App = () => {
  const [ countries, setCountries ] = useState([]);
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);

  // useEffect(() => {
  //   let fetchedCountries = [
  //       { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
  //       { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
  //       { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
  //     ];
  //   setCountries(fetchedCountries);
  // }, []);
  // this is the functional equivalent to componentDidMount
  useEffect(() => {
    // initial data loaded here
    let fetchedCountries = [
      { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
      { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
      { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
    ]
    setCountries(fetchedCountries);
  }, []);
  
  let show = false;
  let newCountryName = "";
  let showA = false;
  // }
  const handleChange = (e) => setCountries({ [e.target.name]: e.target.value});
  const handleAdd = (name) => {
    if (newCountryName.length > 0) {
      const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
      setCountries([...countries].concat({ id: id, name: name, gold: 0, silver: 0, bronze: 0 }));
      // console.log(`add: ${name}`);
      toggleShowA();
      handleClose();
      
    }
    else{
      toggleShowA();
    }
    // this.handleClose();
  }
  const handleDelete = (countryId) => {
    setCountries([...countries].filter(c => c.id !== countryId));
    // const mutableCountries = [...countries].filter(c => c.id !== countryId);
    // this.setState({ countries: mutableCountries });
    // console.log(`delete: ${countryId}`);
  }
  const handleIncrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] += 1;
    setCountries(mutableCountries);
  }
  const handleDecrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] -= 1;
    setCountries(mutableCountries);
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  const handleClose = () =>  show = false;
  const handleShow = () => {
    newCountryName = "";
    show = true;
  }
  const keyPress = (e) => {
    (e.keyCode ? e.keyCode : e.which) === '13' && handleAdd();
  }
  const toggleShowA = () => {
    if(showA === true){
     showA = false;}
    else{
      showA = true;
    }
  } 
    return (
      <React.Fragment>
        <Modal onKeyPress={ keyPress } show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country Name</Form.Label>
            <Form.Control
              type="text"
              name="newCountryName"
              onChange={ handleChange }
              value={ newCountryName }
              autoComplete='off'
              placeholder="enter name"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Save Changes
          </Button>
        </Modal.Footer>
        {/* <Button onClick={this.toggleShowA} className="mb-2">
            Toggle Toast
          </Button> */}
          <Toast show={showA} onClose={toggleShowA}>
            <Toast.Header>
              No Country Name Entered
            </Toast.Header>
            <Toast.Body>Please enter a name to countinue</Toast.Body>
          </Toast>
      </Modal>
        <Navbar className="navbar-dark bg-dark">
          <Container fluid>
            <Navbar.Brand>
              Olympic Medals
              <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
            </Navbar.Brand>
            <Button variant="outline-success" onClick={ handleShow }><PlusCircleFill /></Button>{' '}
          </Container>
      </Navbar>
      <Container fluid>
        <Row>
        { countries.map(country => 
          <Col className="mt-3" key={ country.id }>
          <Country 
              country={ country } 
              medals={ medals.current }
              onDelete={ handleDelete }
              onIncrement={ handleIncrement } 
              onDecrement={ handleDecrement } />
          </Col>
        )}
        </Row>
      </Container>
      </React.Fragment>
    );
  }
// }
 
export default App;
// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx