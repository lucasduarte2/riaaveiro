//---------------------------------------
//Aplicação de uma função de estilo

var defaultStyle = [
  new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 0.5],
      //     size: [52, 52],
      //     offset: [52, 0],
      //     opacity: 1,
      scale: 0.015,
      src: "./Images/Moliceiro.svg"
    })
  })
];

function funcão_style(feature, resolution) {
  return defaultStyle;
}

//Definição da camada
var entidades = new ol.layer.Vector({
title: "Equipamentos desportivos de Aveiro",
source: new ol.source.Vector({
  url: "./moliceiro.geojson",
  //url: "https://gis4cloud.com/downloads/sig/aulas/db_to_geojson.php",
  format: new ol.format.GeoJSON()
}),
//style: entidadesStyle
style: funcão_style,
visible: true
});

var map = new ol.Map({
target: "map",
layers: [
  new ol.layer.Tile({
    source: new ol.source.OSM({
      url:
        "https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0b4a4b88017a4b16b033bde7e90c93f5"
    })
  })
],
view: new ol.View({
  center: ol.proj.fromLonLat([-8.6189, 40.5954]),
  zoom: 11
})
});
map.addLayer(entidades);

// Função para alternar a visibilidade da camada
function toggleLayer() {
entidades.setVisible(!entidades.getVisible());
}