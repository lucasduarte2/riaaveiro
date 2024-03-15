
//---------------------------------------
// Definição dos estilos

var defaultStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.015,
      src: "./Images/Moliceiro.svg"
    })
  })
];

var bancosStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.03,
      src: "./Images/banco.svg"
    })
  })
];

var ATMStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.02,
      src: "./Images/atm.svg"
    })
  })
];

var BikeStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.02,
      src: "./Images/bike.svg"
    })
  })
];

var DocasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.04,
      src: "./Images/doca.svg"
    })
  })
];

var CarStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.05,
      src: "./Images/carro.svg"
    })
  })
];

var XavegaStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.05,
      src: "./Images/boi.svg"
    })
  })
];

var GasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.18,
      src: "./Images/gas-station.svg"
    })
  })
];

var ComboiosStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/comboio.svg"
    })
  })
];

var FarmaciasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/farmacia.svg"
    })
  })
];

var AlojamentoStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/alojamento.svg"
    })
  })
];

var FerryStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/ferry.svg"
    })
  })
];

var HospitalStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/hospital.svg"
    })
  })
];

var KSufStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.085,
      src: "./Images/kitesurfing.svg"
    })
  })
];

var OndaStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.055,
      src: "./Images/onda.svg"
    })
  })
];

var BusStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.025,
      src: "./Images/bus.svg"
    })
  })
];

var PortoStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.55,
      src: "./Images/barco.svg"
    })
  })
];

var PescaStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.075,
      src: "./Images/pesca.svg"
    })
  })
];

var VolleyStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/volley.svg"
    })
  })
];

var PraiasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.055,
      src: "./Images/praia.svg"
    })
  })
];

var SalinasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.04,
      src: "./Images/salt.svg"
    })
  })
];

var SurfStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.5,
      src: "./Images/surf.svg"
    })
  })
];

var RestauranteStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.05,
      src: "./Images/restaurant.svg"
    })
  })
];


