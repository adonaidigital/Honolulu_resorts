import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export default class MapBox extends Component {
  /* locations were added to state*/
  state = {
    venues: [
      {name: 'Iolani Palace', location: {lat: 21.306702252594054, lng: -157.85908306773678}},
      {name: 'Aloha Tower', location: {lat: 21.306958817002744, lng: -157.86492805197977}},
      {name: 'Waikiki Beach', location: {lat: 21.276314778227228, lng: -157.82579490801336}},
      {name: 'Ala Moana Center', location: {lat: 21.291304780721394, lng: -157.84382447356683}},
      {name: 'Museum of Art', location: {lat: 21.303686562615777, lng: -157.84859823030283}},
      {name: 'Ward Theaters', location: {lat: 21.294087397388843, lng: -157.8538493751185}},
      {name: 'Kaka`ako Park', location: {lat: 21.295116031557814, lng: -157.86258190602086}}
    ],   

    photos: [],
    markers:[], 
    infowindow: new this.props.google.maps.InfoWindow(),
    query: '',
    newIcon: null, 
    pageError: null,
    error:''
    }
    
    /* Randomuser api was easy to use but I will use Foursquare API in the version 2 of the project*/
componentDidMount(){
  console.log('componentDidMount')
  const url = 'https://randomuser.me/api/?results=7'
  fetch(url)
      .then(resp =>  (resp.ok) ? resp.json() : new Error(resp.statusText))
      .then(resp => {
        this.setState({photos: resp.results})
        this.onclickVenue()
        this.loadMap()
      })
      .catch(err => {
        this.setState({error: err.toString()})
      })
  }
/* Initializing Google maps based on Google Maps react documentation*/
  loadMap() {
    if (this.props && this.props.google) {
      
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
    } else{
      this.setState({pageError: "sorry could not load map"})
    }
  }
/* Markers were added */
      setMarkers = () => {
       const {google} = this.props
       const bounds = new google.maps.LatLngBounds();
       let {infowindow, venues} = this.state
       const {photos} = this.state

       venues.forEach((l, idx) => {
         const marker = new google.maps.Marker({
           position: {lat: l.location.lat, lng: l.location.lng},
           map: this.map,
           title: l.name,
           animation: window.google.maps.Animation.DROP
         })
         /* infowindows connected to markers */
            marker.addListener('click', () => {
              this.makeInfoWindow(marker, infowindow, photos[idx])
            })
            this.setState(state => ({
                markers: [...state.markers, marker]
            }))
            bounds.extend(marker.position);
       })
        this.map.fitBounds(bounds);
    }

    onclickVenue = () => {
       const now = this
       const {infowindow} = this.state


       const showInfowindow = (e) => {
         const {markers} = this.state
         const markerIdx = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
         now.makeInfoWindow(markers[markerIdx], infowindow, this.state.photos[markerIdx])
          }
        document.querySelector('.venues').addEventListener('click', (e)=> {
          if (e.target && e.target.nodeName === 'LI') {
            showInfowindow(e)
          }
        })
        document.querySelector('.venues').addEventListener('keydown', (e)=> {
          if(e.keyCode === 13 ){
            showInfowindow(e)
          }
        }) 
      }
    
      handleVenueChange = (e) => {
        this.setState({query: e.target.value})
      }
      /* Infowindows is able to show data from API*/
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
        /* Geocoder and Places API method was to validate randomuser API request in setting infowindow content */
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
                  window.alert('data is unavailable');
                }
              } else {
                window.alert('Could not Geocode due to : ' + status);
              }
            });
            /* This closes the infowindow*/
            infowindow.addListener('closeclick', () => {
              infowindow.marker = null
             });
            }
          }
 
    render() {
      const {markers, infowindow, venues, query} = this.state
      if (query) {
        venues.forEach((p, i) => {
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
        venues.forEach((i) => {
           if (markers.length && markers[i]) {
            markers[i].setVisible(true)
           }
        })
      }   /* error properly handled */
        return (
          <div>
          {this.state.error ? (
            <div className="error">
              Something is gone Wrong! check your internet connection!
            </div>):
            (<div className='mapBox' >
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
              {this.state.pageError && <div className="error">{this.state.pageError}</div>}
              </div>
            </div>)} 
          </div> 
      )
    }
  }
  /* 
  References: 
  https://developers.google.com/maps/documentation/javascript/tutorial
  Edoh Kodjo Walkthrough https://www.youtube.com/watch?v=9t1xxypdkrE&feature=youtu.be
  Fullstack React https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/
  */