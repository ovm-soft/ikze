function changeLanguage(selectedLang) {
    // Determine target URL based on selected language
    // Assumes folder structure: /pl/index.html, /uk/index.html, etc.
    const currentPath = window.location.pathname;

    // Check if currently inside a language folder (e.g., /pl/, /uk/)
    const pathSegments = currentPath.split('/').filter(Boolean);
    const knownLangs = ['pl', 'uk', 'en', 'fr', 'de'];

    let targetUrl;

    if (pathSegments.length > 1 && knownLangs.includes(pathSegments[1])) {
        // Replace current language folder in path: /pl/page -> /uk/page
        pathSegments[1] = selectedLang;
        targetUrl = '/' + pathSegments.join('/') + '/';
    } else {
        // Currently at root -> navigate to /<lang>/
        targetUrl = '/ikze/' + selectedLang + '/';
    }

    // Perform redirect
    window.location.href = targetUrl;
}