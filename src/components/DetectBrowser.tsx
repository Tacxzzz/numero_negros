import { useEffect } from "react";

const useBrowserCheck = () => {
    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isNotChrome = !/Chrome/.test(userAgent) || /OPR|Edg|Brave|Vivaldi/.test(userAgent);
        const isMessengerWebview = /FBAN|FBAV|Instagram/.test(userAgent);

        if (isNotChrome || isMessengerWebview) {
            // Attempt to redirect to Chrome if possible
            const currentUrl = window.location.href;
            const chromeUrl = `googlechrome://${currentUrl.replace(/^https?:\/\//, "")}`;
            
            // Open in Chrome if possible
            window.location.href = chromeUrl;

            // If it fails, show a message
            setTimeout(() => {
                alert("For the best experience, please open this link in the Chrome browser.");
            }, 1000);
        }
    }, []);
};

export default useBrowserCheck;