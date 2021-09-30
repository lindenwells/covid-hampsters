import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, logout } from "../firebase"
import { useHistory } from "react-router-dom"

function UserPage() {
    const [user, loading, error] = useAuthState(auth);
    const history = useHistory();
    
    //window.alert(user.uid);
    // const docRef = db.collection("users").doc(user.uid);
    //docRef.get().then(
        //(doc) => {
            //if (doc.exists) {
                //window.alert(doc.data());
            //} else {
                //window.alert("No such user!");
            //}
            
        //}
    // )
    
    useEffect(
        () => {
            if (loading) {
                return;
            }
            //if (!user) {
                //window.alert("you have signed out!");
                //history.replace("/");
            //}
        }
    )

    return (
        
        <div>
            <div className='userInfo'>
                <ul>
                    <li>Username: {user.email}</li>
                    <li>Email: {user.email}</li>
                </ul>
            </div>
            <div className='logout'>
                <button onClick = {() => {
                    logout();
                    history.replace("/");
                    }}>
                    Signout
                </button>
            </div>
        </div>
    );
}

export default UserPage;