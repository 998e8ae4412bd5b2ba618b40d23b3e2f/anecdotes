import React from 'react';
import Script from 'next/script';

const GoogleAnalytic = () => {
    return (
        <>
            <Script
                id="google-tag-manager"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-LKY8XVM4N3');
                    `,
                }}
            />
            <Script
                id="google-tag-manager-gtag-js"
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-LKY8XVM4N3"
                async
            />
        </>
    );
};

export default GoogleAnalytic;
