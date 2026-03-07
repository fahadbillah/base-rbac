import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@ai-sdlc/ui";
import React from "react";

export default function LoginPage() {
    const { loginWithRedirect } = useAuth0();
    return (
        <main>
            <h1>Admin Portal</h1>
            <Button onClick={() => loginWithRedirect()}>Sign In</Button>
        </main>
    );
}
