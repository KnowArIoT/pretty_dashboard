import React from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow, Circle } from 'react-google-maps';
import Lightbox from '../Lightbox';
import canUseDOM from 'can-use-dom';
import raf from 'raf';

  // This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  console.log(lat1);
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const geolocation = (
  canUseDOM && navigator.geolocation ?
  navigator.geolocation :
  ({
    getCurrentPosition(success, failure) {
      failure('Your browser doesn\'t support geolocation.');
    },
  })
);

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={12}
    onClick={props.onMapClick}
    center={props.center}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onClick={() => props.onClick({ ...marker, distanceToYou: getDistanceFromLatLonInKm(marker.position.lat, marker.position.lng, props.center.lat, props.center.lng)})}
        onRightClick={() => props.onMarkerRightClick({ marker, distanceToYou: getDistanceFromLatLonInKm(marker.lat, marker.lng, props.center.lat, props.center.lng)})}
      />
    ))}
    {props.center && (
      <InfoWindow position={props.center}>
        <div>{props.content}</div>
      </InfoWindow>
    )}
    {props.center && (
      <Circle
        center={props.center}
        radius={props.radius}
        options={{
          fillColor: 'red',
          fillOpacity: 0.20,
          strokeColor: 'red',
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
      />
    )}
  </GoogleMap>
));

let isUnmounted = false;


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
      refreshIntervalId: undefined,
      center: null,
      content: null,
      radius: 6000,
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  componentDidMount() {
    const refreshIntervalId  = setInterval(() => {
      fetch('https://ariot.thuc.cloud/image?limit=10')
        .then(response => {
          response.json().then(array => {
            const newMarkers = array.map((marker, index) => {
              if (marker.coords !== null) {
                const latlng = marker.coords.split(',');
                return { position: {lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1])}, img: marker.url, key: index, defaultAnimation: 2};
              }
              return {};
            });
            this.setState({ markers: newMarkers, refreshIntervalId});
          });
        });
    }, 2000);

    const tick = () => {
      if (isUnmounted) {
        return;
      }
      this.setState({ radius: Math.max(this.state.radius - 20, 0) });

      if (this.state.radius > 200) {
        raf(tick);
      }
    };
    geolocation.getCurrentPosition((position) => {
      if (isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        content: 'You are here!',
      });

      raf(tick);
    }, (reason) => {
      if (isUnmounted) {
        return;
      }
      this.setState({
        center: {
          lat: 59.911491,
          lng: 10.757933,
        },
        content: `Error: The Geolocation service failed (${reason}).`,
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
    isUnmounted = true;
  }

  handleMapLoad() {

  }

  handleMapClick() {
  }

  handleMarkerRightClick() {
  }
  handleMarkerClick(img) {
    this.setState({img: { obj: img, show: !this.state.img.show}});
  }

  render() {
    return (
      <div>
        <Lightbox display={this.state.img.show} onClose={this.handleMarkerClick}>
          {this.state.img.obj && this.state.img.obj.position ?
              <div>
                <h2>{`Picture at latitude ${this.state.img.obj.position.lat} and longitude ${this.state.img.obj.position.lng}`}</h2>
                <h4>{`The distance to you is: ${this.state.img.obj.distanceToYou} km`}</h4>
              </div>
              : ''
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
            onClick={this.handleMarkerClick}
            markers={this.state.markers}
            onMarkerRightClick={this.handleMarkerRightClick}
            center={this.state.center}
            content={this.state.content}
            radius={this.state.radius}
          />
        </div>
      </div>
    );
  }
}

export default AriotGoogleMaps;
