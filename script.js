const minMaxValues = {
    'oplataRocznaMin': 100,
    'oplataRocznaMax': 11304
};

function getMin(name) {
    return minMaxValues[name + 'Min'];
}

function getMax(name) {
    return minMaxValues[name + 'Max'];
}

function limitInputMinMax(name, id) {
    const input = document.getElementById(id);
    if (input){
        inputMinValue = getMin(name);
        if(input.value < inputMinValue){
            input.value = inputMinValue;
        }

        inputMaxValue = getMax(name);
        if(input.value > inputMaxValue){
            input.value = inputMaxValue;
        }
    }
}

function syncSelectedValueLabel(id, value) {
    const valSpan = document.getElementById(id);
    if (valSpan) valSpan.innerText = value;

    calculate();
}

function syncRelatedInput(id, value) {
    const relatedInput = document.getElementById(id);
    if (relatedInput) relatedInput.value = value;

    calculate();
}

function resetDefaults() {
    document.getElementById('czasWplatRange').value = 10;
    document.getElementById('czasWplatVal').innerText = '10';

    document.getElementById('oplataRocznaRange').min = getMin('oplataRoczna');
    document.getElementById('oplataRocznaRange').max = getMax('oplataRoczna');
    document.getElementById('oplataRocznaRange').value = 5000;
    document.getElementById('oplataRocznaInput').value = 5000;
    document.getElementById('oplataRocznaVal').innerText = `5000`;

    document.getElementById('stawkaPit').value = 12;

    document.getElementById('stopaZwrotuRange').value = 5;
    document.getElementById('stopaZwrotuVal').innerText = '5%';

    calculate();
}

function getTypAkumulacji() {
    return document.querySelector('input[name="typAkumulacji"]:checked').id;
}

function calculateBiezacyKapitalProcentSkladany(czasWplat, wplataRoczna, stopaZwrotu) {
    let biezacyKapital = 0;
    for (let i = 0; i < czasWplat; i++) {
        biezacyKapital = (biezacyKapital + wplataRoczna) * (1 + stopaZwrotu);
    }
    return biezacyKapital;
}

function calculateBiezacyKapitalProcentProsty(czasWplat, wplataRoczna, stopaZwrotu) {
    let biezaceWplaty = 0;
    let biezacyZysk = 0;
    for (let i = 0; i < czasWplat; i++) {
        biezaceWplaty += wplataRoczna;
        biezacyZysk += (biezaceWplaty * (stopaZwrotu));
    }
    return biezaceWplaty + biezacyZysk;
}

const TAX_RATE = 0.19;

function calculateBiezacyKapitalProcentSkladany19(czasWplat, wplataRoczna, stopaZwrotu) {
    let biezacyKapital = 0;

    for (let i = 0; i < czasWplat; i++) {
        // Balance before growth
        let kapitalPrzedOdsetkami = biezacyKapital + wplataRoczna;

        // Gross gain earned this year
        let zyskBrutto = kapitalPrzedOdsetkami * stopaZwrotu;

        // Net gain after 19% Belka tax
        let zyskNetto = zyskBrutto * (1 - TAX_RATE);

        // Capital reinvested for the next year
        biezacyKapital = kapitalPrzedOdsetkami + zyskNetto;
    }

    return biezacyKapital;
}

function calculateBiezacyKapitalProcentProsty19(czasWplat, wplataRoczna, stopaZwrotu) {
    let biezaceWplaty = 0;
    let biezacyZyskNetto = 0;

    for (let i = 0; i < czasWplat; i++) {
        biezaceWplaty += wplataRoczna;

        // Gross gain on total deposits up to this year
        let zyskRocznyBrutto = biezaceWplaty * stopaZwrotu;

        // Net gain added to total profit
        biezacyZyskNetto += zyskRocznyBrutto * (1 - TAX_RATE);
    }

    return biezaceWplaty + biezacyZyskNetto;
}

