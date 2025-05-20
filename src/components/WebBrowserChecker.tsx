import { useState, useEffect } from "react";

const useBrowserCheck = () => {
    const [isMessengerWebview, setIsMessengerWebview] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isMessenger = /FBAN|FBAV|Instagram/.test(userAgent);
        
        if (isMessenger) {
            setIsMessengerWebview(true);
        }
    }, []);

    return isMessengerWebview;
};

export default useBrowserCheck;