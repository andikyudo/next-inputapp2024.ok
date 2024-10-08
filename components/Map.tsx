import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons
L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x.src,
	iconUrl: markerIcon.src,
	shadowUrl: markerShadow.src,
});

interface Location {
	id: string;
	user_id: string;
	latitude: number;
	longitude: number;
	timestamp: string;
}

interface MapComponentProps {
	locations: Location[];
}

const PulsingDot = L.divIcon({
	className: "pulsing-dot",
	iconSize: [10, 10],
});

export default function MapComponent({ locations }: MapComponentProps) {
	const center = locations[0]
		? [locations[0].latitude, locations[0].longitude]
		: [-7.2575, 112.7521]; // Default to Surabaya

	return (
		<MapContainer
			center={center as L.LatLngExpression}
			zoom={13}
			style={{ height: "100%", width: "100%" }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{locations.map((location) => (
				<Marker
					key={location.id}
					position={[location.latitude, location.longitude]}
					icon={PulsingDot}
				>
					<Popup>
						Latitude: {location.latitude}
						<br />
						Longitude: {location.longitude}
						<br />
						Timestamp: {new Date(location.timestamp).toLocaleString()}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
