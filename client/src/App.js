import React, { Component } from 'react'; 
import Header from './components/header'
import Form from './components/form';
import Nav from "./components/Nav";

import './App.css';

function App() {
  return (
    
      <div>
        <Nav />
        <Header />
        <Form/>
      </div>          
  );
}

export default App;
