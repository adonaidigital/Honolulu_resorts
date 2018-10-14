import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export  default class MapBox extends Component {

  state = {
    places: [
      {name: 'Iolani Palace', location:{lat: 21.306702252594054, lng: -157.85908306773678}},
      {name: 'Aloha Tower', location:{lat: 21.306958817002744, lng: -157.86492805197977}},
      {name: 'Waikiki Beach', location:{lat: 21.276314778227228, lng: -157.82579490801336}},
      {name: 'Ala Moana Center', location:{lat: 21.291304780721394, lng: -157.84382447356683}},
      {name: 'Museum of Art', location:{lat: 21.303686562615777, lng: -157.84859823030283}},
      {name: 'Ward Theaters', location:{lat: 21.318098811525196, lng: -157.861582113093}},
      {name: 'Kaka`ako Park', location:{lat: 21.295116031557814, lng: -157.86258190602086}}
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

      let zoom = 14;
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
       const bounds = new this.props.google.maps.LatLngBounds();
       let {infoWindow} = this.state

       this.state.places.forEach((location, i) =>{
         const marker = new google.maps.Marker({
           position: {lat: location.location.lat, lng: location.location.lng},
           map: this.map,
           title: location.name
         });
            marker.addListener('click', () => {
              this.makeInfoWindow(marker, infoWindow)
            })
            this.setState((state) => ({
                markers: [...state.markers, marker]
            }))
            bounds.extend(marker.position);
       })
       //this.map.setBounds(bounds);
    }
    
    render() {
      
      return (
          <div className='mapBox' >
            <div role="application" className="map" ref="map">
            loading map...
            <marker onClick={this.onMarkerClick}
                  name={'Current location'} />
                   setBounds={'bounds'}
            </div>
          </div> 
      )
    }
  }