import { useState } from "react";
import AuthForm from "../components/auth/form/AuthForm";
import { useCurrentUser } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AuthPage = () => {

    const [authScreen, setAuthScreen] = useState<'sign-in' | 'sign-up'>('sign-in');

    const { data } = useCurrentUser();

    if (data) return <Navigate to='/boards' />

    return (
        <section className="h-screen w-full">
            <AuthForm
                key={authScreen}
                authScreen={authScreen}
                setAuthScreen={setAuthScreen}
            />
        </section>
    )
}

export default AuthPage;