import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNavigation from "../AccountNavigation";

export default function AccountPage(){
    const [redirect, setRedirect] = useState(null);
    const {ready,user,setUser}=useContext(UserContext);

    
    let {subpage}=useParams();

    if(subpage===undefined){
        subpage='profile';
    }


    async function logout(){
        await axios.post('/logout');
        console.log('Logged out successfully');
        setRedirect('/');
        setUser(null);
    }


    if(!ready){
        return 'Loading ...';
    }

    if(ready&&!user&&!redirect){
        return <Navigate to={'/login'}/>
    }




   
    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        <div>
            <AccountNavigation/>
            {subpage==='profile'&&(
                <div className="text-center max-w-lg mx-auto">
                    Logged In As {user.name} ({user.email})<br/>
                    <button name="logoutbtn" className= "bg-[#F5385D] w-70 rounded-full pt-2 pb-2 mt-4 text-white" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === 'places' &&(
                <div>
                    <PlacesPage/>
                </div>
            )}
        </div>
    );
}