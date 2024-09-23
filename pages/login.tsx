import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/authContext";
import { supabase } from "../utils/supabase";

export default function Login() {
	const [nrp, setNrp] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const { data, error } = await supabase
				.from("custom_users")
				.select("*")
				.eq("nrp", nrp)
				.single();

			if (error) throw error;

			if (data && data.password === password) {
				login(data);
				router.push("/dashboard");
			} else {
				setError("Invalid NRP or password");
			}
		} catch (error) {
			setError("An error occurred. Please try again.");
			console.error("Login error:", error);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='px-8 py-6 mt-4 text-left bg-white shadow-lg'>
				<h3 className='text-2xl font-bold text-center'>
					Login to your account
				</h3>
				<form onSubmit={handleSubmit}>
					<div className='mt-4'>
						<div>
							<label className='block' htmlFor='nrp'>
								NRP
							</label>
							<input
								type='text'
								placeholder='NRP'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
								value={nrp}
								onChange={(e) => setNrp(e.target.value)}
								required
							/>
						</div>
						<div className='mt-4'>
							<label className='block' htmlFor='password'>
								Password
							</label>
							<input
								type='password'
								placeholder='Password'
								className='w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className='flex items-baseline justify-between'>
							<button className='px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900'>
								Login
							</button>
						</div>
					</div>
				</form>
				{error && <p className='text-red-500 mt-4'>{error}</p>}
			</div>
		</div>
	);
}
