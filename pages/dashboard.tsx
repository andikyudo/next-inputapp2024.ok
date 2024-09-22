import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

interface Session {
	id: string;
	username: string;
	login_time: string;
	logout_time: string | null;
	is_active: boolean;
	nama: string;
}

export default function Dashboard() {
	const [sessions, setSessions] = useState<Session[]>([]);

	useEffect(() => {
		fetchSessions();
	}, []);

	const fetchSessions = async () => {
		try {
			const { data, error } = await supabase
				.from("user_session")
				.select(
					`
			  *,
			  custom_users!inner(nama)
			`
				)
				.order("login_time", { ascending: false });

			if (error) throw error;

			// Group by username and take the latest entry
			const uniqueSessions = data?.reduce((acc, current) => {
				const x = acc.find((item) => item.username === current.username);
				if (!x) {
					return acc.concat([{ ...current, nama: current.custom_users.nama }]);
				} else {
					return acc;
				}
			}, []);

			setSessions(uniqueSessions);
		} catch (error) {
			console.error("Error fetching sessions:", error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
				Monitoring Command Center
			</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white dark:bg-gray-800'>
					<thead className='bg-gray-100 dark:bg-gray-700'>
						<tr>
							<th className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
								Username
							</th>
							<th className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
								Name
							</th>
							<th className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
								Login Time
							</th>
							<th className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
								Logout Time
							</th>
							<th className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
								Status
							</th>
						</tr>
					</thead>
					<tbody>
						{sessions.map((session) => (
							<tr key={session.id}>
								<td className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
									{session.username}
								</td>
								<td className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
									{session.nama}
								</td>
								<td className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
									{new Date(session.login_time).toLocaleString()}
								</td>
								<td className='py-2 px-4 border-b dark:border-gray-600 text-gray-800 dark:text-white'>
									{session.logout_time
										? new Date(session.logout_time).toLocaleString()
										: "N/A"}
								</td>
								<td
									className={`py-2 px-4 border-b dark:border-gray-600 ${
										session.is_active ? "text-green-600" : "text-red-600"
									}`}
								>
									{session.is_active ? "Active" : "Logged Out"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
