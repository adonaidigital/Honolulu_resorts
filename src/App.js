import React, { Component } from 'react';
import { GoogleApiWrapper} from 'google-maps-react';
import './App.css';
import MapBox from './MapBox'

class App extends Component {
  render() {    
    return (
      <div className="App" >
      <h1 className="heading"> Fun Places in Honolulu </h1>
         <MapBox google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCKhaQIsawl0bk2EH72rL8m_Y9jKxJvCZo'
})(App);