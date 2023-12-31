import { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

export default function Auth() {

    const authCtx = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    function switchModeHandler() {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined, 
                image: undefined
            }, 
            formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
        
    };

    async function loginHandler(event) {

        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/api/users/login', 
                    'POST', 
                    JSON.stringify({email: formState.inputs.email.value, password: formState.inputs.password.value}),
                    {'Content-Type': 'application/json'});
                                
                authCtx.login(responseData.userId, responseData.token);
            } catch(err) {}   
        } else {
            try {
                const formData = new FormData();                                //FormData is an API built into the browser which allows us to send 
                formData.append('email', formState.inputs.email.value);         //binary data
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);

                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/api/users/signup', 
                    'POST', 
                    formData                                                    //with FormData, the fetch API automatically sets up our headers
                );

                authCtx.login(responseData.userId, responseData.token);
            } catch (err) {}
        }       
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card className='authentication'>
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={loginHandler}>
                    {!isLoginMode && (
                        <Input
                        element='input'
                        id='name'
                        type='text'
                        label='Your name'
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText='Please enter a name.'
                        onInput={inputHandler}
                        />
                        )}
                    {!isLoginMode && <ImageUpload center id='image' onInput={inputHandler} errorText='Please provide an image.' />}
                    <Input
                        id='email'
                        element='input'
                        type='email'
                        label='Email'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='Please enter a valid email.'
                        onInput={inputHandler}
                        />
                    <Input
                        id='password'
                        element='input'
                        type='password'
                        label='Password'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Please enter a valid password (at least 6 characters).'
                        onInput={inputHandler}
                        />
                    <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'Login' : 'Signup'}</Button>
                </form>
                    <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'Signup' : 'Login'}</Button>
            </Card>
        </>
    );
};