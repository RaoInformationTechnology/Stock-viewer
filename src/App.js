import React, { Component } from 'react';
import Login from './components/Login';
import Suggestions from './components/Suggestions';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = localStorage.getItem('email1');
  }
  render() {
    if(!this.state){
            return (
                <div>
                <Login />
                </div>
                );
        }else{
            return (
                <div>
                <Suggestions />
                </div>
                );
        }
  }
}

export default App;
