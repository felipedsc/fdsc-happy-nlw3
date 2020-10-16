import mapMarkerImg from '../images/map-marker.svg';
import Leaflet from 'leaflet';

export const mapIcon = Leaflet.icon({
    iconUrl: mapMarkerImg,

    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [0, -60]
})