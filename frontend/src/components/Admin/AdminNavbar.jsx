import { FaUserShield } from "react-icons/fa6";
import "./AdminNavbar.css";

function AdminNavbar(){

    return(

        <nav className="admin-navbar">

            <h2>

                <FaUserShield />

                Admin Dashboard

            </h2>

        </nav>

    )

}

export default AdminNavbar;