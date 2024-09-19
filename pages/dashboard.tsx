import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Dashboard() {
	const [sessions, setSessions] = useState([]);

	useEffect(() => {
		fetchSessions();
	}, []);

	async function fetchSessions() {
		const { data, error } = await supabase
			.from("user_session")
			.select("*")
			.order("login_time", { ascending: false });

		if (error) {
			console.error("Error fetching sessions:", error);
		} else {
			setSessions(data);
		}
	}

	return (
		<div className='container mx-auto px-4'>
			<h1 className='text-2xl font-bold mb-4'>User Sessions</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white'>
					<thead>
						<tr>
							<th className='px-4 py-2'>Username</th>
							<th className='px-4 py-2'>Login Time</th>
							<th className='px-4 py-2'>Logout Time</th>
							<th className='px-4 py-2'>Status</th>
						</tr>
					</thead>
					<tbody>
						{sessions.map((session) => (
							<tr key={session.id}>
								<td className='border px-4 py-2'>{session.username}</td>
								<td className='border px-4 py-2'>
									{new Date(session.login_time).toLocaleString()}
								</td>
								<td className='border px-4 py-2'>
									{session.logout_time
										? new Date(session.logout_time).toLocaleString()
										: "N/A"}
								</td>
								<td className='border px-4 py-2'>
									{session.is_active ? "Active" : "Inactive"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
