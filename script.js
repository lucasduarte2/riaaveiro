// Define a chave de acesso do Mapbox
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2RhbmllbHNpbHZhIiwiYSI6ImNsdmY0bTUwNDAzbWwyamw4NjUwMW5paTUifQ.0MAtfqLmatOkT_NjHAo9Ag";

// Cria um novo mapa
const map = new mapboxgl.Map({
  container: "map", // ID do elemento HTML que irá conter o mapa
  center: [-8.66251015660316, 40.6469574920449], // Coordenadas do centro inicial do mapa
  zoom: 15.2, // Nível de zoom inicial
  pitch: 45, // Ângulo de inclinação inicial
  bearing: 0, // Direção inicial
  maxBounds: [-9.6, 40.4, -8.45, 41], // Limites máximos do mapa
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());
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
  /*   "percurso_azul",
  "percurso_dourado",
  "percurso_natureza",
  "percurso_verde", */
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
      fetch(`bd.php?tabela=${tabela}`)
        .then((response) => response.json()) // Converte a resposta em JSON
        .then((data) => {
          /*         console.log(`Dados carregados para ${tabela}:`, data); // Adicione este console.log */
          // Adiciona os dados ao mapa como uma nova fonte
          map.addSource(tabela, {
            type: "geojson",
            data: data,
          });

          // Carrega a imagem do ícone
          map.loadImage(getLayerImage(tabela), function (error, image) {
            if (error) throw error;

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

            // Quando o mouse entra em um ponto na camada...
            map.on("mouseenter", tabela, function (e) {
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
                .setHTML(
                  "<h3>" +
                    tabela +
                    "</h3><p>" +
                    e.features[0].properties.description +
                    "</p>"
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

  // Adiciona as camadas ao mapa quando o mapa é carregado pela primeira vez.
  addLayers();

  const originalStyle = map.getStyle();

  // Código para alternar o estilo do mapa...
  const layerList = document.getElementById("map-switcher");
  const inputs = layerList.getElementsByTagName("input");

  for (const input of inputs) {
    input.onclick = (layer) => {
      const layerId = layer.target.id;
      if (layerId === "original") {
        // Se o usuário selecionar "original", volta para o estilo original.
        map.setStyle(originalStyle);
      } else {
        map.setStyle("mapbox://styles/mapbox/" + layerId);
      }
    };
  }

  // Adiciona as camadas ao mapa sempre que o estilo do mapa é alterado.
  map.on("style.load", addLayers);

  // Após o último frame renderizado antes do mapa entrar em um estado "idle"...
  map.on("idle", () => {
    // Enumera os ids das camadas.
    const toggleableLayerIds = [
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
      /*       "percurso_azul",
      "percurso_dourado",
      "percurso_natureza",
      "percurso_verde", */
      "point_porto",
      "point_praias",
      "restaurantes",
      /* "ria_aveiro", */
      "point_surf",
      "terminal_ferry",
      "salinas",
      "voleipraia",
    ];

    for (const id of toggleableLayerIds) {
      // Ignora as camadas que já têm um botão configurado.
      if (document.getElementById(id)) {
        continue;
      }

      // Cria um link.
      const link = document.createElement("a");
      link.id = id;
      link.href = "#";
      link.textContent = id;
      link.className = "active";

      // Mostra ou esconde a camada quando o toggle é clicado.
      link.onclick = function (e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        const visibility = map.getLayoutProperty(clickedLayer, "visibility");

        // Alterna a visibilidade da camada.
        if (visibility === "visible") {
          map.setLayoutProperty(clickedLayer, "visibility", "none");
          this.className = "";
        } else {
          this.className = "active";
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
      };

      const layers = document.getElementById("menu");
      layers.appendChild(link);
    }
  });

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
});

// Quando o estilo do mapa terminar de carregar...
map.on("style.load", () => {
  // Define a propriedade "lightPreset" do mapa para "dawn"
  map.setConfigProperty("basemap", "lightPreset", "dawn");
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
  const sidebarToggle = document.getElementById("sidebar-toggle");
  sidebar.classList.toggle("show");
  sidebarToggle.querySelector(".arrow-icon").classList.toggle("rotate"); // Adiciona ou remove a classe 'rotate' ao ícone
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
