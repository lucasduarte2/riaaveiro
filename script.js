// Define a chave de acesso do Mapbox
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2RhbmllbHNpbHZhIiwiYSI6ImNsdmY0bTUwNDAzbWwyamw4NjUwMW5paTUifQ.0MAtfqLmatOkT_NjHAo9Ag";

// Cria um novo mapa
const map = new mapboxgl.Map({
  container: "map", // ID do elemento HTML que irá conter o mapa
  center: [-8.654168722609962, 40.63221083028599], // Coordenadas do centro inicial do mapa
  zoom: 16.4, // Nível de zoom inicial
  pitch: 75, // Ângulo de inclinação inicial
  bearing: 7.5, // Direção inicial
  maxBounds: [-9.6, 40.4, -8.45, 41], // Limites máximos do mapa
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl(), "bottom-right");

map.addControl(new mapboxgl.FullscreenControl());

// Add geolocate control to the map.
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true,
  })
);

// Define as tabelas que serão usadas
const tabelas = [
  "point_alojamento_local",
  "aluguer_bicicletas",
  "aluguer_carros",
  "arte_xavega",
  "aves",
  "bancos",
  "bombas_gasolina",
  "estacao",
  "farmacias",
  "hospitais",
  "kitesurf",
  "local_ferry",
  "point_marinas_docas",
  "multibanco",
  "natacao_pontoprofessora",
  "point_nucleos_pesca",
  "ondas",
  "paragensautocarro",
  "percurso_azul",
  "percurso_dourado",
  "percurso_natureza",
  "percurso_verde",
  "point_porto",
  "point_praias",
  "restaurantes",
  /* "ria_aveiro", */
  "point_surf",
  "terminal_ferry",
  "salinas",
  "voleipraia",
];

var originalPointsData = {};

