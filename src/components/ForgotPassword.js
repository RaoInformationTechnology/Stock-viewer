import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
// import {LinkButtons,homeButton, forgotButton, inputStyle}

class ForgotPassword extends Component{
	constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      email: '',
     showError: false,
     messageFromServer: '',
    };
  }

  handleChange = name => event => {
  	this.setState({ [name]: event.target.value, });
  }

  sendEmail = e =>{
  	e.preventDefault();
  	if(this.state.email == ''){
  		this.setState({ 
  			showError: false,
  			messageFromServer: '',
  		});
  	} else{
  		axios.post('')
  	}
  }
}