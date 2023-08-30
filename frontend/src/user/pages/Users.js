import { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function Users() {

    const [loadedUsers, setLoadedUsers] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/api/users');
                
                setLoadedUsers(responseData.users);
            } catch (err) {}
        };

        fetchUsers();
    }, [sendRequest]);  //important to have 'useCallback' on our sendRequest function within the custom hook to avoid an infinite loop
    
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'><LoadingSpinner asOverlay /></div>}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </>
    );
};




//     const USERS = [
//         {
//             id: 'u1',
//             name: 'Free Willy',
//             image: 'https://i.pinimg.com/originals/af/96/85/af968510547b7a5aa6535a67cb8bf974.jpg',
//             places: 3
//         },
//         {
//             id: 'u2',
//             name: 'Max Headroom',
//             image: 'https://yt3.ggpht.com/-52c1nB8VU1Y/AAAAAAAAAAI/AAAAAAAAAAA/q9cYXYzfXH0/s900-c-k-no-mo-rj-c0xffffff/photo.jpg',
//             places: 330000000
//         }
// ];