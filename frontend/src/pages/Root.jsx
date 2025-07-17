import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import { AuthProvider } from '@context/AuthContext';
import Inventario from './Inventario';

function Root()  {
return (
    <AuthProvider>
        <PageRoot/>
    </AuthProvider>
);
}

function PageRoot() {
return (
    <>
        <Navbar />
        <Outlet />
    </>
);
}

export default Root;