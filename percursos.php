<?php
// Conectar ao banco de dados PostgreSQL
$conn = pg_connect("host=www.gis4cloud.com dbname=grupo4_ptas2024 user=grupo4_ptas2024 password=riaaveiro2024");

if (!$conn) {
    echo "Erro ao conectar ao banco de dados.";
    exit;
}

// Preparar e executar a consulta SQL
$query = "SELECT id, ST_AsGeoJSON(geom) AS geom, name, descriptio FROM percurso_azul";
$result = pg_query($conn, $query);

if (!$result) {
    echo "Erro ao executar a consulta.";
    exit;
}

// Convertendo os resultados para o formato GeoJSON
$geojson = array(
    'type' => 'FeatureCollection',
    'features' => array()
);

while ($row = pg_fetch_assoc($result)) {
    $feature = array(
        'type' => 'Feature',
        'geometry' => json_decode($row['geom'], true),
        'properties' => array(
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['descriptio']
        )
    );
    array_push($geojson['features'], $feature);
}

// Convertendo o GeoJSON para JSON
$json = json_encode($geojson);

// Exibindo o GeoJSON
echo $json;

// Fechar a conexão com o banco de dados
pg_close($conn);
?>
