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
// ===================== MAPA LEAFLET – HEATMAP NYC TAXI =====================

document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("nycMap");
    if (!mapElement) return; // por si la sección no existe

    // Centro aproximado de Manhattan
    const map = L.map("nycMap").setView([40.7549, -73.9840], 11);

    // Capa base (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    // Datos agregados simulados a partir de NYC Yellow Taxi 2016
    // (zonas con más viajes, más propinas, densidad por hora)
    const taxiZones = [
        {
            name: "Midtown Manhattan",
            coords: [40.7549, -73.9840],
            trips: 240000,
            tipRate: 0.89,
            peakHour: "18:00–21:00",
            tripsPerHour: 3200
        },
        {
            name: "Upper East Side",
            coords: [40.7736, -73.9566],
            trips: 180000,
            tipRate: 0.82,
            peakHour: "17:00–20:00",
            tripsPerHour: 2100
        },
        {
            name: "SoHo / Downtown",
            coords: [40.7233, -74.0030],
            trips: 150000,
            tipRate: 0.75,
            peakHour: "20:00–23:00",
            tripsPerHour: 1900
        },
        {
            name: "JFK Airport",
            coords: [40.6440, -73.7821],
            trips: 120000,
            tipRate: 0.78,
            peakHour: "16:00–22:00",
            tripsPerHour: 1600
        },
        {
            name: "Brooklyn (Williamsburg)",
            coords: [40.7081, -73.9571],
            trips: 90000,
            tipRate: 0.70,
            peakHour: "19:00–23:00",
            tripsPerHour: 1300
        }
    ];

    // Escala de color según número de viajes (densidad)
    function getColor(trips) {
        if (trips > 200000) return "#ef4444";    // alta
        if (trips > 120000) return "#f97316";    // media
        return "#22c55e";                        // baja
    }

    taxiZones.forEach(z => {
        const color = getColor(z.trips);

        L.circleMarker(z.coords, {
            radius: 12,
            color: "white",
            weight: 1,
            fillColor: color,
            fillOpacity: 0.9
        })
        .addTo(map)
        .bindPopup(`
            <strong>${z.name}</strong><br>
            Viajes totales: ${z.trips.toLocaleString()}<br>
            Tasa de propina: ${(z.tipRate * 100).toFixed(1)}%<br>
            Densidad aprox.: ${z.tripsPerHour.toLocaleString()} viajes/hora<br>
            Hora pico: ${z.peakHour}
        `);
    });
});


