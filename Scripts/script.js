//---------------------------------------
// Definição dos estilos
var avesStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.1,
      src: "./Images/aves2.svg",
    }),
  }),
];

var defaultStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.015,
      src: "./Images/Moliceiro.svg",
    }),
  }),
];

var bancosStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.03,
      src: "./Images/banco.svg",
    }),
  }),
];

var ATMStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.02,
      src: "./Images/atm.svg",
    }),
  }),
];

var BikeStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.02,
      src: "./Images/bike.svg",
    }),
  }),
];

var DocasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.04,
      src: "./Images/doca.svg",
    }),
  }),
];

var CarStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.05,
      src: "./Images/carro.svg",
    }),
  }),
];

var XavegaStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.05,
      src: "./Images/boi.svg",
    }),
  }),
];

var GasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.18,
      src: "./Images/gas-station.svg",
    }),
  }),
];

var ComboiosStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/comboio.svg",
    }),
  }),
];

var FarmaciasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/farmacia.svg",
    }),
  }),
];

var AlojamentoStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/alojamento.svg",
    }),
  }),
];

var FerryStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/ferry.svg",
    }),
  }),
];

var HospitalStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.035,
      src: "./Images/hospital.svg",
    }),
  }),
];

var KSufStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.085,
      src: "./Images/kitesurfing.svg",
    }),
  }),
];

var OndaStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.055,
      src: "./Images/onda.svg",
    }),
  }),
];

var BusStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.025,
      src: "./Images/bus.svg",
    }),
  }),
];

var PortoStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.55,
      src: "./Images/barco.svg",
    }),
  }),
];

var PescaStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.075,
      src: "./Images/pesca.svg",
    }),
  }),
];

var VolleyStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.3,
      src: "./Images/volei2.svg",
    }),
  }),
];

var PraiasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.055,
      src: "./Images/praia.svg",
    }),
  }),
];

var SalinasStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.04,
      src: "./Images/salt.svg",
    }),
  }),
];

var SurfStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.3,
      src: "./Images/surf2.svg",
    }),
  }),
];

var RestauranteStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.05,
      src: "./Images/restaurant.svg",
    }),
  }),
];

var NatacaoStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      scale: 0.25,
      src: "./Images/natacao.svg",
    }),
  }),
];

