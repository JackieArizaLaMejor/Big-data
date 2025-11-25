// ===== CONFIGURA COLORES GENERALES PARA LOS GRÁFICOS =====
const palette = {
    primary: "#5b5fef",
    primarySoft: "rgba(91,95,239,0.20)",
    green: "#10b981",
    red: "#ef4444",
    gray: "#9ca3af",
    blue: "#0ea5e9"
};



// ===== GRÁFICO: VIAJES POR HORA =====
new Chart(document.getElementById("chartHora"), {
    type: "line",
    data: {
        labels: ["6 am", "8 am", "10 am", "12 pm", "2 pm", "4 pm", "6 pm", "8 pm"],
        datasets: [{
            label: "Viajes activos",
            data: [32000, 45000, 52000, 61000, 58000, 62000, 64000, 41000],
            borderColor: palette.primary,
            backgroundColor: palette.primarySoft,
            fill: true,
            tension: 0.4,
            borderWidth: 2
        }]
    },
    options: {
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                grid: { color: "rgba(148,163,184,0.2)" }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});

// ===== GRÁFICO: MÉTODOS DE PAGO =====
new Chart(document.getElementById("chartPago"), {
    type: "doughnut",
    data: {
        labels: ["Tarjeta", "Efectivo", "Otros"],
        datasets: [{
            data: [60, 35, 5],
            backgroundColor: [palette.primary, palette.gray, palette.blue],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: { position: "bottom" }
        },
        cutout: "60%"
    }
});

// ===== GRÁFICO: CLUSTERS DE TARIFA =====
new Chart(document.getElementById("chartClusters"), {
    type: "bar",
    data: {
        labels: ["Baratos", "Regulares", "Caros"],
        datasets: [{
            label: "Número de viajes",
            data: [300000, 500000, 200000],
            backgroundColor: [palette.blue, palette.primary, palette.red],
            borderRadius: 8
        }]
    },
    options: {
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                grid: { color: "rgba(148,163,184,0.2)" }
            },
            x: {
                grid: { display: false }
            }
        }
    }
});

// ===== GRÁFICO: PROPINA VS NO PROPINA (USADO EN SECCIÓN DE PREDICCIÓN) =====
const propinaChartCtx = document.getElementById("chartPropina");
const propinaChart = new Chart(propinaChartCtx, {
    type: "pie",
    data: {
        labels: ["Con propina", "Sin propina"],
        datasets: [{
            data: [72, 28],
            backgroundColor: [palette.green, palette.red],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: { position: "bottom" }
        }
    }
});

// ===== FUNCIÓN DE “PREDICCIÓN” DE PROPINAS =====
function predictTip() {
    const distance = parseFloat(document.getElementById("pred-distance").value);
    const hour = parseInt(document.getElementById("pred-hour").value);
    const payment = document.getElementById("pred-payment").value;
    const resultBox = document.getElementById("prediction-result");

    if (isNaN(distance) || isNaN(hour) || hour < 0 || hour > 23) {
        resultBox.innerHTML = "⚠️ Por favor ingresa una distancia válida y una hora entre 0 y 23.";
        return;
    }

    // Modelo simulado basado en reglas sencillas
    let prob = 0.10;                   // base 10%

    // Distancia: viajes más largos tienden a dejar más propina
    prob += distance * 0.03;           // +3% por milla

    // Horario: noche y tarde suelen dejar más propina
    if (hour >= 18 || hour <= 5) {
        prob += 0.25;                  // +25% en noches / madrugadas
    } else if (hour >= 12 && hour <= 15) {
        prob += 0.10;                  // +10% en horas de almuerzo
    }

    // Método de pago: tarjeta deja más propina que efectivo
    if (payment === "card") {
        prob += 0.20;                  // +20% tarjeta
    } else {
        prob += 0.05;                  // +5% efectivo
    }

    // Limitar entre 0% y 100%
    prob = Math.min(1, Math.max(0, prob));
    const pct = (prob * 100).toFixed(1);

    // Actualizar texto
    resultBox.innerHTML =
        `🔮 Este viaje tiene una probabilidad estimada de <strong>${pct}%</strong> de recibir propina.`;

    // Actualizar gráfico de pastel con la probabilidad calculada
    propinaChart.data.datasets[0].data = [prob * 100, (1 - prob) * 100];
    propinaChart.update();
    
}

