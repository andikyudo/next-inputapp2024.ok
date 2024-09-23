import React from "react";
import { useAuth } from "../utils/authContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user, router]);

	if (!user) {
		return null;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
