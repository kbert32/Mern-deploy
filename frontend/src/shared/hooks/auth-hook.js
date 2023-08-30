import { useState, useEffect, useCallback } from "react";

let logouttimer;           

export function useAuth() {

    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [tokenExpirationTimer, setTokenExpirationTimer] = useState();
    
    const login = useCallback((uid, token, expiration) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate = expiration || new Date(new Date().getTime() + 1000 * 60 * 60);  //sets new expiration time if one does not already exist
        setTokenExpirationTimer(tokenExpirationDate);
        localStorage.setItem(
            'userData', 
            JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toISOString()}));  //stores user id, token, and expiration time in local storage
    }, []);
        
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationTimer(null);            //reset logout timer value
        localStorage.removeItem('userData');      //clears local storage on logout
    }, []); 
        
    useEffect(() => {
        if (token && tokenExpirationTimer) {
            logouttimer = setTimeout(logout, tokenExpirationTimer.getTime() - new Date().getTime());
        } else {
            clearTimeout(logouttimer);
        }
    }, [token, logout, tokenExpirationTimer]);
        
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
            }
    }, [login]);

    return {userId, token, login, logout};
};