// Quando o mapa terminar de carregar...
map.on("load", () => {
  // Função para adicionar as camadas ao mapa.
  function addLayers() {
    tabelas.forEach((tabela) => {
      // Busca os dados da tabela
      fetch(`https://www.gis4cloud.com/grupo4_ptas2024/bd.php?tabela=${tabela}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Assuming the response is JSON
        })
        .then((data) => {
          // Process the JSON data
          console.log(`Dados carregados para ${tabela}:`, data);
          map.addSource(tabela, {
            type: "geojson",
            data: data,
          });

          // Carrega a imagem do ícone
          // Carrega a imagem do ícone
          map.loadImage(getLayerImage(tabela), function (error, image) {
            if (error) {
              console.error("Error loading image:", error);
              // Handle errors gracefully
              return;
            }

            // Adiciona a imagem ao mapa
            map.addImage(tabela, image);

            // Adiciona uma nova camada ao mapa usando os dados e a imagem
            map.addLayer({
              id: tabela,
              type: "symbol",
              source: tabela,
              layout: {
                "icon-image": tabela,
                "icon-size": 0.03,
                "icon-allow-overlap": true,
                visibility: "none",
              },
            });

            // Cria um popup, mas não o adiciona ao mapa ainda.
            const popup = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            });

            // Quando o mouse entra em um ponto na camada dentro da isocrona...
            map.on("mouseenter", tabela + "_within", function (e) {
              // Muda o estilo do cursor como um indicador de interface do usuário.
              map.getCanvas().style.cursor = "pointer";

              // Copia a matriz de coordenadas.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              // Garante que se o mapa estiver ampliado de tal forma que várias
              // cópias do recurso estejam visíveis, o popup apareça
              // sobre a cópia que está sendo apontada.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Preenche o popup e define suas coordenadas
              // com base no recurso encontrado.
              popup
                .setLngLat(coordinates)
                .setHTML("<h6>" + tabela + "</h6><p>" + description + "</p>")
                .addTo(map);
            });

            // Quando o mouse sai de um ponto na camada...
            map.on("mouseleave", tabela + "_within", function () {
              map.getCanvas().style.cursor = "";
              popup.remove();
            });

            // Quando o mouse entra em um ponto na camada...
            map.on("mouseenter", tabela, function (e) {
              // Muda o estilo do cursor como um indicador de interface do usuário.
              map.getCanvas().style.cursor = "pointer";

              // Copia a matriz de coordenadas.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const description = e.features[0].properties.description;

              // Guarde as coordenadas do ponto em uma variável
              var pointCoordinates = coordinates;

              // Construa a URL do Google Maps Street View com as coordenadas do ponto
              var streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${pointCoordinates[1]},${pointCoordinates[0]}`;

              // Garante que se o mapa estiver ampliado de tal forma que várias
              // cópias do recurso estejam visíveis, o popup apareça
              // sobre a cópia que está sendo apontada.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Preenche o popup e define suas coordenadas
              // com base no recurso encontrado.
              popup
                .setLngLat(coordinates)
                .setHTML(
                  "<h6>" +
                    tabela +
                    "</h6><p>" +
                    description +
                    "</p><p><a href='" +
                    streetViewUrl +
                    "' target='_blank'>Ver no Google Street View</a></p>"
                )
                .addTo(map);
            });

            // Quando o mouse sai de um ponto na camada...
            map.on("mouseleave", tabela, function () {
              map.getCanvas().style.cursor = "";
              popup.remove();
            });
          });
        })
        .catch((error) => console.error("Error:", error)); // Regista qualquer erro que ocorra
    });
  }
  var percursos = [
    "percurso_azul",
    "percurso_dourado",
    "percurso_natureza",
    "percurso_verde",
  ];

  percursos.forEach(function (percurso) {
    fetch(`percursos.php?tabela=${percurso}`)
      .then((response) => response.json()) // Converte a resposta em JSON
      .then((data) => {
        // Adiciona os dados do percurso ao mapa como uma nova fonte
        map.addSource(percurso, {
          type: "geojson",
          data: data,
        });

        // Adiciona uma nova camada ao mapa para renderizar o percurso
        map.addLayer({
          id: percurso,
          type: "line", // Tipo de geometria do percurso, pode ser 'line' ou 'fill', dependendo do que você tem no banco de dados
          source: percurso,
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: "none",
          },
          paint: {
            "line-color":
              percurso === "percurso_azul"
                ? "#0000FF"
                : percurso === "percurso_dourado"
                ? "#FFD700"
                : percurso === "percurso_natureza"
                ? "#A47551"
                : "#008000", // Cor do percurso
            "line-width": 3, // Largura da linha
          },
        });
      })
      .catch((error) => console.error("Error:", error)); // Registra qualquer erro que ocorra
  });

  // Adiciona as camadas ao mapa quando o mapa é carregado pela primeira vez.
  addLayers();

  // Adiciona as camadas ao mapa sempre que o estilo do mapa é alterado.
  map.on("style.load", addLayers);

  const layerClasses = {
    "Alojamento-e-Transporte": [
      "point_alojamento_local",
      "aluguer_bicicletas",
      "aluguer_carros",
      "local_ferry",
      "terminal_ferry",
    ],
    "Pontos-de-Interesse": [
      "arte_xavega",
      "aves",
      "point_marinas_docas",
      "point_nucleos_pesca",
      "point_porto",
      "point_praias",
      "salinas",
    ],
    Serviços: [
      "bancos",
      "bombas_gasolina",
      "estacao",
      "farmacias",
      "hospitais",
      "multibanco",
      "paragensautocarro",
      "restaurantes",
    ],
    Atividades: [
      "kitesurf",
      "point_surf",
      "natacao_pontoprofessora",
      "voleipraia",
      "ondas",
      "percurso_azul",
      "percurso_dourado",
      "percurso_verde",
      "percurso_natureza",
    ],
  };

  const layerNames = {
    point_alojamento_local: "Alojamento Local",
    aluguer_bicicletas: "Aluguer de Bicicletas",
    aluguer_carros: "Aluguer de Carros",
    arte_xavega: "Arte Xávega",
    aves: "Observação de Aves",
    bancos: "Bancos",
    bombas_gasolina: "Bombas de Gasolina",
    estacao: "Estação",
    farmacias: "Farmácias",
    hospitais: "Hospitais",
    kitesurf: "Kitesurf",
    local_ferry: "Ferry Local",
    point_marinas_docas: "Marinas e Docas",
    multibanco: "Multibanco",
    natacao_pontoprofessora: "Natação",
    point_nucleos_pesca: "Núcleos de Pesca",
    ondas: "Ondas",
    paragensautocarro: "Paragens de Autocarro",
    percurso_azul: "Percurso Azul",
    percurso_dourado: "Percurso Dourado",
    percurso_natureza: "Percurso Natureza",
    percurso_verde: "Percurso Verde",
    point_porto: "Porto",
    point_praias: "Praias",
    restaurantes: "Restaurantes",
    point_surf: "Surf",
    terminal_ferry: "Terminal de Ferry",
    salinas: "Salinas",
    voleipraia: "Vólei de Praia",
  };

  // Adicione uma variável para rastrear se os links das layers já foram adicionados
  let layersAdded = false;

  map.on("idle", () => {
    // Verifique se os links das layers já foram adicionados
    if (!layersAdded) {
      // Se não, adicione os links das layers às classes
      for (const [classId, layers] of Object.entries(layerClasses)) {
        const layersDiv = document.querySelector(`#${classId} .layers`);
        for (const layer of layers) {
          const link = document.createElement("a");
          link.id = layer;
          link.href = "#";
          link.textContent = layerNames[layer] || layer;
          link.className = "active";
          link.onclick = function (e) {
            const clickedLayer = this.id;
            e.preventDefault();
            e.stopPropagation();
            toggleLayerVisibility(clickedLayer, this);
          };
          layersDiv.appendChild(link);
        }
      }

      // Atualize a variável para indicar que os links das layers foram adicionados
      layersAdded = true;
    }
  });

  function toggleLayerVisibility(layer, linkElement) {
    // Verifique tanto a camada original quanto a camada dentro da isocrona
    const layerId = [layer, layer + "_within"].find((id) => map.getLayer(id));
    if (layerId) {
      const visibility = map.getLayoutProperty(layerId, "visibility");

      // Alterna a visibilidade da camada.
      if (visibility === "visible") {
        map.setLayoutProperty(layerId, "visibility", "none");
        linkElement.className = "";
      } else {
        linkElement.className = "active";
        map.setLayoutProperty(layerId, "visibility", "visible");
      }
    }
  }

  // Função para obter a imagem do ícone para uma tabela
  function getLayerImage(tabela) {
    switch (tabela) {
      case "point_alojamento_local":
        return "imagens/alojamento_local.png";
      case "aluguer_bicicletas":
        return "imagens/aluguer_bicicletas.png";
      case "aluguer_carros":
        return "imagens/aluguer_carros.png";
      case "arte_xavega":
        return "imagens/arte_xavega.png";
      case "aves":
        return "imagens/aves.png";
      case "bancos":
        return "imagens/bancos.png";
      case "bombas_gasolina":
        return "imagens/bombas_gasolina.png";
      case "estacao":
        return "imagens/estacao.png";
      case "farmacias":
        return "imagens/farmacias.png";
      case "hospitais":
        return "imagens/hospital.png";
      case "kitesurf":
        return "imagens/kitesurf.png";
      case "local_ferry":
        return "imagens/local_ferry.png";
      case "point_marinas_docas":
        return "imagens/marinas_docas.png";
      case "multibanco":
        return "imagens/multibanco.png";
      case "natacao_pontoprofessora":
        return "imagens/natacao_pontoprofessora.png";
      case "point_nucleos_pesca":
        return "imagens/nucleos_pesca.png";
      case "ondas":
        return "imagens/ondas.png";
      case "paragensautocarro":
        return "imagens/paragensautocarro.png";
      /* case "percurso_azul":
        return "imagens/percurso_azul.png";
      case "percurso_dourado":
        return "imagens/percurso_dourado.png";
      case "percurso_natureza":
        return "imagens/percurso_natureza.png";
      case "percurso_verde":
        return "imagens/percurso_verde.png"; */
      case "point_porto":
        return "imagens/porto.png";
      case "point_praias":
        return "imagens/praias.png";
      case "restaurantes":
        return "imagens/restaurantes.png";
      /*       case "ria_aveiro":
        return "imagens/ria_aveiro.png"; */
      case "point_surf":
        return "imagens/surf.png";
      case "terminal_ferry":
        return "imagens/local_ferry.png";
      case "salinas":
        return "imagens/salinas.png";
      case "voleipraia":
        return "imagens/voleipraia.png";
    }
  }
  /*   map.addSource("batimetria5m", {
    type: "raster",
    tiles: [
      "https://gis4cloud.pt/geoserver/wms?service=WMS&request=GetMap&layers=grupo4_ptas2024:Aveiro%20Batimetria%20Reclassificada&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}",
    ],
    tileSize: 256,
  });

  map.addLayer({
    id: "batimetria5m",
    type: "raster",
    source: "batimetria5m",
    paint: {},
  }); */
  /*   map.addSource("batimetria25m", {
    type: "raster",
    tiles: [
      "https://gis4cloud.pt/geoserver/grupo4_ptas2024/wms?service=WMS&version=1.1.0&request=GetMap&layers=grupo4_ptas2024%3AAveiro&bbox=-54562.5%2C104837.5%2C-44187.5%2C112287.5&width=768&height=551&srs=EPSG%3A3763&styles=&format=application/openlayers",
    ],
    tileSize: 256,
  });

  map.addLayer({
    id: "batimetria25m",
    type: "raster",
    source: "batimetria25m",
    paint: {},
  }); */
});

