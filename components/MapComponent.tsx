import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

const PulsingDot: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
	const pulsingDotIcon = L.divIcon({
		className: "pulsing-dot-icon",
		html: '<div class="pulsing-dot"></div>',
		iconSize: [20, 20],
	});

	return <Marker position={[lat, lng]} icon={pulsingDotIcon} />;
};

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
	if (locations.length === 0) {
		return <div>No locations to display</div>;
	}

	const center = [locations[0].latitude, locations[0].longitude];

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
				<PulsingDot
					key={location.id}
					lat={location.latitude}
					lng={location.longitude}
				/>
			))}
		</MapContainer>
	);
};

export default MapComponent;
