import { useEffect } from "react";
import useSWR from "swr";
import { supabase } from "../utils/supabase";
import dynamic from "next/dynamic";
import ProtectedRoute from "../components/ProtectedRoute";

const MapWithNoSSR = dynamic(() => import("../components/Map"), {
	ssr: false,
});

interface Location {
	id: string;
	user_id: string;
	latitude: number;
	longitude: number;
	timestamp: string;
}

const fetcher = async () => {
	const { data, error } = await supabase
		.from("user_locations")
		.select("*")
		.order("timestamp", { ascending: false });
	if (error) throw error;
	return data;
};

export default function Locations() {
	const { data: locations, error } = useSWR<Location[]>(
		"user_locations",
		fetcher
	);

	useEffect(() => {
		if (error) console.error("Error fetching locations:", error);
	}, [error]);

	return (
		<ProtectedRoute>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
					User Locations
				</h1>
				<div
					className='bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden'
					style={{ height: "600px" }}
				>
					{locations ? (
						<MapWithNoSSR locations={locations} />
					) : (
						<p>Loading...</p>
					)}
				</div>
			</div>
		</ProtectedRoute>
	);
}