// Quando o estilo do mapa terminar de carregar...
map.on("style.load", () => {
  // Define a propriedade "lightPreset" do mapa para "dawn"
  map.setConfigProperty("basemap", "lightPreset", "dusk");
});

// Quando o valor do elemento "lightPreset" mudar...
document.getElementById("lightPreset").addEventListener("change", function () {
  // Atualiza a propriedade "lightPreset" do mapa para o novo valor
  map.setConfigProperty("basemap", "lightPreset", this.value);
});

// Define os IDs das configurações
const configIds = [
  "showPlaceLabels",
  "showPointOfInterestLabels",
  "showRoadLabels",
  "showTransitLabels",
];

// Quando o estado do elemento "selectAll" mudar...
document.getElementById("selectAll").addEventListener("change", function () {
  // Atualiza todas as configurações para o novo estado
  configIds.forEach((id) => map.setConfigProperty("basemap", id, this.checked));
});

// Para cada checkbox dentro do elemento '.map-overlay-inner'...
document
  .querySelectorAll('.map-overlay-inner input[type="checkbox"]')
  .forEach((checkbox) => {
    // Quando o estado do checkbox mudar...
    checkbox.addEventListener("change", function () {
      // Atualiza a configuração correspondente para o novo estado
      map.setConfigProperty("basemap", this.id, this.checked);
    });
  });

