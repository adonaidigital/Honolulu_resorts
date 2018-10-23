import React, { Component } from 'react';
import ReactDOM from 'react-dom'
//import axios from 'axios'

export default class MapBox extends Component {

  state = {
    sites: [
      {name: 'Iolani Palace', location: {lat: 21.306702252594054, lng: -157.85908306773678}},
      {name: 'Aloha Tower', location: {lat: 21.306958817002744, lng: -157.86492805197977}},
      {name: 'Waikiki Beach', location: {lat: 21.276314778227228, lng: -157.82579490801336}},
      {name: 'Ala Moana Center', location: {lat: 21.291304780721394, lng: -157.84382447356683}},
      {name: 'Museum of Art', location: {lat: 21.303686562615777, lng: -157.84859823030283}},
      {name: 'Ward Theaters', location: {lat: 21.294087397388843, lng: -157.8538493751185}},
      {name: 'Kaka`ako Park', location: {lat: 21.295116031557814, lng: -157.86258190602086}}
    ],   

    users: [],
    markers:[], 
    infowindow: new this.props.google.maps.InfoWindow(),
    query: '',
    newIcon: null
    }
    
componentDidMount(){
  console.log('componentDidMount')
  const url = 'https://randomuser.me/api/?results=7'
  fetch(url)
      .then(resp =>  (resp.ok) ? resp.json() : new Error(resp.statusText))
      .then(resp => {
        this.setState({users: resp.results})
        this.loadMap()
        this.onclickVenue()
      })
      .catch(err => {
        this.setState({error: err.toString()})
      })
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
        zoom: zoom,
        mapTypeId: 'roadmap'
      })
      this.map = new maps.Map(node, mapConfig)
      this.setMarkers()
    }
  }

      sitesID = marker => {
        let {sites} = this.state
        let venue = sites.filter(s => s.sites.name === marker.title)
        let venueID = venue[0].venue.id
        return venueID
      }

      setMarkers = () => {
       const {google} = this.props
       const bounds = new google.maps.LatLngBounds();
       let {infowindow, sites} = this.state
       const {users} = this.state

       sites.forEach((l, idx) => {
         const marker = new google.maps.Marker({
           position: {lat: l.location.lat, lng: l.location.lng},
           map: this.map,
           title: l.name
         })
            marker.addListener('click', () => {
              this.makeInfoWindow(marker, infowindow, users[idx])
            })
            this.setState(state => ({
                markers: [...state.markers, marker]
            }))
            bounds.extend(marker.position);
       })
        this.map.fitBounds(bounds);
    }

    onclickVenue = () => {
       const that = this
       const {infowindow} = this.state

       const showInfowindow = (e) => {
         const {markers} = this.state
         const markerIdx = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
         that.makeInfoWindow(markers[markerIdx], infowindow, this.state.users[markerIdx])
          }
        document.querySelector('.venues').addEventListener('click', (e)=> {
          if (e.target && e.target.nodeName === 'LI') {
            showInfowindow(e)
          }
        }) 
      }
    
      handleVenueChange = (e) => {
        this.setState({query: e.target.value})
      }
      
    makeInfoWindow = (marker, infowindow, user) => {
      const {google} = this.props
      const service = new google.maps.places.PlacesService(this.map)
      const geocoder = new google.maps.Geocoder()
      const {markers, newIcon} = this.state
      const defaultIcon = marker.getIcon()

      if (infowindow.marker !== marker ){
        if(infowindow.marker) {
          const idx = markers.findIndex(m => m.title === infowindow.marker.title)
          markers[idx].setIcon(defaultIcon)
        }
        marker.setIcon(newIcon)    
        infowindow.marker = marker;
            geocoder.geocode({'location': marker.position}, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                  service.getDetails({
                    placeId: results[1].place_id
                  }, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                      infowindow.setContent(`<h4>Location: <strong>${marker.title}</strong></h4>
                                   <h3>User</h3>
                                   <div>${user.name.first} ${user.name.last}</div>
                                   <h4> Other details: </h4>
                                   <div> ${place.formatted_address}</div>
                                   <img src="${user.picture.large}" alt="user living in ${marker.title}"/>`);
                      infowindow.open(this.map, marker);
                    }
                  });
      
                } else {
                  window.alert('No results found');
                }
              } else {
                window.alert('Geocoder failed due to: ' + status);
              }
            });

            infowindow.addListener('closeclick', () => {
              infowindow.marker = null
             });
            }
          }
 
    render() {
      const {markers, infowindow, sites, query} = this.state
      if (query) {
        sites.forEach((p, i) => {
          if (p.name.toLowerCase().includes(query.toLowerCase())) {
            markers[i].setVisible(true)
           }else{
             if (infowindow.marker === markers[i]) {
               infowindow.close()
             }
            markers[i].setVisible(false)
           }
        })
      }else{
        sites.forEach((p, i) => {
           if (markers.length && markers[i]) {
            markers[i].setVisible(true)
           }
        })
      }
        return (
          <div>
            <div className='mapBox' >
              <div className='textInput hideList sideNav'>
                <input role='search' onChange={this.handleVenueChange} placeholder='filter'
                       type='text' value={this.state.value}/>
                  <div>
                    <ul className='venues'>{
                    markers.filter(m => m.getVisible()).map((m, i) =>
                      (<li key={i} role='link' tabIndex='0'>{m.title}</li>))
                      }</ul>
                  </div>
              </div>
              <div role="application" className="map" ref="map">
              loading map...
              </div>
            </div> 
          </div> 
      )
    }
  }