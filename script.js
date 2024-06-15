var markerA, markerB, markerIntermedio, markerAtual, markerPI_maisProximo;

document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("popupLayers");
  var popup_mapa = document.getElementById("popupOpcoesMapa");

  const defaultProfile = document.getElementById("routingProfile").value;
  loadSelectedIcon(defaultProfile);

  // Exibir o pop-up após 2 segundos
  setTimeout(function () {
    popup.style.display = "block";
    popup.style.animation = "slideInFromRight 0.5s ease forwards";
  }, 2000);

  // Ocultar o pop-up após 7 segundos
  setTimeout(function () {
    popup.style.animation = "slideOutToRight 0.5s ease forwards";
    setTimeout(function () {
      popup.style.display = "none";
    }, 500);
  }, 7000);

  // Exibir o pop-up após 2 segundos
  setTimeout(function () {
    popup_mapa.style.display = "block";
    popup_mapa.style.animation = "slideInFromLeft 0.5s ease forwards";
  }, 2000);

  // Ocultar o pop-up após 7 segundos
  setTimeout(function () {
    popup_mapa.style.animation = "slideOutToLeft 0.5s ease forwards";
    setTimeout(function () {
      popup_mapa.style.display = "none";
    }, 500);
  }, 7000);

});


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
const geolocateControl = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
  showUserHeading: true,
});

map.addControl(geolocateControl);

geolocateControl.on('geolocate', function (event) {
  const lng = event.coords.longitude;
  const lat = event.coords.latitude;
  const coords = [lng, lat];

  // Se o marcador já existir, movê-lo para a nova localização
  if (markerAtual) {
    markerAtual.setLngLat(coords);
  } else {
    // Caso contrário, criar um novo marcador
    const markerColor = 'pink'; // cor do marcador
    markerAtual = new mapboxgl.Marker({ color: markerColor, draggable: true })
      .setLngLat(coords)
      .addTo(map);

    var popupAtual;
    popupAtual = new mapboxgl.Popup({ offset: 25 })
      .setLngLat(coords)
      .setText('Ponto de localização atual')
      .addTo(map);

    markerAtual.setPopup(popupAtual);
  }

  calculateRoute();
});

// Função para remover o marcador
function removeMarker() {
  if (markerAtual) {
    markerAtual.remove();
    markerAtual = null;
  }

  calculateRoute();
}

// Esperar até que o mapa esteja totalmente carregado
map.on('load', function () {
  // Adicionar ouvinte de eventos ao controle de geolocalização para detectar desativação
  const geolocateButton = document.querySelector('.mapboxgl-ctrl-geolocate');
  if (geolocateButton) {
    geolocateButton.addEventListener('click', function () {
      setTimeout(function () {
        if (geolocateControl._watchState === 'OFF') {
          removeMarker();
        }
      }, 250); // Pequeno atraso para garantir que o estado seja atualizado
    });
  }
});

let isRotating = true;
let lastInteractionTime = Date.now();

function rotateCamera(timestamp) {
  // clamp the rotation between 0 -360 degrees
  // Divide timestamp by 200 to slow rotation to ~5 degrees / sec
  if (isRotating) {
    map.rotateTo((timestamp / 300) % 360, { duration: 0 });
  }
  // Request the next frame of the animation.
  requestAnimationFrame(rotateCamera);
}

// Add event listeners for user interactions
map.on('mousedown', () => {
  isRotating = false;
  lastInteractionTime = Date.now();
});

