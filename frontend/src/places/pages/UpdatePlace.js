import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import {useHttpClient} from '../../shared/hooks/http-hook';
import './PlaceForm.css';


export default function UpdatePlace() {

    const authCtx = useContext(AuthContext);
    
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();
    
    const placeId = useParams().placeId;
    
    const [formState, inputHandler, setFormData] = useForm({    //setFormData function is used to initialize the input
        title: {                //fields once the data is retrieved from the backend.
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
    }, 
    false
    );

    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchPlace() {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/api/places/${placeId}`);
                setLoadedPlace(responseData.place);
                setFormData({
                    title: {
                        value: responseData.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.description,
                        isValid: true
                    },
                }, true);
            } catch (err) {};
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);
    
    async function placeUpdateSubmitHandler(event) {
        event.preventDefault();
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                },
            );
            navigate('/' + authCtx.userId + '/places');
        } catch (err) {};
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner asOverlay />
            </div>
        );
    }
    
    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }
    
    
    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && (
            <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText='Please enter a valid title.'
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true}
                    /> 
            <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid description (at least 5 characters).'
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                    /> 
                <Button type='submit' disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>)}
        </>
    );
};



// const DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Eiffel Tower',
//         description: 'The famous tower in Paris!',
//         imageUrl: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg',
//         address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
//         location: {
//             lat: 48.8584,
//             lng: 2.2945
//         },
//         creator: 'u1' 
//     },
//     {
//         id: 'p2',
//         title: 'Delicate Arch',
//         description: "Utah's Delicate Arch!",
//         imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Delicate_arch_sunset.jpg/1280px-Delicate_arch_sunset.jpg',
//         address: 'Arches National Park, Moab, Utah, USA',
//         location: {
//             // lat: 38.743600,
//             // lng: -109.499300
//             lat: 38.7436,
//             lng: -109.4993
//         },
//         creator: 'u2'
//     }
// ];