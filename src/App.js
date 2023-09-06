// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx
import React, { Component } from 'react';
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

class App extends Component {
  state = {
    countries: [
      { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
      { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
      { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
    ],
    medals: [
      { id: 1, name: 'gold' },
      { id: 2, name: 'silver' },
      { id: 3, name: 'bronze' },
    ],
    show: false,
    newCountryName: "",
    showA: false
  }
  handleChange = (e) => this.setState({ [e.target.name]: e.target.value});
  handleAdd = () => {
    if (this.state.newCountryName.length > 0) {
      const { countries } = this.state;
      const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
      const mutableCountries = [...countries].concat({ id: id, name: this.state.newCountryName, gold: 0, silver: 0, bronze: 0 });
      this.setState({ countries: mutableCountries });
      this.toggleShowA();
      this.handleClose();
      
    }
    else{
      this.toggleShowA();
    }
    // this.handleClose();
  }
  handleDelete = (countryId) => {
    const { countries } = this.state;
    const mutableCountries = [...countries].filter(c => c.id !== countryId);
    this.setState({ countries: mutableCountries });
  }
  handleIncrement = (countryId, medalName) => {
    const countries = [ ...this.state.countries ];
    const idx = countries.findIndex(c => c.id === countryId);
    countries[idx][medalName] += 1;
    this.setState({ countries: countries });
  }
  handleDecrement = (countryId, medalName) => {
    const countries = [ ...this.state.countries ];
    const idx = countries.findIndex(c => c.id === countryId);
    countries[idx][medalName] -= 1;
    this.setState({ countries: countries });
  }
  getAllMedalsTotal() {
    let sum = 0;
    this.state.medals.forEach(medal => { sum += this.state.countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  handleClose = () => this.setState({ show:false });
  handleShow = () => {
    this.state.newCountryName = "";
    this.setState({ show:true });
  }
  handleClose = () => {
    this.setState({ show:false });
  }
  handleShow = () => {
    this.setState({ show:true });
  }
  keyPress = (e) => {
    (e.keyCode ? e.keyCode : e.which) == '13' && this.handleAdd();
  }
  toggleShowA = () => {
    if(this.state.showA == true){
    this.setState({ showA:false });}
    else{
      this.setState({ showA:true });
    }
  }

  render() { 
    return (
      <React.Fragment>
        <Modal onKeyPress={ this.keyPress } show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Country Name</Form.Label>
            <Form.Control
              type="text"
              name="newCountryName"
              onChange={ this.handleChange }
              value={ this.state.newCountryName }
              autoComplete='off'
              placeholder="enter name"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleAdd}>
            Save Changes
          </Button>
        </Modal.Footer>
        {/* <Button onClick={this.toggleShowA} className="mb-2">
            Toggle Toast
          </Button> */}
          <Toast show={this.state.showA} onClose={this.toggleShowA}>
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
              <Badge className="ml-2" bg="light" text="dark" pill>{ this.getAllMedalsTotal() }</Badge>
            </Navbar.Brand>
            <Button variant="outline-success" onClick={ this.handleShow }><PlusCircleFill /></Button>{' '}
          </Container>
      </Navbar>
      <Container fluid>
        <Row>
        { this.state.countries.map(country => 
          <Col className="mt-3" key={ country.id }>
          <Country 
              country={ country } 
              medals={ this.state.medals }
              onDelete={ this.handleDelete }
              onIncrement={ this.handleIncrement } 
              onDecrement={ this.handleDecrement } />
          </Col>
        )}
        </Row>
      </Container>
      </React.Fragment>
    );
  }
}
 
export default App;