//---------------------------------------
// Definição das camadas vetoriais
var layerAves = new ol.layer.Vector({
  title: "Aves",
  source: new ol.source.Vector({
    url: "./ave.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return avesStyle;
  },
  visible: false,
});

var layerRest = new ol.layer.Vector({
  title: "Restaurantes",
  source: new ol.source.Vector({
    url: "./restaurantes.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return RestauranteStyle;
  },
  visible: false,
});

var layerNatacao = new ol.layer.Vector({
  title: "Natacao",
  source: new ol.source.Vector({
    url: "./natacao.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return NatacaoStyle;
  },
  visible: false,
});

var layerVolley = new ol.layer.Vector({
  title: "Volei",
  source: new ol.source.Vector({
    url: "./volei_praia.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return VolleyStyle;
  },
  visible: false,
});

var layerMoliceiros = new ol.layer.Vector({
  title: "Moliceiros",
  source: new ol.source.Vector({
    url: "./moliceiro.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return defaultStyle;
  },
  visible: false,
});

var layerBancos = new ol.layer.Vector({
  title: "Bancos",
  source: new ol.source.Vector({
    url: "./bancos.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return bancosStyle;
  },
  visible: false,
});

var layerATM = new ol.layer.Vector({
  title: "ATM",
  source: new ol.source.Vector({
    url: "./atm.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return ATMStyle;
  },
  visible: false,
});

var layerBike = new ol.layer.Vector({
  title: "Aluguer Bicicletas",
  source: new ol.source.Vector({
    url: "./aluguer_bicicletas.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return BikeStyle;
  },
  visible: false,
});

var layerDocas = new ol.layer.Vector({
  title: "Docas",
  source: new ol.source.Vector({
    url: "./marinas_docas.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return DocasStyle;
  },
  visible: false,
});

var layerCar = new ol.layer.Vector({
  title: "Aluguer Carros",
  source: new ol.source.Vector({
    url: "./aluguer_carros.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return CarStyle;
  },
  visible: false,
});

var layerXavega = new ol.layer.Vector({
  title: "Arte Xavega",
  source: new ol.source.Vector({
    url: "./arte_xavega.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return XavegaStyle;
  },
  visible: false,
});

var layerGas = new ol.layer.Vector({
  title: "Bombas Gasolina",
  source: new ol.source.Vector({
    url: "./bombas_gota.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return GasStyle;
  },
  visible: false,
});

var layerAlojamento = new ol.layer.Vector({
  title: "Alojamento",
  source: new ol.source.Vector({
    url: "./alojamento_local.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return AlojamentoStyle;
  },
  visible: false,
});

var layerComboio = new ol.layer.Vector({
  title: "Estações Comboio",
  source: new ol.source.Vector({
    url: "./estacao.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return ComboiosStyle;
  },
  visible: false,
});

var layerFarmacia = new ol.layer.Vector({
  title: "Farmacias",
  source: new ol.source.Vector({
    url: "./farmacias.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return FarmaciasStyle;
  },
  visible: false,
});

var layerFerry = new ol.layer.Vector({
  title: "Ferry",
  source: new ol.source.Vector({
    url: "./ferry2.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return FerryStyle;
  },
  visible: false,
});

var layerHospital = new ol.layer.Vector({
  title: "Hospitais",
  source: new ol.source.Vector({
    url: "./hospitais.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return HospitalStyle;
  },
  visible: false,
});

var layerKsurf = new ol.layer.Vector({
  title: "Kite Surfing",
  source: new ol.source.Vector({
    url: "./kitesurf.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return KSufStyle;
  },
  visible: false,
});

var layerOnda = new ol.layer.Vector({
  title: "Ondas",
  source: new ol.source.Vector({
    url: "./ondas.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return OndaStyle;
  },
  visible: false,
});

var layerBus = new ol.layer.Vector({
  title: "Paragens Autocarro",
  source: new ol.source.Vector({
    url: "./paragensautocarro.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return BusStyle;
  },
  visible: false,
});

var layerPorto = new ol.layer.Vector({
  title: "Porto",
  source: new ol.source.Vector({
    url: "./porto.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return PortoStyle;
  },
  visible: false,
});

var layerPesca = new ol.layer.Vector({
  title: "Núcleos Pesca",
  source: new ol.source.Vector({
    url: "./pesca.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return PescaStyle;
  },
  visible: false,
});

var layerPercurso = new ol.layer.Vector({
  title: "Percurso Verde",
  source: new ol.source.Vector({
    url: "./percurso_verde.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "green",
      width: 3,
    }),
  }),
  visible: false,
});

var layerCaminhoSantiago = new ol.layer.Vector({
  title: "Caminho Santiago",
  source: new ol.source.Vector({
    url: "./santiago.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "orange",
      width: 3,
    }),
  }),
  visible: false,
});

var layerPercursoD = new ol.layer.Vector({
  title: "Percurso Dourado",
  source: new ol.source.Vector({
    url: "./percurso_dourado.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "gold",
      width: 3,
    }),
  }),
  visible: false,
});

var layerPercursoA = new ol.layer.Vector({
  title: "Percurso Azul",
  source: new ol.source.Vector({
    url: "./percurso_azul.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "rgb(17, 92, 145)",
      width: 3,
    }),
  }),
  visible: false,
});

var layerFerryRota = new ol.layer.Vector({
  title: "Rota Ferry",
  source: new ol.source.Vector({
    url: "./ferry_rota.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "orange",
      width: 4,
    }),
  }),
  visible: false,
});

var layerPercursoNature = new ol.layer.Vector({
  title: "Percurso Natureza",
  source: new ol.source.Vector({
    url: "./percurso_natureza.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "green",
      width: 4,
    }),
  }),
  visible: false,
});

var layerPraias = new ol.layer.Vector({
  title: "Praias",
  source: new ol.source.Vector({
    url: "./praias.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return PraiasStyle;
  },
  visible: false,
});

var layerRiaB = new ol.layer.Vector({
  title: "Ria",
  source: new ol.source.Vector({
    url: "./ria_aveiro.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(173, 216, 230, 1)",
    }),
  }),

  visible: false,
});

var layerRiaBuffer = new ol.layer.Vector({
  title: "Ria Buffer",
  source: new ol.source.Vector({
    url: "./ria_aveiro_buffer.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(255, 165, 0, 1)",
    }),
  }),

  visible: false,
});

var layerSal = new ol.layer.Vector({
  title: "Salinas",
  source: new ol.source.Vector({
    url: "./salinas.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return SalinasStyle;
  },
  visible: false,
});

var layerSurf = new ol.layer.Vector({
  title: "Surf",
  source: new ol.source.Vector({
    url: "./surf.geojson",
    format: new ol.format.GeoJSON(),
  }),
  style: function (feature, resolution) {
    return SurfStyle;
  },
  visible: false,
});

function toggleLayer(layer) {
  layer.setVisible(!layer.getVisible());
}

var layerMap1 = new ol.layer.Tile({
  title: "Mapa 1",
  source: new ol.source.OSM(),
  visible: true,
  displayInLayerSwitcher: false,
});

var layerMap2 = new ol.layer.Tile({
  title: "Mapa 2",
  source: new ol.source.OSM({
    url: "https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=0b4a4b88017a4b16b033bde7e90c93f5",
  }),
  visible: false,
  displayInLayerSwitcher: false,
});

var layerMap3 = new ol.layer.Tile({
  title: "Bing Aerial",
  source: new ol.source.BingMaps({
    key: "AvBCehWm6Ep1VVa23v2BM-SsqJ1X3hx7l5CRWAj3ThglltxV7J87lENctywpvfsS",
    imagerySet: "AerialWithLabels",
  }),
  visible: false,
  displayInLayerSwitcher: false,
});

var layerMap4 = new ol.layer.Tile({
  title: "Bing Dark",
  source: new ol.source.BingMaps({
    key: "AvBCehWm6Ep1VVa23v2BM-SsqJ1X3hx7l5CRWAj3ThglltxV7J87lENctywpvfsS",
    imagerySet: "CanvasDark",
  }),
  visible: false,
  displayInLayerSwitcher: false,
});

// Definir source como uma variável global
var source = new ol.source.TileWMS({
  url: "https://gis4cloud.pt/geoserver/wms",
  params: {
    LAYERS: "grupo4_ptas2024:Aveiro Batimetria Reclassificada",
    TILED: true,
  },
});

// Definir a camada de batimetria como uma variável global
var batimetriaLayer = new ol.layer.Tile({
  visible: false,
  title: "Batimetria",
  source: source, // Usar a fonte global aqui
});


var map = new ol.Map({
  target: "map",
  layers: [
    layerMap1,
    layerMap2,
    layerMap3,
    layerMap4,
    layerRiaBuffer,
    layerRiaB,
    batimetriaLayer,
    new ol.layer.Tile({
      visible: false,
      title: "Batimetria 25m",
      source: new ol.source.TileWMS({
        url: "https://gis4cloud.pt/geoserver/wms",
        params: {
          LAYERS: "grupo4_ptas2024:Aveiro",
          TILED: true
        }
      }),
    }),
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
    layerCaminhoSantiago,
    layerPercurso,
    layerPercursoD,
    layerPercursoA,
    layerPraias,
    layerSal,
    layerSurf,
    layerFerryRota,
    layerNatacao,
    layerPesca,
    layerAves,
    layerPercursoNature
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-8.6189, 40.5954]),
    zoom: 11,
  }),
});

var groups = {
  Desportos: new ol.layer.Group({
    title: "Desportos",
    layers: [layerVolley, layerSurf, layerNatacao],
  }),
  "Pontos de Interesse": new ol.layer.Group({
    title: "Pontos de Interesse",
    layers: [layerRest, layerAlojamento, layerFarmacia],
  }),
  "Outras Camadas": new ol.layer.Group({
    title: "Outras Camadas",
    layers: [layerBus, layerPorto, layerPesca],
  }),
  // Adicione mais grupos conforme necessário
};

// Criação do Layer Switcher com os grupos
var layerSwitcher = new ol.control.LayerSwitcher({
  reverse: true, // Altera a ordem de empilhamento dos grupos
  groups: groups,
});

map.addControl(layerSwitcher);

var mapSwitcherControl = new ol.control.Control({
  element: document.getElementById("map-switcher"),
});
map.addControl(mapSwitcherControl);

document.getElementById("map1-radio").addEventListener("change", function () {
  layerMap1.setVisible(this.checked);
  layerMap2.setVisible(!this.checked);
  layerMap3.setVisible(!this.checked);
  layerMap4.setVisible(!this.checked);
});

document.getElementById("map2-radio").addEventListener("change", function () {
  layerMap2.setVisible(this.checked);
  layerMap1.setVisible(!this.checked);
  layerMap3.setVisible(!this.checked);
  layerMap4.setVisible(!this.checked);
});

document.getElementById("map3-radio").addEventListener("change", function () {
  layerMap3.setVisible(this.checked);
  layerMap1.setVisible(!this.checked);
  layerMap2.setVisible(!this.checked);
  layerMap4.setVisible(!this.checked);
});

document.getElementById("map4-radio").addEventListener("change", function () {
  layerMap3.setVisible(!this.checked);
  layerMap1.setVisible(!this.checked);
  layerMap2.setVisible(!this.checked);
  layerMap4.setVisible(this.checked);
});

// Criar um marcador para representar a estação meteorológica no mapa
var weatherMarker = new ol.Feature({
  geometry: new ol.geom.Point(
    ol.proj.fromLonLat([-8.657464132993645, 40.63164592188218])
  ),
});

// Estilizar o marcador (ponto no mapa)
weatherMarker.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: "./Images/weather-svgrepo-com.svg",
      scale: 0.085, // ajuste o tamanho conforme necessário
    }),
  })
);

