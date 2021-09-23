import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase"
import { useHistory } from "react-router-dom"

function UserPage() {
    const [user, loading, error] = useAuthState(auth);
    const history = useHistory();
    useEffect(
        () => {
            if (loading) {
                return;
            }
            if (!user) {
                window.alert("you have signed out!");
                history.replace("/");
            }
        }
    )
    return (
        <div>
            <div className='userInfo'>
                <ul>
                    <li>Username: </li>
                    <li>Email: </li>
                </ul>
            </div>
            <div className='logout'>
                <button onClick = {() => logout()}>
                    Signout
                </button>
            </div>
        </div>
    );
}

export default UserPage;