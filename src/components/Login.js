import React, { Component } from 'react';
import firebase from '../Firebase';
import '../components/login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// visibility

class Login extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      email: '',
      password: '',
      user: [],
      array:[],
      hidden: true
    };
    this.toggleShow = this.toggleShow.bind(this);
  }


  onCollectionUpdate = (querySnapshot) => {
    const user = [];
    querySnapshot.forEach((doc) => {
      const {email, password} = doc.data();
      user.push({
        key: doc.id,
        doc, 
        email,
        password,
      });
    });
    this.setState({
      user
    });
  }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  toggleShow() {
    console.log("toggleshow");
    this.setState({ hidden: !this.state.hidden });
  }
  
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password).then(()=>{
      localStorage.setItem('email1',email);
      console.log("login sucessfully");
      window.location.hash='/Company-list'
    }).catch((error) => {
      console.log('hey error: ', error);
      if(error.code === "auth/user-not-found"){
        swal("Email not found","Please, Signup","error");
      } else{
        swal("Please Enter correct password","","error");
      }
    })
  };

  render() {
    const {email, password} = this.state;
    return (
      <div>
      <div className="backgroung_class">
      <div className="main_class">
      <h1 className="text-center">Stock Login</h1>
      <Grid container spacing={1} xs={12}>
      <Grid item sm={12} xs={12}>
      <TextField
      id="outlined-email-input"
      label="Email"
      type="email"
      name="email"
      autoComplete="email"
      margin="normal"
      variant="outlined"
      value={email} 
      onChange={this.handleInputChange}
      />
      </Grid>
      <Grid item sm={12} xs={12}>
      <TextField
      id="outlined-password-input"
      label="Password"
      type={this.state.hidden ? "password" : "text"}
      name="password"
      autoComplete="current-password"
      margin="normal"
      variant="outlined"
      value={password} 
      onChange={this.handleInputChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
          <IconButton
          edge="end"
          aria-label="Toggle password visibility"
          onClick={this.toggleShow}
          >
          {password ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          </InputAdornment>
          ),
      }}
      />
      </Grid>
      <Grid item sm={12} xs={12}>
      <Button color="primary" disabled={!this.state.email || !this.state.password} variant="contained" size="large" onClick={(event)=>this.handleSubmit(event)}>
      Login
      </Button>
      </Grid>
      <Grid item sm={12}>
      <Divider />
      <div className="text-center">
      New User? <Link to="/create"><Button color="primary">Sign Up</Button></Link>
      </div>
      </Grid>
      </Grid>
      </div>
      </div>
      </div>
      );
  }
}

export default Login;

