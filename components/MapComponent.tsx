import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
	iconUrl: require("leaflet/dist/images/marker-icon.png").default,
	shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
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
				>
					<Popup>
						User ID: {location.user_id}
						<br />
						Timestamp: {new Date(location.timestamp).toLocaleString()}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
