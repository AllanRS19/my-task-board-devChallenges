import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import BoardsPage from './pages/BoardsPage';
import BoardDetailsPage from './pages/BoardDetailsPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/boards/:id" element={<BoardDetailsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;