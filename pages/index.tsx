import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/authContext";

export default function Home() {
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			router.push("/dashboard");
		} else {
			router.push("/login");
		}
	}, [user, router]);

	return null;
}
