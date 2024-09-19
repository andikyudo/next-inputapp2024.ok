import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Locations() {
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		fetchLocations();
		const subscription = supabase
			.from("user_locations")
			.on("INSERT", (payload) => {
				setLocations((currentLocations) => [payload.new, ...currentLocations]);
			})
			.subscribe();

		return () => {
			supabase.removeSubscription(subscription);
		};
	}, []);

	async function fetchLocations() {
		const { data, error } = await supabase
			.from("user_locations")
			.select("*")
			.order("timestamp", { ascending: false })
			.limit(50);

		if (error) {
			console.error("Error fetching locations:", error);
		} else {
			setLocations(data);
		}
	}

	return (
		<div className='container mx-auto px-4'>
			<h1 className='text-2xl font-bold mb-4'>User Locations</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white'>
					<thead>
						<tr>
							<th className='px-4 py-2'>User ID</th>
							<th className='px-4 py-2'>Latitude</th>
							<th className='px-4 py-2'>Longitude</th>
							<th className='px-4 py-2'>Timestamp</th>
						</tr>
					</thead>
					<tbody>
						{locations.map((location) => (
							<tr key={location.id}>
								<td className='border px-4 py-2'>{location.user_id}</td>
								<td className='border px-4 py-2'>{location.latitude}</td>
								<td className='border px-4 py-2'>{location.longitude}</td>
								<td className='border px-4 py-2'>
									{new Date(location.timestamp).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
