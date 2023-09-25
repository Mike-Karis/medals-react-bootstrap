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
import NewCountry from './components/NewCountry';
import axios from 'axios';

const App = () => {
  const [ countries, setCountries ] = useState([]);
  const apiEndpoint = "https://medals-api-6.azurewebsites.net/api/country";
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);

  useEffect(() => {
    // initial data loaded here
    // let fetchedCountries = [
    //   { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
    //   { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
    //   { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
    // ]
    async function fetchData() {
      const { data: fetchedCountries } = await axios.get(apiEndpoint);
      // we need to save the original medal count values in state
      let newCountries = [];
      fetchedCountries.forEach(country => {
        let newCountry = {
          id: country.id,
          name: country.name,
        };
        medals.current.forEach(medal => {
          const count = country[medal.name];
          // page_value is what is displayed on the web page
          // saved_value is what is saved to the database
          newCountry[medal.name] = { page_value: count, saved_value: count };
        });
        newCountries.push(newCountry);
      });
      setCountries(newCountries);
    }
    fetchData();
    
  }, []);
  
  let show = true;
  let newCountryName = "";
  let showA = false;
  // }
  const handleChange = (e) => setCountries({ [e.target.name]: e.target.value});
  const handleAdd = async (name) => {
    // const { data: post } = await axios.post(apiEndpoint, { name: name });
    
    // if (newCountryName.length > 0) {
    //   // const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
    //   // setCountries([...countries].concat({ id: id, name: name, gold: 0, silver: 0, bronze: 0 }));
    //   setCountries(countries.concat(post));
    //   // console.log(`add: ${name}`);
    //   toggleShowA();
    //   handleClose();
      
    // }
    // else{
    //   toggleShowA();
    // }
    // // this.handleClose();
    console.log('ADD');
    
  }
  
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter(w => w.id !== countryId));
    try {
      await axios.delete(`${apiEndpoint}/${countryId}`);
    } catch(ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while deleting a country');
        setCountries(originalCountries);
      }
    }
    await axios.delete(`${apiEndpoint}/${countryId}`);
    // setCountries([...countries].filter(c => c.id !== countryId));
    // const mutableCountries = [...countries].filter(c => c.id !== countryId);
    // this.setState({ countries: mutableCountries });
    // console.log(`delete: ${countryId}`);
  }
  const handleSave = async (countryId) => {
    const originalCountries = countries;

    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [ ...countries ];
    const country = mutableCountries[idx];
    let jsonPatch = [];
    medals.current.forEach(medal => {
      if (country[medal.name].page_value !== country[medal.name].saved_value) {
        jsonPatch.push({ op: "replace", path: medal.name, value: country[medal.name].page_value });
        country[medal.name].saved_value = country[medal.name].page_value;
      }
    });
    console.log(`json patch for id: ${countryId}: ${JSON.stringify(jsonPatch)}`);
    // update state
    setCountries(mutableCountries);

    try {
      await axios.patch(`${apiEndpoint}/${countryId}`, jsonPatch);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while updating');
        setCountries(originalCountries);
      }
    }
  }
  const handleReset = (countryId) => {
    // to reset, make page value the same as the saved value
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [ ...countries ];
    const country = mutableCountries[idx];
    medals.current.forEach(medal => {
      country[medal.name].page_value = country[medal.name].saved_value;
    });
    setCountries(mutableCountries);
  }
  const handleIncrement = (countryId, medalName) => handleUpdate(countryId, medalName, 1);
  const handleDecrement = (countryId, medalName) => handleUpdate(countryId, medalName, -1);
  const handleUpdate = (countryId, medalName, factor) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName].page_value += (1 * factor);
    setCountries(mutableCountries);
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    // use medal count displayed in the web page for medal count totals
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0); });
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
    <Navbar className="navbar-dark bg-dark">
        <Container fluid>
          <Navbar.Brand>
            Olympic Medals
            <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
          </Navbar.Brand>
          <NewCountry onAdd={ handleAdd } />
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
            onSave={ handleSave }
            onReset={ handleReset }
            onIncrement={ handleIncrement } 
            onDecrement={ handleDecrement } />
        </Col>
      )}
      </Row>
    </Container>
    </React.Fragment>
    );
  }
 
export default App;