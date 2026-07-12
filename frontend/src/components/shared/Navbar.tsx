import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOut } from '@/hooks/useAuth';

const Navbar = ({
    userName,
    customName = 'My Boards'
}: {
    userName: string,
    customName?: string
}) => {

    const { mutate: handleSignOut } = useSignOut();

    return (
        <nav className="w-full max-w-4xl mx-auto bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between rounded-lg shadow-sm">
            <div className="flex items-center gap-6">
                <Link to='/boards' className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                        {customName}
                    </span>
                </Link>
            </div>
            <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-500 truncate max-w-40">
                    {userName}
                </span>
                <Button
                    className='cursor-pointer'
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSignOut()}
                >
                    Sign out
                </Button>
            </div>
        </nav>
    );
}

export default Navbar;