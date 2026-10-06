function syncInput(id, value) {
    if (id === 'czasWplat' && value < 5) {
        value = 5;
    }

    const input = document.getElementById(id);
    if (input) {
        input.value = value;
    }

    const rangeElem = document.getElementById(id + 'Range');
    if (rangeElem) {
        rangeElem.value = value;
    }

    const valSpan = document.getElementById(id + 'Val');
    if (valSpan) {
        valSpan.innerText = (id === 'stopaZwrotu') ? value + '%' : value;
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
        valSpan.innerText = (id === 'stopaZwrotu') ? value + '%' : value;
    }

    calculate();
}

function resetDefaults() {
    document.getElementById('czasWplat').value = 17;
    document.getElementById('czasWplatRange').value = 17;
    document.getElementById('czasWplatVal').innerText = '17';

    document.getElementById('oplataRoczna').value = 5000;
    document.getElementById('stawkaPit').value = 19;

    document.getElementById('stopaZwrotu').value = 5;
    document.getElementById('stopaZwrotuRange').value = 5;
    document.getElementById('stopaZwrotuVal').innerText = '5%';

    calculate();
}

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
    }

    calculate();
}

function calculate() {
    let czasWplat = parseFloat(document.getElementById('czasWplat').value) || 5;
    if (czasWplat < 5) {
        czasWplat = 5;
    }

    const wplataRoczna = parseFloat(document.getElementById('oplataRoczna').value) || 0;
    const stawkaPit = parseFloat(document.getElementById('stawkaPit').value) / 100;

    let stopaZwrotuVal = parseFloat(document.getElementById('stopaZwrotu').value);
    if (isNaN(stopaZwrotuVal)) {
        stopaZwrotuVal = 5;
    }
    const stopaZwrotu = stopaZwrotuVal / 100;

    const stopaValSpan = document.getElementById('stopaZwrotuVal');
    if (stopaValSpan) {
        stopaValSpan.innerText = stopaZwrotuVal + '%';
    }

    const sumaWplat = wplataRoczna * czasWplat;
    const ulgaRoczna = wplataRoczna * stawkaPit;
    const ulgaOkres = ulgaRoczna * czasWplat;

    let biezacyKapital = 0;
    for (let i = 0; i < czasWplat; i++) {
        biezacyKapital = (biezacyKapital + wplataRoczna) * (1 + stopaZwrotu);
    }

    const zarobkiZInwestycji = biezacyKapital - sumaWplat;
    const kapitalKoncowy = biezacyKapital;
    const ryczalt10 = kapitalKoncowy * 0.10;
    const kwotaPoRyczalcie = kapitalKoncowy - ryczalt10;
    const bilansRyczalt = kwotaPoRyczalcie + ulgaOkres;
    const calkowitaKorzysc = ulgaOkres + zarobkiZInwestycji - ryczalt10;

    const formatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
    });

    document.getElementById('resCzas').innerText = czasWplat;
    document.getElementById('resOplataRoczna').innerText = formatter.format(wplataRoczna);
    document.getElementById('resOplataCalyCzas').innerText = formatter.format(sumaWplat);
    document.getElementById('resUlgaRoczna').innerText = formatter.format(ulgaRoczna);
    document.getElementById('resUlgaOkres').innerText = formatter.format(ulgaOkres);
    document.getElementById('resZarobki').innerText = formatter.format(zarobkiZInwestycji);
    document.getElementById('resKapitalKoncowy').innerText = formatter.format(kapitalKoncowy);
    document.getElementById('resWyplataPodatek').innerText = '-' + formatter.format(ryczalt10);
    document.getElementById('resBilansRyczalt').innerText = formatter.format(bilansRyczalt);
    document.getElementById('resCalkowitaKorzysc').innerText = formatter.format(calkowitaKorzysc);
}

window.onload = function () {
    calculate();
};