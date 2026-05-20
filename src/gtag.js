const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_TAG;

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

// Googleタグマネージャ本体の読み込み
if (!window.gtagScriptLoaded) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    window.gtagScriptLoaded = true;
}