function updateContourOptions() {
  // Obtenha os elementos selecionados
  var contourTypeElement = document.getElementById("contourType");
  var contourElement = document.getElementById("contour");

  // Limpe as opções existentes
  contourElement.innerHTML = "";

  // Verifique o tipo de métrica selecionada e adicione as opções apropriadas
  if (contourTypeElement.value === "minutes") {
    // Adicione opções para minutos
    var options = ["5", "10", "15", "20", "25", "30"];
  } else {
    // Adicione opções para metros
    var options = ["1000", "2000", "3000", "4000", "5000"];
  }

  // Adicione as opções ao elemento de seleção de contorno
  options.forEach(function (optionValue) {
    var optionElement = document.createElement("option");
    optionElement.value = optionValue;
    optionElement.text = optionValue;
    contourElement.add(optionElement);
  });
}

// Chame a função uma vez para preencher as opções iniciais
updateContourOptions();

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const arrowIcon = document.querySelector(".sidebar-toggle .arrow-icon");
  sidebar.classList.toggle("show");
  if (sidebar.classList.contains("show")) {
    arrowIcon.innerHTML = "«";
  } else {
    arrowIcon.innerHTML = "»";
  }
}

// Armazene as coordenadas do último ponto clicado
var lastClickedPoint = null;

