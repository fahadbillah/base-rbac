import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const UsersPage = React.lazy(() => import("./pages/UsersPage"));
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
                        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/users"
                        element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" replace />}
                    />
                </Routes>
            </React.Suspense>
        </BrowserRouter>
    );
}
