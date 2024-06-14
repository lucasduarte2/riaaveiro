<?php
// Conectar ao banco de dados PostgreSQL
$conn = pg_connect("host=www.gis4cloud.com dbname=grupo4_ptas2024 user=grupo4_ptas2024 password=riaaveiro2024");

if (!$conn) {
    echo "Erro ao conectar ao banco de dados.";
    exit;
}

// Verificar se o parâmetro 'tabela' foi passado via GET
if (!isset($_GET['tabela'])) {
    echo "Parâmetro 'tabela' não especificado.";
    exit;
}

// Obter o nome da tabela do parâmetro da URL
$tabela = $_GET['tabela'];

// Preparar e executar a consulta SQL para obter os dados GeoJSON
$query = "SELECT id, 
                 ST_AsGeoJSON(geom) AS geom,
                 nome_do_percurso,
                 distancia_km,
                 duracao_estimada,
                 ambito,
                 grau_dificuldade,
                 epoca_aconselhada 
          FROM $tabela";
$result = pg_query($conn, $query);

if (!$result) {
    echo "Erro ao executar a consulta: " . pg_last_error($conn);
    exit;
}

// Montar o GeoJSON FeatureCollection
$geojson = array(
    'type' => 'FeatureCollection',
    'features' => array()
);

while ($row = pg_fetch_assoc($result)) {
    $properties = array(
        'id' => $row['id'],
        'Nome_do_Percurso' => $row['nome_do_percurso'],
        'Distancia_Km' => $row['distancia_km'],
        'Duracao_Estimada' => $row['duracao_estimada'],
        'Ambito' => $row['ambito'],
        'Grau_Dificuldade' => $row['grau_dificuldade'],
        'Epoca_Aconselhada' => $row['epoca_aconselhada']
    );

    $feature = array(
        'type' => 'Feature',
        'geometry' => json_decode($row['geom'], true),
        'properties' => $properties
    );
    
    array_push($geojson['features'], $feature);
}

// Fechar a conexão com o banco de dados
pg_close($conn);

// Convertendo o GeoJSON para JSON
$json = json_encode($geojson);

// Exibindo o GeoJSON
header('Content-Type: application/json');
echo $json;
?>