// Verifica se a fonte já existe antes de adicionar uma nova fonte
function addOrUpdateSource(sourceId, data) {
  const source = map.getSource(sourceId);
  if (source) {
    // Se a fonte já existir, atualize os dados
    source.setData(data);
  } else {
    // Se a fonte não existir, adicione-a
    map.addSource(sourceId, {
      type: "geojson",
      data: data,
    });
  }
}

// Função para calcular a isócrona
function calculateIsochrone() {
  // Restaure os dados originais para todas as tabelas
  for (const [tabela, data] of Object.entries(originalPointsData)) {
    // Verifique se a fonte de dados já está adicionada
    if (!map.getSource(tabela)) {
      /*       console.log(
        `Fonte de dados ${tabela} não encontrada, tentando adicionar...`
      ); */
      addOrUpdateSource(tabela, data);
    } else {
      /* console.log(`Fonte de dados ${tabela} encontrada.`); */
    }
  }
  // Se nenhum ponto foi clicado ainda, retorne
  if (lastClickedPoint === null) return;

  // Obtenha as coordenadas do último ponto clicado
  var coordinates = lastClickedPoint;

  // Obtenha os elementos selecionados
  var routingProfileElement = document.getElementById("routingProfile");
  var contourTypeElement = document.getElementById("contourType");
  var contourElement = document.getElementById("contour");

  // Obtenha os valores dos elementos selecionados
  var routingProfile = routingProfileElement.value;
  var contourType = contourTypeElement.value;
  var contour = contourElement.value;

  // Construa a URL da API do Mapbox Isochrone
  var apiUrl = `https://api.mapbox.com/isochrone/v1/mapbox/${routingProfile}/${coordinates.lng}%2C${coordinates.lat}?contours_${contourType}=${contour}&polygons=true&denoise=1&access_token=pk.eyJ1Ijoic2RhbmllbHNpbHZhIiwiYSI6ImNsdmY0bTUwNDAzbWwyamw4NjUwMW5paTUifQ.0MAtfqLmatOkT_NjHAo9Ag`;

  // Se a camada de isócrona já existir, remova-a
  if (map.getLayer("isochrone")) {
    map.removeLayer("isochrone");
    map.removeSource("isochrone");
  }

  // Faça uma solicitação para a API do Mapbox Isochrone
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Adicione os dados ao mapa como uma nova fonte
      map.addSource("isochrone", {
        type: "geojson",
        data: data,
      });

      // Adicione uma nova camada ao mapa usando os dados
      map.addLayer({
        id: "isochrone",
        type: "fill",
        source: "isochrone",
        layout: {},
        paint: {
          "fill-color": "#5a3fc0",
          "fill-opacity": 0.33,
        },
      });

      // Ajuste o zoom do mapa para caber na isócrona
      var bounds = new mapboxgl.LngLatBounds();
      data.features[0].geometry.coordinates[0].forEach((coord) =>
        bounds.extend(coord)
      );
      map.fitBounds(bounds, { padding: 20 });

      // Para cada tabela de dados...
      tabelas.forEach((tabela) => {
        // Verifica se a fonte de dados está definida
        const source = map.getSource(tabela);
        if (source) {
          // Se a fonte de dados existe, então você pode acessá-la
          const pointsData = source._data;

          // Armazene os dados dos pontos originais
          originalPointsData[tabela] = pointsData;

          // Use a função turf.pointsWithinPolygon para encontrar os pontos que estão dentro do polígono da isócrona
          const pointsWithin = turf.pointsWithinPolygon(pointsData, data);

          if (map.getLayer(tabela)) {
            map.removeLayer(tabela);
            map.removeSource(tabela);
          }

          // Adiciona os pontos dentro da isócrona ao mapa como uma nova fonte
          if (map.getLayer(tabela + "_within")) {
            map.removeLayer(tabela + "_within");
          }
          if (map.getSource(tabela + "_within")) {
            map.removeSource(tabela + "_within");
          }
          addOrUpdateSource(tabela + "_within", pointsWithin);

          // Adiciona uma nova camada ao mapa usando os pontos dentro da isócrona
          map.addLayer({
            id: tabela + "_within",
            type: "symbol",
            source: tabela + "_within",
            layout: {
              "icon-image": tabela,
              "icon-size": 0.02, // Altere o tamanho do ícone conforme necessário
              "icon-allow-overlap": true,
            },
          });
        } else {
          // Se a fonte de dados não está definida, lida com isso de alguma forma
          console.error("Fonte de dados não encontrada para tabela: ", tabela);
        }
      });
    });
}