// Adicionar o marcador ao vetor de camada
var weatherMarkerLayer = new ol.layer.Vector({
  title: "Meteorologia",
  source: new ol.source.Vector({
    features: [weatherMarker],
  }),
});
map.addLayer(weatherMarkerLayer);

// Adicionar um evento de clique ao marcador para exibir um pop-up com informações meteorológicas
map.on("click", function (evt) {
  map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    if (feature === weatherMarker) {
      // Buscar dados da API
      const url = "https://api.ipma.pt/open-data/observation/meteorology/stations/observations.json";
      const stationId = "1210702";
      const timestamp = "2024-03-27T12:00"; // Timestamp dos dados desejados

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Dados da API:", data); // Console log dos dados retornados pela API

          // Verificar se os dados para a estação e timestamp desejado estão disponíveis
          if (data[timestamp] && data[timestamp][stationId]) {
            const observation = data[timestamp][stationId];
            const formattedDate = new Date(timestamp).toLocaleString(); // Converter o timestamp para o formato local
            const weatherInfo = `
              <h3>Data Hora: ${formattedDate}</h3>
              <h2>Meteorologia Aveiro (Universidade de Aveiro - IPMA)</h2>
              ${observation.intensidadeVento ? `<p>Intensidade do Vento: ${observation.intensidadeVento.toFixed(1)} m/s</p>` : ''}
              ${observation.temperatura ? `<p>Temperatura: ${observation.temperatura.toFixed(1)}°C</p>` : ''}
              ${observation.pressao ? `<p>Pressão: ${observation.pressao.toFixed(1)} hPa</p>` : ''}
              ${observation.humidade ? `<p>Humidade: ${observation.humidade.toFixed(1)}%</p>` : ''}
            `;
            document.getElementById("popup-content").innerHTML = weatherInfo;

            // Abrir o pop-up
            var popup = document.getElementById("popup");
            popup.style.display = "block";
            popup.style.left = evt.pixel[0] + "px";
            popup.style.top = evt.pixel[1] + "px";
          } else {
            // Exibir uma mensagem se os dados da estação ou timestamp desejado não estiverem disponíveis
            document.getElementById("popup-content").textContent = "Dados não disponíveis para a estação " + stationId + " no timestamp " + timestamp;

            // Abrir o pop-up
            var popup = document.getElementById("popup");
            popup.style.display = "block";
            popup.style.left = evt.pixel[0] + "px";
            popup.style.top = evt.pixel[1] + "px";
          }
        })
        .catch((error) => console.error("Erro:", error));
    }
  });
});

// Criar um evento de clique no botão de fechar
document.getElementById("popup-closer").addEventListener("click", function () {
  var popup = document.getElementById("popup");
  popup.style.display = "none"; // Fechar o pop-up
});

//Codigo para mostrar a legenda da Aveiro Batimetria Reclassificada
// Função para atualizar a legenda dentro da div
function updateLegend() {
  var legendUrl = source.getLegendUrl();
  if (legendUrl) {
    document.getElementById("legend").src = legendUrl;
  }
}

// Adicionar um evento de mudança de visibilidade à camada de batimetria
batimetriaLayer.on("change:visible", function() {
  // Verificar se a camada de batimetria está visível
  if (batimetriaLayer.getVisible()) {
    // Se estiver visível, atualizar a legenda
    updateLegend();
  } else {
    // Se não estiver visível, ocultar a legenda definindo a origem da imagem como vazia
    document.getElementById("legend").src = "";
  }
});

// Chamar a função para exibir a legenda apenas se a camada estiver visível inicialmente
if (batimetriaLayer.getVisible()) {
  updateLegend();
}