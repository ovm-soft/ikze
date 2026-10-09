function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

async function init() {
    try {
        await loadScript('/ikze/theme.js');
        await loadScript('/ikze/i18n.js');
        await loadScript('/ikze/calc.js');

        resetDefaults();
        calculate();
    } catch (err) {
        console.error(err);
    }
}

init();