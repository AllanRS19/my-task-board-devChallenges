import { useCurrentUser } from "@/hooks/useAuth";
import Navbar from "./Navbar";

const BoardsLayout = ({
    children
}: Readonly<{
    children: React.ReactNode
}>) => {

    const { data } = useCurrentUser();

    if (!data) return null;

    const { user } = data;

    return (
        <section className="animate-in fade-in-20 min-h-screen w-full max-w-4xl mx-auto py-8 px-8 md:px-0">
            <Navbar userName={user.name} />

            {children}
        </section>
    );
}

export default BoardsLayout;