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
