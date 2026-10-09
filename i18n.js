const currentLang = getCurrentLang();
const knownLangs = ['pl', 'uk', 'en', 'fr', 'de'];

function changeLanguage(selectedLang) {
    let targetUrl;

    const pathSegments = getCurrentPathSegments()
    if (pathContainsKnownLang(pathSegments)) {
        // Replace current language folder in path: /pl/page -> /uk/page
        updateLangInPathSegments(pathSegments, selectedLang);
        targetUrl = '/' + pathSegments.join('/') + '/';
    } else {
        // Currently at root -> navigate to /<lang>/
        targetUrl = '/ikze/' + selectedLang + '/';
    }

    // Perform redirect
    window.location.href = targetUrl;
}

function getCurrentLang() {
    let extractedLang = extractLangFromPathSegments(getCurrentPathSegments());
    return extractedLang == null ? 'pl' : extractedLang;
}

function getCurrentPathSegments() {
    // Determine target URL based on selected language
    // Assumes folder structure: /pl/index.html, /uk/index.html, etc.
    const currentPath = window.location.pathname;

    // Check if currently inside a language folder (e.g., /pl/, /uk/)
    return currentPath.split('/').filter(Boolean);
}

function pathContainsKnownLang(pathSegments) {
    return pathSegments.length > 1 && knownLangs.includes(extractLangFromPathSegments(pathSegments));
}

function extractLangFromPathSegments(pathSegments) {
    return pathContainsKnownLang(pathSegments) ? pathSegments[1] : null;
}

function updateLangInPathSegments(pathSegments, selectedLang) {
    pathSegments[1] = selectedLang;
}