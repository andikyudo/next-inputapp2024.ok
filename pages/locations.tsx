import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../utils/supabase";

interface Location {
	id: string;
	user_id: string;
	latitude: number;
	longitude: number;
	timestamp: string;
}

const PulsingDot: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
	const pulsingDotIcon = L.divIcon({
		className: "pulsing-dot-icon",
		html: '<div class="pulsing-dot"></div>',
		iconSize: [20, 20],
	});

	return <Marker position={[lat, lng]} icon={pulsingDotIcon} />;
};

const LocationsMapPage: React.FC = () => {
	const [locations, setLocations] = useState<Location[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchLocations();
	}, []);

	const fetchLocations = async () => {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("user_locations")
				.select("*")
				.order("timestamp", { ascending: false });

			if (error) {
				throw error;
			}

			setLocations(data || []);
		} catch (error) {
			console.error("Error fetching locations:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	const center = locations[0]
		? [locations[0].latitude, locations[0].longitude]
		: [0, 0];

	return (
		<div className='container mx-auto px-4'>
			<h1 className='text-2xl font-bold mb-4'>User Locations Map</h1>
			<div style={{ height: "500px", width: "100%" }}>
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
			</div>
		</div>
	);
};

export default LocationsMapPage;
