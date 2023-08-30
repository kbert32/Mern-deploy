import { useRef, useEffect } from 'react';

import './Map.css';

export default function Map(props) {

    const mapRef = useRef();

    const {center, zoom} = props;   //consts are created for useEffect dependencies so it does not re-render everytime the props
                                    //object changes, but only when the 'center' or 'zoom' properties change
    useEffect(() => {           //useEffect is used so that the map object creation and marker logic are not run
                                //until the ref's link to the div has been established
        const mapObj = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        });
    
        new window.google.maps.Marker({position: center, map: mapObj});
    }, [center, zoom]);

    
    return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>
}