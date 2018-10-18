import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export default class MapBox extends Component {

  state = {
    places: [
      {name: 'Iolani Palace', location: {lat: 21.306702252594054, lng: -157.85908306773678}},
      {name: 'Aloha Tower', location: {lat: 21.306958817002744, lng: -157.86492805197977}},
      {name: 'Waikiki Beach', location: {lat: 21.276314778227228, lng: -157.82579490801336}},
      {name: 'Ala Moana Center', location: {lat: 21.291304780721394, lng: -157.84382447356683}},
      {name: 'Museum of Art', location: {lat: 21.303686562615777, lng: -157.84859823030283}},
      {name: 'Ward Theaters', location: {lat: 21.294087397388843, lng: -157.8538493751185}},
      {name: 'Kaka`ako Park', location: {lat: 21.295116031557814, lng: -157.86258190602086}}
    ], 

    markers:[], 
    infowindow: new this.props.google.maps.InfoWindow()
    }
    
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

      let zoom = 13;
      let lat = 21.306944;
      let lng = -157.858333;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig)
      this.setMarkers()
    }
  }

      setMarkers = () => {
       const {google} = this.props
       const bounds = new google.maps.LatLngBounds();
       let {infowindow} = this.state

       this.state.places.forEach((location, i) => {
         const marker = new google.maps.Marker({
           position: {lat: location.location.lat, lng: location.location.lng},
           map: this.map,
           title: location.name
         })
            marker.addListener('click', () => {
              this.makeInfoWindow(marker, infowindow)
            })
            this.setState(state => ({
                markers: [...state.markers, marker]
            }))
            bounds.extend(marker.position);
       })
        this.map.fitBounds(bounds);
    }

    makeInfoWindow = (marker, infowindow) => {
      if (infowindow.marker !== marker ){
            infowindow.marker = marker
            infowindow.setContent(`<h3>title</h3><h5>here we are!</h5>`);
            infowindow.open(this.map, marker) 
            infowindow.addListener('closeclick', () => {
              infowindow.marker = null
             })
            }
          }
 
    render() {
      const {markers} = this.state
        return (
          <div>
            <div className='mapBox' >
              <div className='textInput'>
                <ul className='venue'>{
                 markers.map((m, i) =>
                   (<li key={i}>{m.title}</li>))
                  }</ul>
              </div>
              <div role="application" className="map" ref="map">
              loading map...
              </div>
            </div> 
          </div> 
      )
    }
  }