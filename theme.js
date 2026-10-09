function changeTheme(theme) {
    const body = document.body;
    const cards = document.querySelectorAll('section, header, footer');

    // 1. Definicje palet kolorów dla poszczególnych motywów
    const palettes = {
        emerald: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            accent: '#16a34a'
        },
        ocean: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#06b6d4',
            600: '#0284c7',
            700: '#0369a1',
            accent: '#0284c7'
        },
        sunset: {
            50: '#fdf2f8',
            100: '#fce7f3',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            accent: '#db2777'
        },
        dark: {
            50: '#1e293b',
            100: '#334155',
            500: '#4bf3a1',
            600: '#22c55e',
            700: '#16a34a',
            accent: '#22c55e'
        }
    };

    const selected = palettes[theme] || palettes.emerald;

    // 2. Aktualizacja konfiguracji Tailwind CDN na żywo
    if (window.tailwind) {
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: selected
                    }
                }
            }
        };
    }

    // 3. Obsługa trybu ciemnego vs jasnego na tło i karty
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        body.className = "bg-slate-900 text-slate-100 h-full min-h-screen flex flex-col justify-between transition-colors duration-300";
        cards.forEach(el => {
            el.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-100');
            el.classList.remove('bg-white');
        });
    } else {
        document.documentElement.classList.remove('dark');
        body.className = "bg-slate-50 text-slate-800 h-full min-h-screen flex flex-col justify-between transition-colors duration-300";
        cards.forEach(el => {
            el.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-100');
            el.classList.add('bg-white');
        });
    }

    // 4. Zmiana koloru suwaków (input range)
    document.querySelectorAll('input[type="range"]').forEach(input => {
        input.style.accentColor = selected.accent;
    });
}

