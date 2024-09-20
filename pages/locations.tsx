import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function UserLocationPage() {
	const [locations, setLocations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchLocations();
	}, []);

	async function fetchLocations() {
		try {
			setLoading(true);
			const { data, error } = await supabase
				.from("user_locations")
				.select("*")
				.order("timestamp", { ascending: false });

			if (error) {
				throw error;
			}

			if (data) {
				setLocations(data);
			}
		} catch (error) {
			console.error("Error fetching locations:", error.message);
			// You might want to set an error state here and display it to the user
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='container mx-auto px-4'>
			<h1 className='text-2xl font-bold mb-4'>User Locations</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
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
			)}
		</div>
	);
}