//---------------------------------------
// Definição das camadas vetoriais
var layerRest = new ol.layer.Vector({
  title: "Restaurante em Aveiro",
  source: new ol.source.Vector({
    url: "./restaurantes.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return RestauranteStyle;
  },
  visible: true
});


var layerVolley = new ol.layer.Vector({
  title: "Moliceiros em Aveiro",
  source: new ol.source.Vector({
    url: "./volei_praia.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return VolleyStyle;
  },
  visible: true
});

var layerMoliceiros = new ol.layer.Vector({
  title: "Moliceiros em Aveiro",
  source: new ol.source.Vector({
    url: "./moliceiro.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return defaultStyle;
  },
  visible: true
});

var layerBancos = new ol.layer.Vector({
  title: "Bancos em Aveiro",
  source: new ol.source.Vector({
    url: "./bancos.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return bancosStyle;
  },
  visible: true
});

var layerATM = new ol.layer.Vector({
  title: "ATM em Aveiro",
  source: new ol.source.Vector({
    url: "./atm.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return ATMStyle;
  },
  visible: true
});

var layerBike = new ol.layer.Vector({
  title: "Bikes em Aveiro",
  source: new ol.source.Vector({
    url: "./aluguer_bicicletas.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return BikeStyle;
  },
  visible: true
});

var layerDocas = new ol.layer.Vector({
  title: "Docas em Aveiro",
  source: new ol.source.Vector({
    url: "./marinas_docas.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return DocasStyle;
  },
  visible: true
});


var layerCar = new ol.layer.Vector({
  title: "Carros em Aveiro",
  source: new ol.source.Vector({
    url: "./aluguer_carros.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return CarStyle;
  },
  visible: true
});

var layerXavega = new ol.layer.Vector({
  title: "Arte Xavega em Aveiro",
  source: new ol.source.Vector({
    url: "./arte_xavega.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return XavegaStyle;
  },
  visible: true
});

var layerGas = new ol.layer.Vector({
  title: "Gas Station em Aveiro",
  source: new ol.source.Vector({
    url: "./bombas_gota.geoJSON",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return GasStyle;
  },
  visible: true
});

var layerAlojamento = new ol.layer.Vector({
  title: "Alojamento em Aveiro",
  source: new ol.source.Vector({
    url: "./alojamento_local.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return AlojamentoStyle;
  },
  visible: true
});

var layerComboio = new ol.layer.Vector({
  title: "Comboio em Aveiro",
  source: new ol.source.Vector({
    url: "./estacao.geoJSON",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return ComboiosStyle;
  },
  visible: true
});

var layerFarmacia = new ol.layer.Vector({
  title: "Farmacia em Aveiro",
  source: new ol.source.Vector({
    url: "./farmacias.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return FarmaciasStyle;
  },
  visible: true
});

var layerFerry = new ol.layer.Vector({
  title: "Ferry em Aveiro",
  source: new ol.source.Vector({
    url: "./ferry2.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return FerryStyle;
  },
  visible: true
});

var layerHospital = new ol.layer.Vector({
  title: "Hospital em Aveiro",
  source: new ol.source.Vector({
    url: "./hospitais.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return HospitalStyle;
  },
  visible: true
});

var layerKsurf = new ol.layer.Vector({
  title: "Kite Surfing em Aveiro",
  source: new ol.source.Vector({
    url: "./kitesurf.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return KSufStyle;
  },
  visible: true
});

var layerOnda = new ol.layer.Vector({
  title: "Ondas em Aveiro",
  source: new ol.source.Vector({
    url: "./ondas.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return OndaStyle;
  },
  visible: true
});

var layerBus = new ol.layer.Vector({
  title: "Bus em Aveiro",
  source: new ol.source.Vector({
    url: "./paragensautocarro.geoJSON",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return BusStyle;
  },
  visible: true
});

var layerPorto = new ol.layer.Vector({
  title: "Porto em Aveiro",
  source: new ol.source.Vector({
    url: "./porto.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return PortoStyle;
  },
  visible: true
});

var layerPesca = new ol.layer.Vector({
  title: "Pesca em Aveiro",
  source: new ol.source.Vector({
    url: "./pesca.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return PescaStyle;
  },
  visible: true
});

var layerPercurso = new ol.layer.Vector({
  title: "Percurso em Aveiro",
  source: new ol.source.Vector({
    url: "./percurso_verde.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 3
    })
  }),
  visible: true
});

var layerPercursoD = new ol.layer.Vector({
  title: "Percurso em Aveiro",
  source: new ol.source.Vector({
    url: "./percurso_dourado.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'gold',
      width: 3
    })
  }),
  visible: true
});

var layerPercursoA = new ol.layer.Vector({
  title: "Percurso em Aveiro",
  source: new ol.source.Vector({
    url: "./percurso_azul.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgb(17, 92, 145)',
      width: 3
    })
  }),
  visible: true
});

var layerFerryRota = new ol.layer.Vector({
  title: "Ferry Rota em Aveiro",
  source: new ol.source.Vector({
    url: "./ferry_rota.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'orange',
      width: 4
    })
  }),
  visible: true
});




var layerPraias = new ol.layer.Vector({
  title: "Praias em Aveiro",
  source: new ol.source.Vector({
    url: "./praias.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return PraiasStyle;
  },
  visible: true
});


var layerRiaB = new ol.layer.Vector({
  title: "Ria Buffer em Aveiro",
  source: new ol.source.Vector({
    url: "./ria_aveiro.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(173, 216, 230, 0.3)'
  })
  }),
  
  visible: true
});

var layerRiaBuffer = new ol.layer.Vector({
  title: "Ria Buffer em Aveiro",
  source: new ol.source.Vector({
    url: "./ria_aveiro_buffer.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 165, 0, 0.3)'
  })
  }),
  
  visible: true
});

var layerSal = new ol.layer.Vector({
  title: "Sal em Aveiro",
  source: new ol.source.Vector({
    url: "./salinas.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return SalinasStyle;
  },
  visible: true
});

var layerSurf = new ol.layer.Vector({
  title: "Surf em Aveiro",
  source: new ol.source.Vector({
    url: "./surf.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature, resolution) {
    return SurfStyle;
  },
  visible: true
});

// Definição do mapa

var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        url: "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0b4a4b88017a4b16b033bde7e90c93f5"
      })
    }),
    layerRiaBuffer,
    layerRiaB,
    layerBus,
    layerRest,
    layerAlojamento,
    layerMoliceiros,
    layerBancos,
    layerATM,
    layerBike,
    layerCar,
    layerDocas,
    layerXavega,
    layerGas,
    layerComboio,
    layerFarmacia,
    layerFerry,
    layerHospital,
    layerKsurf,
    layerOnda,
    layerPorto,
    layerVolley,
    layerPercurso,
    layerPercursoD,
    layerPercursoA,
    layerPraias,
    layerSal,
    layerSurf,
    layerFerryRota,
    layerPesca
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-8.6189, 40.5954]),
    zoom: 11
  })
});

//---------------------------------------
// Função para alternar a visibilidade das camadas

function toggleLayer(layer) {
  layer.setVisible(!layer.getVisible());
}



// Função para fazer uma solicitação HTTP para a API da WeatherAPI
function fetchWeather() {
  // URL da API da WeatherAPI
  var apiUrl = "https://api.weatherapi.com/v1/current.json?key=5de554f2ce654bf68d6212006241403&q=Aveiro";

  // Fazendo uma solicitação HTTP GET
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Processando os dados recebidos da API
      var weatherInfo = document.getElementById("weather-info");
      weatherInfo.innerHTML = `
        <h2>Localização: ${data.location.name}</h2>
        <p>Temperatura: ${data.current.temp_c}°C</p>
        <p>Condição: ${data.current.condition.text}</p>
        <p>Humidade: ${data.current.humidity}%</p>
        <p>Velocidade do vento: ${data.current.wind_kph} km/h</p>
      `;
    })
    .catch(error => {
      console.error("Erro ao buscar dados do clima:", error);
    });
}

// Chama a função para buscar os dados do clima ao carregar a página
fetchWeather();