map.on('mouseup', () => {
  setTimeout(() => {
    if (Date.now() - lastInteractionTime >= 100000) {
      isRotating = true;
    }
  }, 100000);
});

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
  // Inicia a rotação após 5 segundos de inatividade
  setTimeout(() => {
    isRotating = true;
    rotateCamera(0); // Inicia a animação da rotação
  }, 100000);

  map.setFog({
    'range': [-1, 9],
    'horizon-blend': 0.3,
    'color': '#242B4B',
    'high-color': '#161B36',
    'space-color': '#0B1026',
    'star-intensity': 0.8
  })

  // Nova camada WMS
  map.addSource('batimetria25mLayer', {
    'type': 'raster',
    'tiles': [
      'https://gis4cloud.pt/geoserver/wms?service=WMS&request=GetMap&layers=grupo4_ptas2024:Aveiro&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}'

      //'https://gis4cloud.pt/geoserver/wms?service=WMS&request=GetMap&layers=grupo4_ptas2024:Aveiro_25m&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}'
    ],
    'tileSize': 256
  });

  map.addLayer({
    'id': 'batimetria25m',
    'type': 'raster',
    'source': 'batimetria25mLayer',
    'paint': {
      'raster-opacity': 0
    },
  });

  map.addSource('batimetria2mLayer', {
    'type': 'raster',
    'tiles': [
      'https://gis4cloud.pt/geoserver/wms?service=WMS&request=GetMap&layers=grupo4_ptas2024:Aveiro%20Batimetria%20Reclassificada&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox={bbox-epsg-3857}'
    ],
    'tileSize': 256
  });

  map.addLayer({
    'id': 'batimetria2m',
    'type': 'raster',
    'source': 'batimetria2mLayer',
    'paint': {
      'raster-opacity': 0
    }
  });

  function createPopupHTMLPI(tabela, nome, addressHTML, streetViewUrl) {
    return `
      <h6><b>Tipo:</b> ${tabela}</h6>
      <p><b>Nome:</b> ${nome}</p>
      ${addressHTML}
      <p><a href="${streetViewUrl}" target="_blank">Ver no Google Street View</a></p>
      <p><button id="add_PI_to_Route">Adicionar à rota</button><p>
    `;
  }

  function addLayers() {
    let currentPopup = null; // Variável para armazenar o popup atual
    let closePopupTimeout = null; // Variável para armazenar o timeout

    tabelas.forEach((tabela) => {
      // Busca os dados da tabela
      fetch(`https://gis4cloud.com/grupo4_ptas2024/bd.php?tabela=${tabela}`)
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
              closeButton: true, // Adiciona o botão de fechar
              closeOnClick: false,
            });

            // Função para fechar o popup atual se existir
            function closeCurrentPopup() {
              if (currentPopup) {
                currentPopup.remove();
                currentPopup = null;
              }
            }

            // Quando o mouse entra em um ponto na camada dentro da isocrona...
            map.on("mouseenter", tabela + "_within", function (e) {
              closeCurrentPopup(); // Fecha o popup atual
              if (closePopupTimeout) {
                clearTimeout(closePopupTimeout);
                closePopupTimeout = null;
              }

              // Muda o estilo do cursor como um indicador de interface do usuário.
              map.getCanvas().style.cursor = "pointer";

              // Copia a matriz de coordenadas.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const nome = e.features[0].properties.nome ? e.features[0].properties.nome : 'Desconhecido';

              // Construa a URL do Google Maps Street View com as coordenadas do ponto
              var streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coordinates[1]},${coordinates[0]}`;

              // Garante que se o mapa estiver ampliado de tal forma que várias
              // cópias do recurso estejam visíveis, o popup apareça
              // sobre a cópia que está sendo apontada.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Faz a chamada à API de reversão do OpenStreetMap para obter o endereço
              fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=json`)
                .then(response => response.json())
                .then(data => {
                  const addressParts = data.address;
                  const rua = addressParts.road ? addressParts.road : 'Desconhecido';
                  const codigoPostal = addressParts.postcode ? addressParts.postcode : 'Desconhecido';
                  const cidade = addressParts.city ? addressParts.city : 'Desconhecido';
                  const addressHTML = `
                    <p><strong>Rua:</strong> ${rua}</p>
                    <p><strong>Código Postal:</strong> ${codigoPostal}</p>
                    <p><strong>Cidade:</strong> ${cidade}</p>
                  `;
                  // Preenche o popup e define suas coordenadas
                  // com base no recurso encontrado.
                  popup
                    .setLngLat(coordinates)
                    .setHTML(createPopupHTMLPI(tabela, nome, addressHTML, streetViewUrl))
                    .addTo(map);
                  currentPopup = popup; // Armazena o popup atual

                  // Adiciona o manipulador de eventos para o botão "Adicionar à rota"
                  document.getElementById("add_PI_to_Route").addEventListener("click", function () {
                    addToRoute(coordinates);
                  });
                })
                .catch(error => console.error("Error fetching address:", error));
            });

            // Quando o mouse sai de um ponto na camada...
            map.on("mouseleave", tabela + "_within", function () {
              map.getCanvas().style.cursor = "";
              // Define o temporizador para fechar o popup após 2 segundos
              closePopupTimeout = setTimeout(() => {
                closeCurrentPopup(); // Fecha o popup atual
              }, 2000);
            });

            // Quando o mouse entra em um ponto na camada...
            map.on("mouseenter", tabela, function (e) {
              closeCurrentPopup(); // Fecha o popup atual
              if (closePopupTimeout) {
                clearTimeout(closePopupTimeout);
                closePopupTimeout = null;
              }

              // Muda o estilo do cursor como um indicador de interface do usuário.
              map.getCanvas().style.cursor = "pointer";

              // Copia a matriz de coordenadas.
              const coordinates = e.features[0].geometry.coordinates.slice();
              const nome = e.features[0].properties.nome ? e.features[0].properties.nome : 'Desconhecido';

              // Construa a URL do Google Maps Street View com as coordenadas do ponto
              var streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coordinates[1]},${coordinates[0]}`;

              // Garante que se o mapa estiver ampliado de tal forma que várias
              // cópias do recurso estejam visíveis, o popup apareça
              // sobre a cópia que está sendo apontada.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Faz a chamada à API de reversão do OpenStreetMap para obter o endereço
              fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=json`)
                .then(response => response.json())
                .then(data => {
                  const addressParts = data.address;
                  const rua = addressParts.road ? addressParts.road : 'Desconhecido';
                  const codigoPostal = addressParts.postcode ? addressParts.postcode : 'Desconhecido';
                  const cidade = addressParts.city ? addressParts.city : 'Desconhecido';
                  const addressHTML = `
                    <p><strong>Rua:</strong> ${rua}</p>
                    <p><strong>Código Postal:</strong> ${codigoPostal}</p>
                    <p><strong>Cidade:</strong> ${cidade}</p>
                  `;
                  // Preenche o popup e define suas coordenadas
                  // com base no recurso encontrado.
                  popup
                    .setLngLat(coordinates)
                    .setHTML(createPopupHTMLPI(tabela, nome, addressHTML, streetViewUrl))
                    .addTo(map);
                  currentPopup = popup;

                  // Adiciona o manipulador de eventos para o botão "Adicionar à rota"
                  document.getElementById("add_PI_to_Route").addEventListener("click", function () {
                    addToRoute(coordinates);
                  });
                })
                .catch(error => console.error("Error fetching address:", error));
            });

            // Quando o mouse sai de um ponto na camada...
            map.on("mouseleave", tabela, function () {
              map.getCanvas().style.cursor = "";
              // Define o temporizador para fechar o popup após 2 segundos
              closePopupTimeout = setTimeout(() => {
                closeCurrentPopup(); // Fecha o popup atual
              }, 2000);
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
    "percurso_salreu",
    "percurso_fermela",
    "percurso_pardilho",
    "percurso_veiros"
  ];

  function createPopupHTML(properties) {

    // Constrói e retorna o HTML para o popup com base nas propriedades do percurso

    return `

      <div>

        <h4>${properties.Nome_do_Percurso}</h4>

        <p><b>Distância:</b> ${properties.Distancia_Km}</p>

        <p><b>Duração Estimada:</b> ${properties.Duracao_Estimada}</p>

        <p><b>Âmbito:</b> ${properties.Ambito}</p>

        <p><b>Grau de Dificuldade:</b> ${properties.Grau_Dificuldade}</p>

        <p><b>Época Aconselhada:</b> ${properties.Epoca_Aconselhada}</p>

      </div>

    `;

  }

  function createPopupHTML_Nauticos(properties) {

    // Constrói e retorna o HTML para o popup com base nas propriedades do percurso

    return `

      <div>

        <h4>${properties.Nome_do_Percurso}</h4>

        <p><b>Distância:</b> ${properties.Distancia_Km}</p>

        <p><b>Grau de Dificuldade:</b> ${properties.Grau_Dificuldade}</p>

        <p><b>Tipologia:</b> ${properties.Tipologia}</p>

        <p><b>Duração Estimada:</b> ${properties.Duracao_Estimada}</p>

        <p><b>Ponto de entrada:</b> ${properties.Ponto_Entrada}</p>

        <p><b>Ponto de saída:</b> ${properties.Ponto_Saida}</p>


      </div>

    `;

  }

  let currentPopup = null; // Variável para armazenar o popup atual

  // Objeto mapeando os percursos às suas cores

  const coresDosPercursos = {

    "percurso_azul": "#0000FF", // Azul

    "percurso_dourado": "#FFD700", // Dourado

    "percurso_verde": "#008000", // Verde

    "percurso_natureza": "#2E8B57", // Um verde mais natural

    "percurso_salreu": "#ADD8E6", // Um azul claro, por exemplo

    "percurso_fermela": "#FFC0CB", // Rosa, apenas como exemplo

    "percurso_pardilho": "#A52A2A", // Marrom, apenas como exemplo

    "percurso_veiros": "#FFFF00", // Amarelo, apenas como exemplo
  };

  const coresDosPercursosNauticos = {

    "percurso_a": "#FF69B4",
    "percurso_b": "#FF69B4",
    "percurso_c": "#FF69B4",
    "percurso_d": "#FF69B4",
    "percurso_e": "#FF69B4",
    "percurso_f": "#FF69B4",
    "percurso_g": "#FF69B4",
    "percurso_h": "#FF69B4",
    "percurso_i": "#FF69B4",
    "percurso_j": "#FF69B4",
    "percurso_k": "#FF69B4",
    "percurso_l": "#FF69B4",
  };


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

          type: "line",

          source: percurso,

          layout: {

            "line-join": "round",

            "line-cap": "round",

            visibility: "none",

          },

          paint: {

            "line-color": coresDosPercursos[percurso], // Define a cor da linha com base no mapeamento

            "line-width": 5, // Exemplo de largura da linha

          },

        });



        // Adiciona evento para exibir popup quando o mouse entra na camada do percurso

        map.on('mouseenter', percurso, function (e) {

          // Certifique-se de que as propriedades do percurso estão presentes

          if (e.features.length > 0) {

            var feature = e.features[0];

            // Cria o HTML para o popup com base nas propriedades do percurso

            var popupHTML = createPopupHTML(feature.properties);



            // Fecha o popup atual se existir

            if (currentPopup) {

              currentPopup.remove();

            }



            // Cria e exibe o popup

            currentPopup = new mapboxgl.Popup()

              .setLngLat(e.lngLat)

              .setHTML(popupHTML)

              .addTo(map);

          }

        });



        // Adiciona evento para ocultar o popup quando o mouse sai da camada do percurso

        map.on('mouseleave', percurso, function () {

          map.getCanvas().style.cursor = '';

          if (currentPopup) {

            currentPopup.remove();

            currentPopup = null; // Reseta a variável currentPopup

          }
        });
      });
  });

  var percursos_nauticos = [
    "percurso_a",
    "percurso_b",
    "percurso_c",
    "percurso_d",
    "percurso_e",
    "percurso_f",
    "percurso_g",
    "percurso_h",
    "percurso_i",
    "percurso_j",
    "percurso_k",
    "percurso_l",
  ];

  percursos_nauticos.forEach(function (percurso_nautico) {
    fetch(`percursos_nauticos.php?tabela=${percurso_nautico}`)
      .then((response) => response.json()) // Converte a resposta em JSON
      .then((data) => {
        // Adiciona os dados do percurso ao mapa como uma nova fonte
        map.addSource(percurso_nautico, {
          type: "geojson",
          data: data,
        });

        // Adiciona uma nova camada ao mapa para renderizar o percurso
        map.addLayer({
          id: percurso_nautico,
          type: "line", // Tipo de geometria do percurso, pode ser 'line' ou 'fill', dependendo do que você tem no banco de dados
          source: percurso_nautico,
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: "none",
          },
          paint: {

            "line-color": coresDosPercursosNauticos[percurso_nautico], // Define a cor da linha com base no mapeamento

            "line-width": 5, // Exemplo de largura da linha

          },
        });



        // Adiciona evento para exibir popup quando o mouse entra na camada do percurso

        map.on('mouseenter', percurso_nautico, function (e) {

          // Certifique-se de que as propriedades do percurso estão presentes

          if (e.features.length > 0) {

            var feature = e.features[0];

            // Cria o HTML para o popup com base nas propriedades do percurso

            var popupHTML = createPopupHTML_Nauticos(feature.properties);



            // Fecha o popup atual se existir

            if (currentPopup) {

              currentPopup.remove();

            }



            // Cria e exibe o popup

            currentPopup = new mapboxgl.Popup()

              .setLngLat(e.lngLat)

              .setHTML(popupHTML)

              .addTo(map);

          }

        });



        // Adiciona evento para ocultar o popup quando o mouse sai da camada do percurso

        map.on('mouseleave', percurso_nautico, function () {

          map.getCanvas().style.cursor = '';

          if (currentPopup) {

            currentPopup.remove();

            currentPopup = null; // Reseta a variável currentPopup

          }
        });
      });
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
      "percurso_salreu",
      "percurso_fermela",
      "percurso_pardilho",
      "percurso_veiros"
    ],
    PercursosNauticos: [
      "percurso_a",
      "percurso_b",
      "percurso_c",
      "percurso_d",
      "percurso_e",
      "percurso_f",
      "percurso_g",
      "percurso_h",
      "percurso_i",
      "percurso_j",
      "percurso_k",
      "percurso_l"
    ]
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
    percurso_salreu: "Percurso Salreu",
    percurso_fermela: "Percurso Fermelã",
    percurso_pardilho: "Percurso Pardilhó",
    percurso_veiros: "Percurso Veiros",
    percurso_a: "Percurso A",
    percurso_b: "Percurso B",
    percurso_c: "Percurso C",
    percurso_d: "Percurso D",
    percurso_e: "Percurso E",
    percurso_f: "Percurso F",
    percurso_g: "Percurso G",
    percurso_h: "Percurso H",
    percurso_i: "Percurso I",
    percurso_j: "Percurso J",
    percurso_k: "Percurso K",
    percurso_l: "Percurso L",
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
          const layerContainer = document.createElement("div");
          layerContainer.className = "form-check form-switch";

          const checkbox = document.createElement("input");
          checkbox.className = "form-check-input";
          checkbox.type = "checkbox";
          checkbox.role = "switch";
          checkbox.id = layer;
          checkbox.onchange = function () {
            toggleLayerVisibility(layer, this);
          };

          const label = document.createElement("label");
          label.className = "form-check-label";
          label.htmlFor = layer;
          label.textContent = layerNames[layer] || layer;

          layerContainer.appendChild(checkbox);
          layerContainer.appendChild(label);
          layersDiv.appendChild(layerContainer);
        }
      }

      // Adicionar botões de batimetria à div com ID "Batimetrias"
      const batimetriaDiv = document.querySelector("#Batimetrias .layers");
      const batimetriaLayers = ["batimetria25m", "batimetria2m"];

      for (const layer of batimetriaLayers) {
        const layerContainer = document.createElement("div");
        layerContainer.className = "form-check form-switch";

        const checkbox = document.createElement("input");
        checkbox.className = "form-check-input";
        checkbox.type = "checkbox";
        checkbox.role = "switch";
        checkbox.id = layer;
        checkbox.onchange = function () {
          toggleBatimetriaVisibility(layer, this);
        };

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = layer;
        label.textContent = layerNames[layer] || layer;

        layerContainer.appendChild(checkbox);
        layerContainer.appendChild(label);
        batimetriaDiv.appendChild(layerContainer);
      }

      // Atualize a variável para indicar que os links das layers foram adicionados
      layersAdded = true;
    }
  });

  function toggleBatimetriaVisibility(layerId, checkbox) {
    const legend25m = document.getElementById('legend25m');
    const legend2m = document.getElementById('legend2m');

    if (checkbox.checked) {
      map.setPaintProperty(layerId, 'raster-opacity', 1);
      if (layerId === 'batimetria25m') {
        legend25m.style.display = 'block';
      } else if (layerId === 'batimetria2m') {
        legend2m.style.display = 'block';
      }
    } else {
      map.setPaintProperty(layerId, 'raster-opacity', 0);
      if (layerId === 'batimetria25m') {
        legend25m.style.display = 'none';
      } else if (layerId === 'batimetria2m') {
        legend2m.style.display = 'none';
      }
    }
  }

  function toggleLayerVisibility(layer, switchElement) {
    // Verifique tanto a camada original quanto a camada dentro da isocrona
    const layerId = [layer, layer + "_within"].find((id) => map.getLayer(id));
    if (layerId) {
      const visibility = map.getLayoutProperty(layerId, "visibility");

      // Alterna a visibilidade da camada.
      if (visibility === "visible") {
        map.setLayoutProperty(layerId, "visibility", "none");
        switchElement.checked = false;
      } else {
        map.setLayoutProperty(layerId, "visibility", "visible");
        switchElement.checked = true;
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

function toggleSidebarLayers() {
  const sidebar = document.getElementById("sidebarLayers");
  const arrowIcon = document.querySelector(".sidebarLayers-toggle .arrow-icon");
  sidebar.classList.toggle("show");
  if (sidebar.classList.contains("show")) {
    arrowIcon.innerHTML = "»";
  } else {
    arrowIcon.innerHTML = "«";
  }
}

function toggleArrow(element) {
  element.querySelector("span").classList.toggle("fa-arrow-up");
  element.querySelector("span").classList.toggle("fa-arrow-down");
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

// Variável para verificar se o utilizador já clicou no mapa
var mapClicked = false;

// Função para calcular a isócrona
function calculateIsochrone() {
  // Se nenhum ponto foi clicado ainda, retorne
  if (mapClicked == false) {
    console.log("Clique no mapa para selecionar o ponto antes de calcular a isócrona.");
    return;
  }

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

  // Obtenha os elementos selecionados dinamicamente
  var selectedVehicle = document.querySelector('.veiculos .option.selected');
  var routingProfile = selectedVehicle ? selectedVehicle.getAttribute('data-value') : null;

  var selectedMetric = document.querySelector('.metrica .option.selected');
  var contourType = selectedMetric ? selectedMetric.getAttribute('data-value') : null;

  var sliderValue = document.getElementById("myRange").value;
  var contour;

  // Determine o valor de contour com base no tipo de métrica selecionada
  if (contourType === 'minutes') {
    contour = valuesMinutos[sliderValue];
  } else if (contourType === 'meters') {
    contour = valuesMetros[sliderValue];
  } else {
    contour = ''; // Ou outro valor padrão apropriado ao seu caso
  }

  // Construa a URL da API do Mapbox Isochrone
  var apiUrl = `https://api.mapbox.com/isochrone/v1/mapbox/${routingProfile}/${coordinates.lng}%2C${coordinates.lat}?contours_${contourType}=${contour}&polygons=true&denoise=1&access_token=pk.eyJ1Ijoic2RhbmllbHNpbHZhIiwiYSI6ImNsdmY0bTUwNDAzbWwyamw4NjUwMW5paTUifQ.0MAtfqLmatOkT_NjHAo9Ag`;

  console.log(`Isócrona - veículo: ${routingProfile}, métrica: ${contourType}, quantidade: ${contour}`);

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
  mapClicked = true;

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

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var sliderContainer = document.getElementById("sliderContainer");

// Define os valores possíveis e seus correspondentes textuais para minutos e metros
var valuesMinutos = {
  1: "5",
  2: "10",
  3: "15",
  4: "20",
  5: "25",
  6: "30"
};

var valuesMetros = {
  1: "1000",
  2: "2000",
  3: "3000",
  4: "4000",
  5: "5000"
};

// Inicializa o valor inicial
output.innerHTML = valuesMinutos[slider.value];

// Atualiza o valor mostrado conforme o slider é movido
slider.oninput = function () {
  updateSliderValue();
};

// Função para atualizar o valor do slider e recalcular a isócrona
function updateSliderValue() {
  var selectedMetric = document.querySelector('.metrica .option.selected');
  var contourType = selectedMetric ? selectedMetric.getAttribute('data-value') : null;

  if (contourType === 'minutes') {
    output.innerHTML = valuesMinutos[slider.value];
  } else if (contourType === 'meters') {
    output.innerHTML = valuesMetros[slider.value];
  }

  calculateIsochrone();
}

// Função para selecionar a métrica (Minutos ou Metros)
function selectMetric(metricType) {
  // Atualiza visualmente a seleção
  document.querySelectorAll('.metrica .option').forEach(option => {
    if (option.getAttribute('data-value') === metricType) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });

  // Atualiza os valores do slider com base na métrica selecionada
  if (metricType === 'minutes') {
    slider.setAttribute('max', 6); // Define o máximo como 6 para minutos
    output.innerHTML = valuesMinutos[slider.value];
  } else {
    slider.setAttribute('max', 5); // Define o máximo como 5 para metros
    output.innerHTML = valuesMetros[slider.value];
  }

  // Mostra o slidecontainer ao selecionar minutos ou metros
  sliderContainer.style.display = 'block';

  // Atualiza o valor do slider
  updateSliderValue();

  calculateIsochrone();
}

function selectOption(element, inputId, value) {
  console.log("Element clicked:", element);
  console.log("Input ID:", inputId);
  console.log("Value to set:", value);

  const input = document.getElementById(inputId);
  console.log("Input element found:", input);

  const container = element.parentElement;

  // Verifica se o elemento clicado já está selecionado
  if (element.classList.contains('selected')) {
    element.classList.remove('selected');
    if (input) {
      input.value = ''; // Limpa o valor do input se encontrado
    } else {
      console.warn("Input element not found with ID:", inputId);
    }
  } else {
    // Deseleciona todas as outras opções dentro do mesmo container
    container.querySelectorAll('.option').forEach(option => {
      option.classList.remove('selected');
    });

    // Seleciona o elemento clicado
    element.classList.add('selected');
    if (input) {
      input.value = value; // Define o valor do input como o valor selecionado se encontrado
    } else {
      console.warn("Input element not found with ID:", inputId);
    }
  }

  // Atualize o ícone com base no valor selecionado
  loadSelectedIcon();

  calculateIsochrone();
}

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

  // Limpar os campos de pesquisa de moradas
  document.getElementById("addressInputA").value = "";
  document.getElementById("addressInputB").value = "";
  document.getElementById("addressInputIntermedio").value = "";
  document.getElementById("addressInputWeather").value = "";
}

var weatherMarker;
var openWeatherMapApiKey = "c2d56cde527ab835895db4be206e6c9d";

var popup_tempo; // Mantenha uma referência ao popup atual aqui
var isMarkerBeingDragged = false;

document.getElementById("addWeatherPoint").addEventListener("click", function () {
  if (weatherMarker) weatherMarker.remove();

  var center = map.getCenter();

  weatherMarker = new mapboxgl.Marker({ color: "purple", draggable: true })
    .setLngLat(center)
    .addTo(map)
    .on("dragend", function () {
      fetchWeatherData(weatherMarker.getLngLat());
    });

  // Fetch weather data immediately after adding the marker
  fetchWeatherData(center);
});

function fetchWeatherData(lngLat) {
  isMarkerBeingDragged = true;

  // Construa a URL da API do OpenWeatherMap
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=${openWeatherMapApiKey}`;

  // Faça uma solicitação para a API do OpenWeatherMap
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Os dados meteorológicos estão agora no objeto de dados
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

document.getElementById("addPointA").addEventListener("click", function () {
  // Se o marcador A já existir, remova-o
  if (markerA) markerA.remove();

  // Adicione um novo marcador A no centro do mapa
  markerA = new mapboxgl.Marker({ color: "red", draggable: true })
    .setLngLat(map.getCenter())
    .addTo(map);

  var popupA;
  popupA = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(map.getCenter())
    .setText('Ponto A')
    .addTo(map);

  markerA.setPopup(popupA);
});

document.getElementById("addPointB").addEventListener("click", function () {
  // Se o marcador B já existir, remova-o
  if (markerB) markerB.remove();

  // Adicione um novo marcador B no centro do mapa
  markerB = new mapboxgl.Marker({ color: "blue", draggable: true })
    .setLngLat(map.getCenter())
    .addTo(map);

  var popupB;
  popupB = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(map.getCenter())
    .setText('Ponto B')
    .addTo(map);

  markerB.setPopup(popupB);
});

document.getElementById("addPointIntermedio").addEventListener("click", function () {
  // Se o marcador intermédio já existir, remova-o
  if (markerIntermedio) markerIntermedio.remove();

  // Adicione um novo marcador B no centro do mapa
  markerIntermedio = new mapboxgl.Marker({ color: "orange", draggable: true })
    .setLngLat(map.getCenter())
    .addTo(map);

  var popupIntermedio;
  popupIntermedio = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(map.getCenter())
    .setText('Ponto Intermédio')
    .addTo(map);

  markerIntermedio.setPopup(popupIntermedio);

  calculateRoute();
});

var markerPI = null; // Variável para armazenar o marcador do ponto de interesse

function addToRoute(coordinates) {
  if (markerPI) markerPI.remove();

  // Adiciona um novo marcador para o ponto de interesse
  markerPI = new mapboxgl.Marker({ color: 'green' })
    .setLngLat(coordinates)
    .addTo(map);

  var popupPI_escolhido;
  popupPI_escolhido = new mapboxgl.Popup({ offset: 25 })
    .setLngLat(coordinates)
    .setText('Ponto de interesse escolhido')
    .addTo(map);

  markerPI.setPopup(popupPI_escolhido);

  calculateRoute(); // Recalcula a rota incluindo o novo ponto de interesse
}


// Função para adicionar o autocomplete e a busca de endereço
function addAutocompleteAndSearch(inputId, markerColor, map) {
  $(function () {
    $(`#${inputId}`).autocomplete({
      source: function (request, response) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(request.term)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true`;

        axios.get(url)
          .then(res => {
            // Filtra as moradas dentro dos limites do mapa
            const featuresWithinBounds = res.data.features.filter(feature => {
              const coords = feature.geometry.coordinates;
              const lngLat = mapboxgl.LngLat.convert(coords);
              return lngLat.lng >= -9.6 && lngLat.lng <= -8.45 && lngLat.lat >= 40.4 && lngLat.lat <= 41;
            });

            response(featuresWithinBounds.map(feature => ({
              label: feature.place_name,
              value: feature.place_name,
              feature: feature
            })));
          })
          .catch(err => {
            console.error(err);
            response([]);
          });
      },
      minLength: 2,
      select: function (event, ui) {
        const coords = ui.item.feature.geometry.coordinates;
        const description = ui.item.feature.place_name;

        // Centralize o mapa na localização
        map.flyTo({
          center: coords,
          zoom: 15
        });

        // Adiciona o marcador correspondente ao campo de busca
        if (inputId === "addressInputA") {
          if (markerA) markerA.remove();
          markerA = new mapboxgl.Marker({ color: markerColor, draggable: true })
            .setLngLat(coords)
            .addTo(map);

          var popupA;
          popupA = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coords)
            .setText('Ponto A')
            .addTo(map);

          markerA.setPopup(popupA);
        } else if (inputId === "addressInputB") {
          if (markerB) markerB.remove();
          markerB = new mapboxgl.Marker({ color: markerColor, draggable: true })
            .setLngLat(coords)
            .addTo(map);

          var popupB;
          popupB = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coords)
            .setText('Ponto B')
            .addTo(map);

          markerB.setPopup(popupB);
        } else if (inputId === "addressInputIntermedio") {
          if (markerIntermedio) markerIntermedio.remove();
          markerIntermedio = new mapboxgl.Marker({ color: markerColor, draggable: true })
            .setLngLat(coords)
            .addTo(map);

          var popupIntermedio;
          popupIntermedio = new mapboxgl.Popup({ offset: 25 })
            .setLngLat(coords)
            .setText('Ponto Intermédio')
            .addTo(map);

          markerIntermedio.setPopup(popupIntermedio);
          calculateRoute();
        } else if (inputId === "addressInputWeather") {
          if (weatherMarker) weatherMarker.remove();
          weatherMarker = new mapboxgl.Marker({ color: markerColor, draggable: true })
            .setLngLat(coords)
            .addTo(map)
            .on("dragend", function () {
              fetchWeatherData(weatherMarker.getLngLat());
            });
          fetchWeatherData(coords); // Fetch weather data immediately after adding the marker
        }
      }
    });
  });
}

// Adiciona autocomplete e busca para o campo do Ponto A
addAutocompleteAndSearch("addressInputA", "red", map);

// Adiciona autocomplete e busca para o campo do Ponto B
addAutocompleteAndSearch("addressInputB", "blue", map);

// Adiciona autocomplete e busca para o campo do Ponto Intermédio
addAutocompleteAndSearch("addressInputIntermedio", "orange", map);

// Adiciona autocomplete e busca para o campo do Ponto Meteorológico
addAutocompleteAndSearch("addressInputWeather", "purple", map);

var route;
var lineIds = [];
var lineDistance;

// Função para calcular a rota
function calculateRoute() {
  if (!markerA || !markerB) return; // Se os pontos A e B não foram definidos, retorne

  var pointA = markerA.getLngLat();
  var pointB = markerB.getLngLat();
  var pointAtual = markerAtual ? markerAtual.getLngLat() : null; // Verifique se o ponto de localização atual está definido
  var pointIntermedio = markerIntermedio ? markerIntermedio.getLngLat() : null; // Verifique se o ponto intermédio está definido
  var pointPI = markerPI ? markerPI.getLngLat() : null; // Verifique se o ponto de interesse está definido
  var selectedCategory = document.getElementById("selectedCategory").value; // Obtém a categoria de ponto de interesse selecionada

  // Converta as coordenadas para um formato que a API de roteamento possa entender
  var coordinates = `${pointA.lng},${pointA.lat}`;

  // Se o ponto intermédio estiver definido, inclua-o nas coordenadas
  if (pointIntermedio) {
    coordinates += `;${pointIntermedio.lng},${pointIntermedio.lat}`;
  }

  // Se o ponto de interesse estiver definido, inclua-o nas coordenadas
  if (pointPI) {
    coordinates += `;${pointPI.lng},${pointPI.lat}`;
  }

  if (pointAtual) {
    coordinates += `;${pointAtual.lng},${pointAtual.lat}`;
  }

  coordinates += `;${pointB.lng},${pointB.lat}`;

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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // A resposta da API de roteamento incluirá uma rota que você pode adicionar ao mapa
      var route = data.routes[0].geometry;

      // Calcule a distância da rota em metros usando turf.js
      var distance = turf.length(route, { units: "kilometers" }) * 1000;

      // Crie um objeto GeoJSON com a rota e adicione a distância como uma propriedade
      var routeGeoJSON = {
        type: "Feature",
        properties: { distance: distance },
        geometry: route
      };

      // Adicione a rota ao mapa
      if (map.getLayer("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
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
        var lineDistance =
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

      animateAlongRoute(route);

      // Se uma categoria de ponto de interesse estiver selecionada, busque os pontos de interesse
      if (selectedCategory) {
        fetch(`https://gis4cloud.com/grupo4_ptas2024/bd.php?tabela=${selectedCategory}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro na requisição de pontos de interesse: ${response.status}`);
            }
            return response.json();
          })
          .then((pointsOfInterest) => {
            // Encontre o ponto de interesse mais próximo na rota
            var nearestPointOfInterest = pointsOfInterest.features.reduce((nearestPoint, currentPoint) => {
              var distanceToRoute = turf.pointToLineDistance(currentPoint, route);
              if (!nearestPoint || distanceToRoute < nearestPoint.distanceToRoute) {
                return {
                  point: currentPoint,
                  distanceToRoute: distanceToRoute
                };
              } else {
                return nearestPoint;
              }
            }, null);

            // Se um ponto de interesse próximo foi encontrado, recalcule a rota para incluí-lo
            if (nearestPointOfInterest) {
              coordinates = `${pointA.lng},${pointA.lat}`;
              if (pointIntermedio) {
                coordinates += `;${pointIntermedio.lng},${pointIntermedio.lat}`;
              }

              // Se o ponto de interesse estiver definido, inclua-o nas coordenadas
              if (pointPI) {
                coordinates += `;${pointPI.lng},${pointPI.lat}`;
              }

              if (pointAtual) {
                coordinates += `;${pointAtual.lng},${pointAtual.lat}`;
              }

              coordinates += `;${nearestPointOfInterest.point.geometry.coordinates[0]},${nearestPointOfInterest.point.geometry.coordinates[1]};${pointB.lng},${pointB.lat}`;

              apiUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

              fetch(apiUrl)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                  }
                  return response.json();
                })
                .then((data) => {
                  // A resposta da API de roteamento incluirá a nova rota que você pode adicionar ao mapa
                  var newRoute = data.routes[0].geometry;

                  // Calcule a distância da rota em metros usando turf.js
                  var distance = turf.length(newRoute, { units: "kilometers" }) * 1000;

                  // Crie um objeto GeoJSON com a nova rota e adicione a distância como uma propriedade
                  var newRouteGeoJSON = {
                    type: "Feature",
                    properties: { distance: distance },
                    geometry: newRoute
                  };

                  // Adicione a nova rota ao mapa
                  if (map.getLayer("route")) {
                    map.removeLayer("route");
                    map.removeSource("route");
                  }
                  map.addSource("route", {
                    type: "geojson",
                    data: newRouteGeoJSON,
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

                  animateAlongRoute(newRoute);

                  // Adicione um marcador para o ponto de interesse mais próximo (markerPI_maisProximo)
                  if (markerPI_maisProximo) {
                    markerPI_maisProximo.remove(); // Remova o marcador anterior, se existir
                  } else {
                    markerPI_maisProximo = new mapboxgl.Marker({
                      color: "black" // Cor preta
                    })
                      .setLngLat(nearestPointOfInterest.point.geometry.coordinates)
                      .addTo(map);

                    var popupMaisProximo;
                    popupMaisProximo = new mapboxgl.Popup({ offset: 25 })
                      .setLngLat(nearestPointOfInterest.point.geometry.coordinates)
                      .setText('Ponto da categoria de ponto de interesse mais próximo')
                      .addTo(map);

                    markerPI_maisProximo.setPopup(popupMaisProximo);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      document.getElementById("addPointIntermedio").style.display = "block";
      document.getElementById("addressInputIntermedio").style.display = "block";

      document.getElementById("selectedCategory").style.display = "block";
      document.getElementById("selectedCategoryLabel").style.display = "block";
    })
    .catch((error) => {
      console.error(error);
    });
}

function animateAlongRoute(route) {
  // Calculate the total length of the route
  const lineDistance = turf.length(route, { units: "kilometers" });

  // Calculate the number of steps based on the length of the route
  let steps = Math.round(lineDistance * 50); // Ajuste o multiplicador conforme necessário para ajustar a velocidade

  // Definir um limite mínimo para o número de etapas
  const minSteps = 100;
  steps = Math.max(steps, minSteps);

  const arc = [];

  // Create an arc with the calculated coordinates
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route, i, { units: "kilometers" });
    arc.push(segment.geometry.coordinates);
  }

  // Update the route with calculated arc coordinates
  route.coordinates = arc;

  // Initial point at the start of the route
  const point = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: route.coordinates[0],
        },
      },
    ],
  };

  let counter = 0;

  // Add the point to the map
  if (!map.getSource("point")) {
    map.addSource("point", {
      type: "geojson",
      data: point,
    });
  }

  // Load the selected icon based on the current option
  loadSelectedIcon();

  function loadSelectedIcon() {
    const selectedProfile = document.getElementById("routingProfile").value;
    console.log("perfil selecionado: ", selectedProfile);
    let imageUrl;

    switch (selectedProfile) {
      case "driving-traffic":
        imageUrl = "https://i.ibb.co/jWxT7Np/image-2.png";
        break;
      case "walking":
        imageUrl = "https://cdn-icons-png.flaticon.com/128/16419/16419629.png";
        break;
      case "cycling":
        imageUrl = "https://cdn-icons-png.flaticon.com/128/2772/2772608.png";
        break;
    }

    map.loadImage(imageUrl, function (error, image) {
      if (error) throw error;

      // Remove the existing layer if it exists
      if (map.getLayer("point")) {
        map.removeLayer("point");
      }

      // Remove the existing image if it exists
      if (map.hasImage('icon')) {
        map.removeImage('icon');
      }

      map.addImage('icon', image);
      map.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
          'icon-image': 'icon',
          'icon-size': 0.5, // Reduz o tamanho do ícone para 0.5
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });
      document.getElementById("replay").style.display = "block";
    });
  }


  // Function to animate along the route
  function animate() {
    const start = route.coordinates[counter >= steps ? counter - 1 : counter];
    const end = route.coordinates[counter >= steps ? counter : counter + 1];
    if (!start || !end) return;

    point.features[0].geometry.coordinates = route.coordinates[counter];

    point.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    map.getSource("point").setData(point);

    if (counter < steps) {
      requestAnimationFrame(animate);
    }

    counter++;
  }

  // Start the animation
  animate();

  // Add event listener to the "replay" button
  document.getElementById("replay").addEventListener("click", () => {
    counter = 0;
    animate();
  });

  // Add event listener to the routing profile select
  document.getElementById("routingProfile").addEventListener("change", function () {
    const selectedValue = this.value; // Obtém o valor do perfil selecionado
    console.log("Selected value:", selectedValue);

    selectOption(this, "routingProfile", selectedValue);
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
    event.target.parentNode.classList.toggle("active");
  });
});

function limparTudo() {
  // Limpe as isócronas
  limparIsocronas();

  // Remova os marcadores, se existirem
  if (markerA) markerA.remove();
  if (markerB) markerB.remove();
  if (markerIntermedio) markerIntermedio.remove();
  if (markerPI) markerPI.remove();
  if (markerAtual) markerAtual.remove();
  if (markerPI_maisProximo) markerPI_maisProximo.remove();

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
  markerIntermedio = null;
  markerPI = null;
  markerAtual = null;
  markerPI_maisProximo = null;
  weatherMarker = null;
  popup = null;

  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  // Remove imagem do ícone
  map.removeImage('icon');

  // Esconde o botão "Replay Animation"
  document.getElementById("replay").style.display = "none";

  // Esconde o botão "Adicionar ponto intermédio" e o input de texto correspondente
  document.getElementById("addPointIntermedio").style.display = "none";
  document.getElementById("addressInputIntermedio").style.display = "none";

  // Esconde o botão "Selecionar categoria do ponto de interesse"
  document.getElementById("selectedCategory").style.display = "none";
  document.getElementById("selectedCategoryLabel").style.display = "none";
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