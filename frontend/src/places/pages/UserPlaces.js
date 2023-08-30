import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function UserPlaces() {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearErrorAndMove} = useHttpClient();

    const userId = useParams().userId;

    useEffect(() => {
        async function fetchPlaces() {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
            } catch (err) {};
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    function placeDeletedHandler(deletedId) {
        setLoadedPlaces(prev => prev.filter(place => place.id !== deletedId));
    };

    function clearErrorHandler() {
        clearErrorAndMove('/');
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearErrorHandler} />
            {isLoading && <div className='center'><LoadingSpinner asOverlay /></div> }
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} deleteUpdate={placeDeletedHandler} />}
        </>
    );
};



//     const DUMMY_PLACES = [
//         {
//             id: 'p1',
//             title: 'Eiffel Tower',
//             description: 'The famous tower in Paris!',
//             imageUrl: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg',
//             address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
//             location: {
//                 lat: 48.8584,
//                 lng: 2.2945
//             },
//             creator: 'u1' 
//         },
//         {
//             id: 'p2',
//             title: 'Delicate Arch',
//             description: "Utah's Delicate Arch!",
//             imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Delicate_arch_sunset.jpg/1280px-Delicate_arch_sunset.jpg',
//             address: 'Arches National Park, Moab, Utah, USA',
//             location: {
//                 // lat: 38.743600,
//                 // lng: -109.499300
//                 lat: 38.7436,
//                 lng: -109.4993
//             },
//             creator: 'u2'
//         }
//     ];
// 