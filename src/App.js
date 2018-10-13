import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './App.css';

class App extends Component {
  render() {
    const style = {
      width: '75%',
      height: '100%'
    }
    return (
      <div className="App">
         <Map
            google={this.props.google}
            style={style}
            initialCenter={{
              lat:21.306944,
              lng:-157.858333
            }}
            zoom={15}
            onClick={this.onMapClicked}
          >
          <Marker onClick={this.onMarkerClick}
                  name={'Current location'} />

          <InfoWindow onClose={this.onInfoWindowClose}>
            
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCKhaQIsawl0bk2EH72rL8m_Y9jKxJvCZo'
})(App);