// Quando o usuário clica no mapa...
map.on("click", function (e) {
  // Atualize o último ponto clicado
  lastClickedPoint = e.lngLat;

  tabelas.forEach((tabela) => {
    if (map.getLayer(tabela + "_within")) {
      map.removeLayer(tabela + "_within");
      map.removeSource(tabela + "_within");
    }
  });

  // Calcule a isócrona
  calculateIsochrone();
});

// Função para limpar todas as isócronas do mapa
function limparIsocronas() {
  // Remover a camada de isócronas, se existir
  if (map.getLayer("isochrone")) {
    map.removeLayer("isochrone");
  }

  // Remover a fonte de isócronas, se existir
  if (map.getSource("isochrone")) {
    map.removeSource("isochrone");
  }

  // Limpar as fontes e camadas de pontos dentro das isócronas
  tabelas.forEach((tabela) => {
    const sourceWithinId = tabela + "_within";
    if (map.getLayer(sourceWithinId)) {
      map.removeLayer(sourceWithinId);
    }
    if (map.getSource(sourceWithinId)) {
      map.removeSource(sourceWithinId);
    }
  });

  // Limpar a referência do último ponto clicado
  lastClickedPoint = null;
  refreshLayersAfterClear();
}

var markerA, markerB;

document.getElementById("addPointA").addEventListener("click", function () {
  // Se o marcador A já existir, remova-o
  if (markerA) markerA.remove();

  // Adicione um novo marcador A no centro do mapa
  markerA = new mapboxgl.Marker({ color: "red", draggable: true })
    .setLngLat(map.getCenter())
    .addTo(map);
});

document.getElementById("addPointB").addEventListener("click", function () {
  // Se o marcador B já existir, remova-o
  if (markerB) markerB.remove();

  // Adicione um novo marcador B no centro do mapa
  markerB = new mapboxgl.Marker({ color: "blue", draggable: true })
    .setLngLat(map.getCenter())
    .addTo(map);
});
var route;
var lineIds = [];
var lineDistance;

