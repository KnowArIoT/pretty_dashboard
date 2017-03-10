import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Lightbox from '../Lightbox';

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={10}
    defaultCenter={{ lat: 59.911491, lng: 10.757933 }}
    onClick={props.onMapClick}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
      />
    ))}
  </GoogleMap>
));

class AriotGoogleMaps extends React.Component {
  constructor() {
    super();
    this.state = {
      markers: [{
        position: {
          lat: 59.911491, lng: 10.757933,
        },
        img: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSh8yPAhD69c424J5Ybjea2VchUuaMYQ01aaf4_ejDpmcqaiFbYyleFFQ',
        key: 'Taiwan',
        defaultAnimation: 2,
      }],
      img: {
        show: false,
        obj: undefined,
      },
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }

  handleMapLoad() {

  }

  handleMapClick() {
  }

  handleMarkerRightClick(img) {
    console.log(this.state.img.show);
    this.setState({img: { obj: img, show: !this.state.img.show}});
  }

  render() {
    console.log(this.state.img.obj);
    return (
      <div>
        <Lightbox display={this.state.img.show} onClose={this.handleMarkerRightClick}>
          {this.state.img.obj && this.state.img.obj.position ?
            <h2>{`Picture at latitude ${this.state.img.obj.position.lat} and longitude ${this.state.img.obj.position.lng}`}</h2> : ''
          }
          {this.state.img.obj && this.state.img.obj.img ?
            <img src={this.state.img.obj.img} /> : ''
          }
        </Lightbox>
        <div className="google-map">
          <GettingStartedGoogleMap
            containerElement={
              <div style={{ height: '100%' }} />
            }
            mapElement={
              <div style={{ height: '100%' }} />
            }
            onMapLoad={this.handleMapLoad}
            onMapClick={this.handleMapClick}
            markers={this.state.markers}
            onMarkerRightClick={this.handleMarkerRightClick}
          />
        </div>
      </div>
    );
  }
}

export default AriotGoogleMaps;
