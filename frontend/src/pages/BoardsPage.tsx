import { useSignOut } from "@/hooks/useAuth";

const BoardsPage = () => {

    const { mutate } = useSignOut();

    const handleSignOut = () => {
        mutate()
    }

    return (
        <>
            <div>BoardsPage</div>
            <button onClick={handleSignOut}>Sign out</button>
        </>
    )
}

export default BoardsPage;