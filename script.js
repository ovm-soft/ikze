// Synchronizacja suwaków i pól tekstowych
function syncInput(id, value) {
    // Sprawdzenie minimalnej wartości dla czasu wpłat
    if (id === 'czasWplat' && value < 5) {
        value = 5;
    }
    document.getElementById(id).value = value;
    const valSpan = document.getElementById(id + 'Val');
    if (valSpan) {
        valSpan.innerText = id === 'stopaZwrotu' ? value + '%' : value;
    }
    calculate();
}

function syncRange(id, value) {
    if (id === 'czasWplat' && value < 5) {
        value = 5;
    }
    const rangeElem = document.getElementById(id + 'Range');
    if (rangeElem) {
        rangeElem.value = value;
    }
    const valSpan = document.getElementById(id + 'Val');
    if (valSpan) {
        valSpan.innerText = value;
    }
    calculate();
}

function resetDefaults() {
    document.getElementById('czasWplat').value = 17;
    document.getElementById('czasWplatRange').value = 17;
    document.getElementById('czasWplatVal').innerText = '17';

    document.getElementById('oplataRoczna').value = 5000;
    document.getElementById('stawkaPit').value = 19;

    document.getElementById('stopaZwrotuRange').value = 5;
    document.getElementById('stopaZwrotuVal').innerText = '5%';

    calculate();
}

// Zmiana motywu / designu strony
function changeTheme(theme) {
    document.body.className = "bg-slate-50 text-slate-800 h-full min-h-screen flex flex-col justify-between";
    
    if (theme === 'dark') {
        document.body.classList.add('bg-slate-900', 'text-slate-100');
        document.querySelectorAll('section, header, footer').forEach(el => {
            el.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-100');
            el.classList.remove('bg-white');
        });
    } else {
        document.querySelectorAll('section, header, footer').forEach(el => {
            el.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-100');
            el.classList.add('bg-white');
        });

        if (theme === 'ocean') {
            tailwind.config.theme.extend.colors.brand = {
                50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8'
            };
        } else if (theme === 'sunset') {
            tailwind.config.theme.extend.colors.brand = {
                50: '#fdf4f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d'
            };
        } else {
            tailwind.config.theme.extend.colors.brand = {
                50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d'
            };
        }
    }
    calculate();
}

// Główna funkcja obliczeniowa
function calculate() {
    let czasWplat = parseFloat(document.getElementById('czasWplat').value) || 5;
    if (czasWplat < 5) czasWplat = 5;

    const oplataRoczna = parseFloat(document.getElementById('oplataRoczna').value) || 0;
    const stawkaPit = parseFloat(document.getElementById('stawkaPit').value) / 100;
    const stopaZwrotu = parseFloat(document.getElementById('stopaZwrotuRange').value) / 100;

    // Aktualizacja widoku wartości suwaka stopy zwrotu
    document.getElementById('stopaZwrotuVal').innerText = (stopaZwrotu * 100) + '%';

    // Obliczenia
    const sumaWplat = oplataRoczna * czasWplat;
    const ulgaRoczna = oplataRoczna * stawkaPit;
    const ulgaOkres = ulgaRoczna * czasWplat;

    let biezacyKapital = 0;
    for (let i = 0; i < czasWplat; i++) {
        biezacyKapital = (biezacyKapital + oplataRoczna) * (1 + stopaZwrotu);
    }
    const zarobkiZInwestycji = biezacyKapital - sumaWplat;
    const kapitalKoncowy = sumaWplat + (zarobkiZInwestycji > 0 ? zarobkiZInwestycji : 0);

    const ryczałt10 = kapitalKoncowy * 0.10;
    const kwotaPoRyczalcie = kapitalKoncowy - ryczałt10;
    const bilansRyczalt = kwotaPoRyczalcie + ulgaOkres;
    const calkowitaKorzysc = ulgaOkres + (zarobkiZInwestycji > 0 ? zarobkiZInwestycji : 0) - ryczałt10;

    const formatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

    // Przypisanie wyników do elementów HTML
    document.getElementById('resCzas').innerText = czasWplat;
    document.getElementById('resOplataRoczna').innerText = formatter.format(oplataRoczna);
    document.getElementById('resOplata calyCzas').innerText = formatter.format(sumaWplat);
    document.getElementById('resUlgaRoczna').innerText = formatter.format(ulgaRoczna);
    document.getElementById('resUlgaOkres').innerText = formatter.format(ulgaOkres);
    document.getElementById('resZarobki').innerText = formatter.format(zarobkiZInwestycji > 0 ? zarobkiZInwestycji : 0);
    document.getElementById('resKapitalKoncowy').innerText = formatter.format(kapitalKoncowy);
    document.getElementById('resWypplataPodatek').innerText = "-" + formatter.format(ryczałt10);
    document.getElementById('resBilansRyczalt').innerText = formatter.format(bilansRyczalt);
    document.getElementById('resCalkowitaKorzysc').innerText = formatter.format(calkowitaKorzysc);
}

// Uruchomienie obliczeń przy starcie strony
window.onload = function() {
    calculate();
};