function changeLanguage(selectedLang) {
    // Determine target URL based on selected language
    // Assumes folder structure: /pl/index.html, /uk/index.html, etc.
    const currentPath = window.location.pathname;

    // Check if currently inside a language folder (e.g., /pl/, /uk/)
    const pathSegments = currentPath.split('/').filter(Boolean);
    const knownLangs = ['pl', 'uk', 'en', 'fr', 'de'];

    let targetUrl = 'ikze';

    if (pathSegments.length > 0 && knownLangs.includes(pathSegments[0])) {
        // Replace current language folder in path: /pl/page -> /uk/page
        pathSegments[0] = selectedLang;
        targetUrl += '/' + pathSegments.join('/') + '/';
    } else {
        // Currently at root -> navigate to /<lang>/
        targetUrl += '/' + selectedLang + '/';
    }

    // Perform redirect
    window.location.href = targetUrl;
}