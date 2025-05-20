import React from "react";

const OpenInExternalBrowser = () => {

    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    const handleOpenInChrome = () => {
        // Webview detection: Messenger, Instagram, Facebook, etc.
        const isWebview = ((): boolean => {
        return (
            (isIOS && !/Safari/i.test(userAgent)) || // iOS webview won't include 'Safari'
            (isAndroid && /wv/.test(userAgent)) ||   // Android webview has 'wv'
            /\bFBAN|FBAV|Instagram\b/.test(userAgent) // FB or IG in-app browsers
        );
        })();


        if (isAndroid && isWebview) {
            // Native Android browser – open with intent to Chrome
            window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;
        } else if (isIOS && isWebview) {
            // iOS Messenger or other webview – show message or try new tab
            alert("Please open this page in Safari for the best experience.");
        } else if (isIOS) {
            // Native iOS browser – open directly
            window.open(currentUrl, "_blank");
        } else {
            // Fallback for others
            window.open(currentUrl, "_blank");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{
                display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
                textAlign: "center",
                zIndex: 9999,
                backgroundColor: "#FFE8E8",
                color: "#B00020",
                padding: "16px 24px",
                borderRadius: "8px",
                border: "1px solid #B00020",
                maxWidth: "80%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
                
                <p> {isAndroid ? "⚠️ Opening this link on Messenger is not recommended. Please use another browser for best experience." 
                    : isIOS
                    ? "⚠️ You're using an in-app browser (like Messenger). Please tap the ••• menu and choose 'Open in Safari' to continue."
                    : "Please open this link in an external browser."}</p>
                {isAndroid && (
                    <button
                    onClick={handleOpenInChrome}
                    style={{
                        backgroundColor: "#4285F4",
                        color: "#fff",
                        padding: "12px 24px",
                        marginTop: "10px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                    >
                        Open in External Browser
                    </button>
                )}
                
            </div>
        </div>
    );
};

export default OpenInExternalBrowser;