function calculateRoute() {
  if (!markerA || !markerB) return; // Se os pontos A e B não foram definidos, retorne

  var pointA = markerA.getLngLat();
  var pointB = markerB.getLngLat();

  // Converta as coordenadas para um formato que a API de roteamento possa entender
  var coordinates = `${pointA.lng},${pointA.lat};${pointB.lng},${pointB.lat}`;

  var apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  // Remova todas as linhas antigas do mapa
  lineIds.forEach((lineId) => {
    if (map.getLayer(lineId)) {
      map.removeLayer(lineId);
      map.removeSource(lineId);
    }
  });
  lineIds = []; // Limpe o array de IDs de linha

  // Faça uma solicitação para a API de roteamento
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // A resposta da API de roteamento incluirá uma rota que você pode adicionar ao mapa
      route = data.routes[0].geometry;

      // Calcule a distância da rota em metros usando turf.js
      var distance = turf.length(route, { units: "kilometers" }) * 1000;

      // Adicione a distância como uma propriedade da rota
      route.properties = { distance: distance };

      // Adicione a rota ao mapa
      if (map.getLayer("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: route,
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#FFA500",
          "line-width": 8,
        },
      });

      var routeStart = route.coordinates[0];
      var routeEnd = route.coordinates[route.coordinates.length - 1];

      var unreachablePoints = [];
      if (routeStart[0] !== pointA.lng || routeStart[1] !== pointA.lat) {
        unreachablePoints.push(pointA);
      }
      if (routeEnd[0] !== pointB.lng || routeEnd[1] !== pointB.lat) {
        unreachablePoints.push(pointB);
      }

      unreachablePoints.forEach((unreachablePoint) => {
        var point = turf.point([unreachablePoint.lng, unreachablePoint.lat]);
        var nearestPoint = turf.nearestPointOnLine(route, point);
        var lineToNearestPoint = turf.lineString([
          [unreachablePoint.lng, unreachablePoint.lat],
          nearestPoint.geometry.coordinates,
        ]);

        var lineId =
          "line-to-nearest-point-" +
          unreachablePoint.lng +
          "-" +
          unreachablePoint.lat;

        // Calcule a distância da linha em metros usando turf.js
        lineDistance =
          turf.length(lineToNearestPoint, { units: "kilometers" }) * 1000;

        map.addLayer({
          id: lineId,
          type: "line",
          source: {
            type: "geojson",
            data: lineToNearestPoint,
          },
          paint: {
            "line-color": "#ff0000",
            "line-width": 2,
          },
        });

        lineIds.push(lineId); // Adicione o ID da linha ao array de IDs de linha
      });
    });
}

// Cria um popup, mas não o adiciona ao mapa ainda.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on("mousemove", "route", function (e) {
  // Verifique se a distância está definida antes de tentar acessar toFixed
  if (route.properties.distance) {
    var routeDistance = route.properties.distance.toFixed(2);
    var distance = lineDistance.toFixed(2);

    // Atualiza a posição e o texto do popup
    popup
      .setLngLat(e.lngLat)
      .setText(`Distância: ${routeDistance}m + ~${distance}m`)
      .addTo(map);
  }
});

map.on("mouseleave", "route", function () {
  popup.remove();
});

document
  .getElementById("calculateRouteButton")
  .addEventListener("click", calculateRoute);

document.querySelectorAll(".class-title").forEach((title) => {
  title.addEventListener("click", (event) => {
    console.log("teste");
    event.target.parentNode.classList.toggle("active");
  });
});

var weatherMarker;
var openWeatherMapApiKey = "c2d56cde527ab835895db4be206e6c9d";

var popup_tempo; // Mantenha uma referência ao popup atual aqui
var isMarkerBeingDragged = false;

