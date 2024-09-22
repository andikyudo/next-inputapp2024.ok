import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabase";

export default function Login() {
	const [nrp, setNrp] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const { data: existingSession, error: sessionError } = await supabase
				.from("user_session")
				.select("*")
				.eq("username", nrp)
				.eq("is_active", true)
				.single();

			if (sessionError && sessionError.code !== "PGRST116") {
				throw sessionError;
			}

			if (existingSession) {
				const { error: updateError } = await supabase
					.from("user_session")
					.update({ login_time: new Date().toISOString() })
					.eq("id", existingSession.id);

				if (updateError) throw updateError;
			} else {
				const { error: insertError } = await supabase
					.from("user_session")
					.insert({
						username: nrp,
						login_time: new Date().toISOString(),
						is_active: true,
					});

				if (insertError) throw insertError;
			}

			console.log("Login berhasil, sesi disimpan/diperbarui");
			router.push("/dashboard");
		} catch (error) {
			console.error("Error selama login:", error);
			alert("Terjadi kesalahan saat login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900'>
			<div className='px-8 py-6 mt-4 text-left bg-white dark:bg-gray-800 shadow-lg'>
				<h3 className='text-2xl font-bold text-center text-gray-800 dark:text-white'>
					Login Aplikasi Voting
				</h3>
				<form onSubmit={handleLogin}>
					<div className='mt-4'>
						<div>
							<label
								className='block text-gray-700 dark:text-gray-200'
								htmlFor='nrp'
							>
								NRP
							</label>
							<input
								type='text'
								placeholder='NRP'
								id='nrp'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
								value={nrp}
								onChange={(e) => setNrp(e.target.value)}
								maxLength={8}
								required
							/>
						</div>
						<div className='mt-4'>
							<label className='block text-gray-700 dark:text-gray-200'>
								Password
							</label>
							<input
								type='password'
								placeholder='Password'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className='flex items-baseline justify-between'>
							<button
								type='submit'
								className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'
								disabled={loading}
							>
								{loading ? "Loading..." : "Login"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