function calculate() {
    let czasWplat = parseFloat(document.getElementById('czasWplatRange').value) || 5;
    if (czasWplat < 5) czasWplat = 5;

    const wplataRoczna = parseFloat(document.getElementById('oplataRocznaRange').value) || 0;
    const stawkaPit = parseFloat(document.getElementById('stawkaPit').value) / 100;

    let stopaZwrotuVal = parseFloat(document.getElementById('stopaZwrotuRange').value);
    if (isNaN(stopaZwrotuVal)) stopaZwrotuVal = 5;
    const stopaZwrotu = stopaZwrotuVal / 100;

    const stopaValSpan = document.getElementById('stopaZwrotuVal');
    if (stopaValSpan) stopaValSpan.innerText = stopaZwrotuVal + '%';

    const sumaWplat = wplataRoczna * czasWplat;
    const ulgaRoczna = wplataRoczna * stawkaPit;
    const ulgaOkres = ulgaRoczna * czasWplat;

    let biezacyKapitalIKZE = getTypAkumulacji() === 'typAkumulacjiTak'
        ? calculateBiezacyKapitalProcentSkladany(czasWplat, wplataRoczna, stopaZwrotu)
        : calculateBiezacyKapitalProcentProsty(czasWplat, wplataRoczna, stopaZwrotu);
    let biezacyKapitalNoIKZE = getTypAkumulacji() === 'typAkumulacjiTak'
        ? calculateBiezacyKapitalProcentSkladany19(czasWplat, wplataRoczna, stopaZwrotu)
        : calculateBiezacyKapitalProcentProsty19(czasWplat, wplataRoczna, stopaZwrotu);

    const zarobkiZInwestycjiIKZE = biezacyKapitalIKZE - sumaWplat;
    const zarobkiZInwestycjiNoIKZE = biezacyKapitalNoIKZE - sumaWplat;
    const kapitalKoncowyIKZE = biezacyKapitalIKZE;
    const kapitalKoncowyNoIKZE = biezacyKapitalNoIKZE;
    const ryczalt10 = kapitalKoncowyIKZE * 0.10;
    const kapitalKoncowyPoRyczalcieIKZE = kapitalKoncowyIKZE - ryczalt10;
    const calkowitaKorzyscIKZE = kapitalKoncowyPoRyczalcieIKZE + ulgaOkres - sumaWplat;
    const calkowitaKorzyscNoIKZE =  kapitalKoncowyNoIKZE - sumaWplat;

    const formatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    });

    // Przypisanie tekstowe wyników
    document.getElementById('resCzasIKZE').innerText = czasWplat;
    document.getElementById('resCzasNoIKZE').innerText = czasWplat;
    document.getElementById('resOplataRocznaIKZE').innerText = formatter.format(wplataRoczna);
    document.getElementById('resOplataRocznaNoIKZE').innerText = formatter.format(wplataRoczna);
    document.getElementById('resOplataCalyCzasIKZE').innerText = formatter.format(sumaWplat);
    document.getElementById('resOplataCalyCzasNoIKZE').innerText = formatter.format(sumaWplat);
    document.getElementById('resUlgaRoczna').innerText = formatter.format(ulgaRoczna);
    document.getElementById('resUlgaOkres').innerText = formatter.format(ulgaOkres);
    document.getElementById('resZarobkiIKZE').innerText = formatter.format(zarobkiZInwestycjiIKZE);
    document.getElementById('resZarobkiNoIKZE').innerText = formatter.format(zarobkiZInwestycjiNoIKZE);
    document.getElementById('resKapitalKoncowyIKZE').innerText = formatter.format(kapitalKoncowyIKZE);
    document.getElementById('resKapitalKoncowyNoIKZE').innerText = formatter.format(kapitalKoncowyNoIKZE);
    document.getElementById('resWyplataPodatek').innerText = '-' + formatter.format(ryczalt10);
    document.getElementById('kapitalKoncowyPoRyczalcieIKZE').innerText = formatter.format(kapitalKoncowyPoRyczalcieIKZE);
    document.getElementById('kapitalKoncowyPoRyczalcieNoIKZE').innerText = formatter.format(kapitalKoncowyNoIKZE);
    document.getElementById('resCalkowitaKorzyscIKZE').innerText = formatter.format(calkowitaKorzyscIKZE);
    document.getElementById('resCalkowitaKorzyscNoIKZE').innerText = formatter.format(calkowitaKorzyscNoIKZE);

    // --- Dynamiczne generowanie pasków wykresów w tabeli ---
    const maxValIKZE = Math.max(Math.abs(kapitalKoncowyIKZE), Math.abs(calkowitaKorzyscIKZE), 1);
    const maxValNoIKZE = Math.max(Math.abs(kapitalKoncowyNoIKZE), Math.abs(calkowitaKorzyscNoIKZE), 1);

    const updateBar = (elementId, value, maxVal, colorClass) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        // Wymuszenie stylów dla prawidłowego pozycjonowania pasków
        el.classList.add('relative', 'overflow-hidden');
        
        let pct = Math.min(Math.max((Math.abs(value) / maxVal) * 100, 0), 100);
        
        let bar = el.querySelector('.chart-bar');
        if (!bar) {
            bar = document.createElement('div');
            el.appendChild(bar);
        }
        
        bar.className = `chart-bar absolute inset-y-0 right-0 z-0 transition-all duration-300 opacity-35 pointer-events-none ${colorClass}`;
        bar.style.width = pct + '%';
    };

    updateBar('resOplataCalyCzasIKZE', sumaWplat, maxValIKZE, 'bg-blue-400');
    updateBar('resOplataCalyCzasNoIKZE', sumaWplat, maxValNoIKZE, 'bg-blue-400');
    updateBar('resUlgaOkres', ulgaOkres, maxValIKZE, 'bg-emerald-400');
    updateBar('resZarobkiIKZE', zarobkiZInwestycjiIKZE, maxValIKZE, 'bg-blue-400');
    updateBar('resZarobkiNoIKZE', zarobkiZInwestycjiNoIKZE, maxValNoIKZE, 'bg-blue-400');
    updateBar('resKapitalKoncowyIKZE', kapitalKoncowyIKZE, maxValIKZE, 'bg-emerald-400');
    updateBar('resKapitalKoncowyNoIKZE', kapitalKoncowyNoIKZE, maxValNoIKZE, 'bg-emerald-400');
    updateBar('resWyplataPodatek', ryczalt10, maxValIKZE, 'bg-red-400');
    updateBar('resCalkowitaKorzyscIKZE', calkowitaKorzyscIKZE, maxValIKZE, 'bg-amber-500');
    updateBar('resCalkowitaKorzyscNoIKZE', calkowitaKorzyscNoIKZE, maxValNoIKZE, 'bg-amber-500');
}

