import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

export function App() {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <div>Loading...</div>;

    return (
        <BrowserRouter>
            <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
                    />
                </Routes>
            </React.Suspense>
        </BrowserRouter>
    );
}
