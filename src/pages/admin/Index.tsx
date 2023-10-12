import { useState, useContext, createContext } from "react";
import Footer from "../../components/Footer"
import Navbar from "../../components/NavbarAdmin"
import { Outlet } from 'react-router-dom'
import { AppContext } from "../../AppContext";
import jwt from 'jwt-decode';

export const userContext = createContext({})

function Admin() {
    const token = useContext(AppContext).token.data;
    let user = '';
    try {
        user = jwt(token)
    } catch (err) { }

    const [userData, setUserData] = useState(user);

    return (
        <userContext.Provider value={userData}>
            <div className="flex flex-col items-center justify-start relative text-lg">
                <Navbar className="bg-themeTeal mb-24" />
                <Outlet />
                <Footer />
            </div>
        </userContext.Provider>
    );
}

export default Admin;