// 1. Słownik tłumaczeń
const translations = {
    pl: {
        ikze: "IKZE",

        title: "Kalkulator IKZE",
        subtitle: "Optymalizacja podatkowa i emerytalna",
        theme_1: "Szmaragdowy (Zielony)",
        theme_2: "Oceaniczny (Niebieski)",
        theme_3: "Zachód słońca (Fiolet/Róż)",
        theme_4: "Ciemny (Dark Mode)",
        label_input_params: "Parametry wejściowe",
        reset_default_btn: "Resetuj domyślne",
        label_years: "Czas dokonywania wpłat (lata):",
        label_years_rules: "Aby wypłacić pieniądze na preferencyjnych warunkach (10% od całej wypłacanej kwoty), trzeba ukończyć 65 lat i dokonywać wpłat w co najmniej 5 dowolnych latach kalendarzowych.",
        label_annual_deposit: "Wpłata roczna:",
        label_tax_rate: "Stawka podatku:",
        label_tax_rate_12: "12% (pierwszy próg podatkowy)",
        label_tax_rate_32: "32% (drugi próg podatkowy)",
        label_tax_rate_19: "19% (podatek liniowy / zyski kapitałowe)",
        tax_rate_nuance_1: "Przekroczenie progu podatkowego nie zawsze daje 32% korzyści od całej wpłaty.",
        tax_rate_nuance_2: "Przy podstawie opodatkowania 125 000 zł i wpłacie rocznej 10 000 zł: 5 000 zł odliczenia zmniejsza dochód objęty stawką 32%, a kolejne 5 000 zł – stawką 12%.",
        tax_rate_nuance_3: "Oszczędność wynosi wtedy: 5 000 zł × 32% + 5 000 zł × 12% = 2 200 zł.",
        tax_rate_nuance_4: "Natomiast przy podstawie opodatkowania 130 000 zł oszczędność wynosi: 10 000 zł × 32% = 3 200 zł.",
        label_return_rate: "Szacowany zysk roczny (obligacje, akcje, itp.):",
        label_return_calculation_type: "Typ naliczania zysku:",
        radio_return_calculation_type_accu: "% od akumulacji zysku (procent składany)",
        radio_return_calculation_type_simple: "% bez akumulacji (procent prosty)",
        return_calculation_type_comment: "Składany - zysk generuje kolejny zysk. Prosty - zysk liczony zawsze od samej sumy wpłat.",
        env_no_server: "Bez serwera",
        env_local: "Działa lokalnie w przeglądarce",

        results_title: "Wyniki symulacji",
        results_no_ikze: "Bez IKZE",
        results_label_years_2: "Czas dokonywania wpłat (lata)",
        results_deposits_section: "Wpłaty",
        results_1_year: "za rok",
        results_all_years: "za cały okres",
        results_tax_deduction: "Ulga podatkowa",
        results_na: "Nie dotyczy",
        results_invest: "Inwestowanie",
        results_all_years_earn: "Zarobki za cały okres",
        results_summary: "Podsumowanie",
        results_final_benefit_brutto: "Kapitał końcowy BRUTTO (wpłaty + zarobki)",
        results_10_percent_tax: "Podatek ryczałtowy (-10% od kapitału końcowego)",
        results_final_benefit_netto: "Kapitał końcowy NETTO (po ryczałcie)",
        results_total_benefit: "Czysty zysk",
        results_total_benefit_comment: "(NETTO - wpłaty[ + ulga])",
        results_print: "Drukuj / Zapisz PDF",

        info_title: "Ciekawostki",
        info_ikze_is: "(Indywidualne Konto Zabezpieczenia Emerytalnego) to sposób na dobrowolne i prywatne oszczędzanie pieniędzy na przyszłą emeryturę.",
        info_main_pros: "Najważniejsze zalety:",
        info_zwrot_podatku: "Zwrot podatku:",
        info_zwrot_podatku_text: "wpłacone środki odliczasz od dochodu i uzyskujesz zwrot z Urzędu Skarbowego.",
        info_brak_belki: "Brak podatku Belki:",
        info_brak_belki_text: "Twoje zyski nie są objęte 19% podatkiem od zysków kapitałowych.",
        info_ca_jeszcze_warto: "Co jeszcze warto wiedzieć o wpłatach?",
    },

    uk: {
        ikze: "IKZE",

        title: "Калькулятор IKZE",
        subtitle: "Податкова та пенсійна оптимізація",
        theme_1: "Смарагдовий (Зелений)",
        theme_2: "Океанічний (Синій)",
        theme_3: "Захід сонця (Фіолетовий/Рожевий)",
        theme_4: "Темний (Dark Mode)",
        label_input_params: "Вхідні параметри",
        reset_default_btn: "Скинути до початкових",
        label_years: "Період внесення коштів (роки):",
        label_years_rules: "Щоб виплатити кошти на пільгових умовах (10% від усієї суми виплати), необхідно досягти 65 років та вносити внески щонайменше протягом 5 будь-яких календарних років.",
        label_annual_deposit: "Щорічний внесок:",
        label_tax_rate: "Ставка податку:",
        label_tax_rate_12: "12% (перша податкова ставка)",
        label_tax_rate_32: "32% (друга податкова ставка)",
        label_tax_rate_19: "19% (лінійний податок / прибуток від капіталу)",
        tax_rate_nuance_1: "Перевищення податкового порогу не завжди дає 32% вигоди від усієї суми внеску.",
        tax_rate_nuance_2: "При оподатковуваній базі 125 000 zł та річному внеску 10 000 zł: 5 000 zł відрахування зменшує дохід за ставкою 32%, а наступні 5 000 zł – за ставкою 12%.",
        tax_rate_nuance_3: "Економія в такому разі становить: 5 000 zł × 32% + 5 000 zł × 12% = 2 200 zł.",
        tax_rate_nuance_4: "А при оподатковуваній базі 130 000 zł економія становить: 10 000 zł × 32% = 3 200 zł.",
        label_return_rate: "Очікуваний річний прибуток (облігації, акції тощо):",
        label_return_calculation_type: "Тип нарахування прибутку:",
        radio_return_calculation_type_accu: "% від накопиченого прибутку (складний відсоток)",
        radio_return_calculation_type_simple: "% без накопичення (простий відсоток)",
        return_calculation_type_comment: "Складний - прибуток генерує наступний прибуток. Простий - прибуток завжди рахується лише від суми внесків.",
        env_no_server: "Без сервера",
        env_local: "Працює локально в браузері",

        results_title: "Результати симуляції",
        results_no_ikze: "Без IKZE",
        results_label_years_2: "Період внесення коштів (роки)",
        results_deposits_section: "Внески",
        results_1_year: "за рік",
        results_all_years: "за весь період",
        results_tax_deduction: "Податкова пільга",
        results_na: "Не застосовується",
        results_invest: "Інвестування",
        results_all_years_earn: "Прибуток за весь період",
        results_summary: "Підсумок",
        results_final_benefit_brutto: "Кінцевий капітал БРУТТО (внески + прибуток)",
        results_10_percent_tax: "Фіксований податок (-10% від кінцевого капіталу)",
        results_final_benefit_netto: "Кінцевий капітал НЕТТО (після податку)",
        results_total_benefit: "Чистий прибуток",
        results_total_benefit_comment: "(НЕТТО - внески[ + пільга])",
        results_print: "Друкувати / Зберегти в PDF",

        info_title: "Цікаво знати",
        info_ikze_is: "(Indywidualne Konto Zabezpieczenia Emerytalnego / Індивідуальний рахунок пенсійного забезпечення) — це спосіб добровільного та приватного накопичення коштів на майбутню пенсію.",
        info_main_pros: "Основні переваги:",
        info_zwrot_podatku: "Повернення податку:",
        info_zwrot_podatku_text: "внесені кошти ви відраховуєте від доходу та отримуєте повернення від податкової інспекції.",
        info_brak_belki: "Відсутність податку Belki:",
        info_brak_belki_text: "ваш прибуток не підлягає 19% податку на доходи від приросту капіталу.",
        info_ca_jeszcze_warto: "Що ще варто знати про внески?",
    },

    en: {
        title: "IKZE Calculator",
        subtitle: "Tax & Pension Optimization",
        input_params: "Input Parameters",
        reset_default_btn: "Reset Defaults",
        label_years: "Contribution Period (years):",
        label_annual_deposit: "Annual Deposit:",
        label_tax_rate: "Tax Rate:",
        label_return_rate: "Estimated Annual Return:",
        results_title: "Simulation Results",
        no_ikze: "Without IKZE",
        total_benefit: "Total Benefit",
        not_applicable: "N/A",
        locale: "en-US",
        currency: "PLN"
    },
    fr: {
        title: "Calculateur IKZE",
        subtitle: "Optimisation fiscale et retraite",
        input_params: "Paramètres d'entrée",
        reset_default_btn: "Réinitialiser",
        label_years: "Période de versement (années):",
        label_annual_deposit: "Dépôt annuel:",
        label_tax_rate: "Taux d'imposition:",
        label_return_rate: "Rendement annuel estimé:",
        results_title: "Résultats de la simulation",
        no_ikze: "Sans IKZE",
        total_benefit: "Bénéfice total",
        not_applicable: "Non applicable",
        locale: "fr-FR",
        currency: "PLN"
    },
    de: {
        title: "IKZE-Rechner",
        subtitle: "Steuer- und Altersvorsorgeoptimierung",
        input_params: "Eingabeparameter",
        reset_default_btn: "Standardwerte zurücksetzen",
        label_years: "Einzahlungsdauer (Jahre):",
        label_annual_deposit: "Jährliche Einzahlung:",
        label_tax_rate: "Steuersatz:",
        label_return_rate: "Geschätzte jährliche Rendite:",
        results_title: "Simulationsergebnisse",
        no_ikze: "Ohne IKZE",
        total_benefit: "Gesamtvorteil",
        not_applicable: "Nicht zutreffend",
        locale: "de-DE",
        currency: "PLN"
    }
};

let currentLang = 'pl';

// 2. Funkcja zmiany języka
function changeLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;

    // Podmiana tekstów w elementach posiadających data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

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

window.onload = function () {
    changeLanguage(currentLang);
    resetDefaults();
    calculate();
};