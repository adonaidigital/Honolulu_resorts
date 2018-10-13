import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export  default class MapBox extends Component {

componentDidMount(){
  console.log('componentDidMount');
  this.loadMap()
}
  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 14;
      let lat = 21.306944;
      let lng = -157.858333;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig)
    }
  }
    render() {
      
      return (
          <div className='mapBox' >
            <div role="application" className="map" ref="map">
            loading map...
            </div>
          </div> 
      )
    }
  }