document
  .getElementById("addWeatherPoint")
  .addEventListener("click", function () {
    if (weatherMarker) weatherMarker.remove();

    var center = map.getCenter();

    weatherMarker = new mapboxgl.Marker({ color: "purple", draggable: true })
      .setLngLat(center)
      .addTo(map)
      .on("dragend", function () {
        fetchWeatherData();
      });

    // Fetch weather data immediately after adding the marker
    fetchWeatherData();
    function fetchWeatherData() {
      isMarkerBeingDragged = true;
      var lngLat = weatherMarker.getLngLat();

      // Construa a URL da API do OpenWeatherMap
      var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=${openWeatherMapApiKey}`;

      // Faça uma solicitação para a API do OpenWeatherMap
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Os dados meteorológicos estão agora no objeto de dados
          // Você pode acessar as informações que deseja exibir assim:
          var temperature = data.main.temp - 273.15; // Converta a temperatura de Kelvin para Celsius
          var feelsLike = data.main.feels_like - 273.15; // Converta a sensação térmica de Kelvin para Celsius
          var tempMin = data.main.temp_min - 273.15; // Converta a temperatura mínima de Kelvin para Celsius
          var tempMax = data.main.temp_max - 273.15; // Converta a temperatura máxima de Kelvin para Celsius
          var humidity = data.main.humidity; // Humidade
          var seaLevel = data.main.sea_level; // Nível do mar
          var windSpeed = data.wind.speed * 3.6; // Converta a velocidade do vento de m/s para km/h
          var weatherIcon = data.weather[0].icon; // Obtenha o ícone do tempo

          // Construa a URL do ícone do tempo
          var weatherIconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;

          // Remova o popup_tempo existente, se houver
          if (popup_tempo) {
            popup_tempo.remove();
          }

          // Agora você pode adicionar um popup_tempo ao mapa na localização clicada com as informações meteorológicas
          popup_tempo = new mapboxgl.Popup()
            .setLngLat(lngLat)
            .setHTML(
              `<h6>Informações meteorológicas</h6>
                    <img src="${weatherIconUrl}" alt="Ícone do tempo" width="100" height="100">
                    <p>Temperatura: ${temperature.toFixed(2)} °C</p>
                    <p>Sensação térmica: ${feelsLike.toFixed(2)} °C</p>
                    <p>Temperatura mínima: ${tempMin.toFixed(2)} °C</p>
                    <p>Temperatura máxima: ${tempMax.toFixed(2)} °C</p>
                    <p>Humidade: ${humidity} %</p>
                    <p>Pressão atmosférica: ${seaLevel} hPa</p>
                    <p>Velocidade do vento: ${windSpeed.toFixed(2)} km/h</p>`
            )
            .addTo(map);
          isMarkerBeingDragged = false;
          popup_tempo.on("close", function () {
            if (weatherMarker && !isMarkerBeingDragged) {
              weatherMarker.remove();
            }
          });
        });
    }
  });

function limparTudo() {
  // Limpe as isócronas
  limparIsocronas();

  // Remova os marcadores, se existirem
  if (markerA) markerA.remove();
  if (markerB) markerB.remove();

  // Remova a rota, se existir
  if (map.getLayer("route")) {
    map.removeLayer("route");
    map.removeSource("route");
  }

  // Remova todas as linhas antigas do mapa
  lineIds.forEach((lineId) => {
    if (map.getLayer(lineId)) {
      map.removeLayer(lineId);
      map.removeSource(lineId);
    }
  });
  lineIds = [];

  if (weatherMarker) weatherMarker.remove();
  if (popup) popup.remove();

  // Redefina os marcadores e a rota
  markerA = null;
  markerB = null;
  weatherMarker = null;
  popup = null;

  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
}

const recreateLayer = (tabela, sourceData) => {
  if (!map.getSource(tabela)) {
    map.addSource(tabela, {
      type: "geojson",
      data: sourceData,
    });

    map.addLayer({
      id: tabela,
      type: "symbol",
      source: tabela,
      layout: {
        "icon-image": tabela,
        "icon-size": 0.03,
        "icon-allow-overlap": true,
        visibility: "none",
      },
    });
  }
};

const refreshLayersAfterClear = () => {
  tabelas.forEach((tabela) => {
    recreateLayer(tabela, originalPointsData[tabela]);
  });
};

window.onload = function () {
  // Obtenha os elementos selecionados
  var routingProfileElement = document.getElementById("routingProfile");
  var contourTypeElement = document.getElementById("contourType");
  var contourElement = document.getElementById("contour");

  // Quando as opções são alteradas...
  routingProfileElement.addEventListener("change", calculateIsochrone);
  contourTypeElement.addEventListener("change", calculateIsochrone);
  contourElement.addEventListener("change", calculateIsochrone);
};
