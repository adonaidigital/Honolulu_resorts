import React, { Component } from 'react';
import { GoogleApiWrapper} from 'google-maps-react';
import './App.css';
import MapBox from './MapBox'

class App extends Component {
  componentDidMount() {
    document.querySelector('.list-btn').addEventListener('click', this.toggleMenu)
    document.querySelector('.list-btn').addEventListener('keydown', (e) => {
      if(e.keyCode === 13) {
        document.querySelector('.list-btn').focus()
        this.toggleMenu()
      }
    })
  }

  toggleMenu = () => {
    document.querySelector('.sideNav').classList.toggle('hideList')
  }

  render() {    
    return (
      <div className="App" >
      <h1 className="heading"> Fun Places in Honolulu <span className="list-btn" tabIndex="0" > ☰ </span> </h1>
         <MapBox google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCKhaQIsawl0bk2EH72rL8m_Y9jKxJvCZo'
})(App);