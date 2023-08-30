import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useHttpClient() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);      //this array is setup with 'useRef' to persist beyone re-renders; this will contain an array of AbortControllers
                                                //we use useRef instead of useState because we don't want the component to re-render with updates to the array
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();    //creates a new AbortController;  abort controllers allow us to abort a request should the current componenet,
                                                        //which calls this custom hook, unmount before we receive a response
        activeHttpRequests.current.push(httpAbortCtrl); //new abort controller is added to the 'activeHttpRequests' array, which will not be re-intialized when this 
                                                        //function runs again, thanks to 'useRef'
        try {
            const response = await fetch(url, {
                method: method,
                body: body,
                headers: headers,
                signal: httpAbortCtrl.signal            //the 'signal' property links our abort controller to this specific request
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);   //this filter will remove the abort controller of
                                                        //the request that just completed, from the activeHttpRequests array
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch(err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    function clearError() {
        setError(null);
    };

    function clearErrorAndMove(path) {
        setError(null);
        navigate(path);
    };

    useEffect(() => {       //useEffect is used here to utilize the cleanup function;  the cleanup function will abort all requests, when the component  
        return () => {      //that called our custom hook, unmounts.
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return {isLoading, error, sendRequest, clearError, clearErrorAndMove};
};