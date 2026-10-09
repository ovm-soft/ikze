// Zmienna globalna przechowująca instancję wykresu
let profitChartInstance = null;

function buildProfitChart(isCompound, czasWplat, wplataRoczna, stopaZwrotu, ulgaRoczna, rokLabel, iKZELabel, noIKZELabel) {
    const labels = [];
    const dataIKZE = [];
    const dataNoIKZE = [];

    for (let t = 1; t <= czasWplat; t++) {
        labels.push(`${rokLabel} ${t}`);
        let wplatyT = wplataRoczna * t;
        let ulgaT = ulgaRoczna * t;

        // IKZE rok po roku
        let kapT_IKZE = isCompound
            ? calculateBiezacyKapitalProcentSkladany(t, wplataRoczna, stopaZwrotu)
            : calculateBiezacyKapitalProcentProsty(t, wplataRoczna, stopaZwrotu);
        let ryczaltT = kapT_IKZE * 0.10;
        let korzyscT_IKZE = (kapT_IKZE - ryczaltT) + ulgaT - wplatyT;
        dataIKZE.push(Math.round(korzyscT_IKZE));

        // Bez IKZE rok po roku
        let kapT_NoIKZE = isCompound
            ? calculateBiezacyKapitalProcentSkladany19(t, wplataRoczna, stopaZwrotu)
            : calculateBiezacyKapitalProcentProsty19(t, wplataRoczna, stopaZwrotu);
        let korzyscT_NoIKZE = kapT_NoIKZE - wplatyT;
        dataNoIKZE.push(Math.round(korzyscT_NoIKZE));
    }

    updateProfitChart(labels, dataIKZE, dataNoIKZE, iKZELabel, noIKZELabel);
}

function updateProfitChart(labels, dataIKZE, dataNoIKZE, iKZELabel, noIKZELabel) {
    const ctx = document.getElementById('profitChart');
    if (!ctx) return;

    if (profitChartInstance) {
        profitChartInstance.data.labels = labels;
        profitChartInstance.data.datasets[0].data = dataIKZE;
        profitChartInstance.data.datasets[1].data = dataNoIKZE;
        profitChartInstance.update();
    } else {
        profitChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: iKZELabel,
                        data: dataIKZE,
                        borderColor: '#16a34a',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: noIKZELabel,
                        data: dataNoIKZE,
                        borderColor: '#0284c7',
                        backgroundColor: 'transparent',
                        borderDash: [4, 4],
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}