<?php
function getGeoJSON($tabela)
{

    // Verificar se a tabela é 'spatial_ref_sys' e pular
    if ($tabela === 'spatial_ref_sys') {
        return json_encode(
            array(
                'type' => 'FeatureCollection',
                'features' => array(),
                'message' => 'Tabela spatial_ref_sys foi ignorada.'
            )
        );
    }

    $cacheFile = 'cache/' . $tabela . '.json';
    // Definir o tempo de expiração do cache em segundos (1 hora)
    $cacheTime = 3600;

    // Verificar se o arquivo de cache existe e se ainda é válido
    if (file_exists($cacheFile) && time() - filemtime($cacheFile) < $cacheTime) {
        // Se os dados estiverem em cache e forem recentes, retornar os dados em cache
        return file_get_contents($cacheFile);
    }

    // Se os dados não estiverem em cache ou forem antigos, fazer uma nova consulta ao banco de dados
    $conn = pg_connect("host=www.gis4cloud.com dbname=grupo4_ptas2024 user=grupo4_ptas2024 password=riaaveiro2024");
    if (!$conn) {
        die("Erro ao conectar à base de dados.");
    }

    $query = "SELECT lat, lng, nome FROM " . $tabela . ";";
    $result = pg_query($conn, $query);
    if (!$result) {
        die("Erro ao executar a consulta SQL.");
    }

    $geojson = array(
        'type' => 'FeatureCollection',
        'features' => array()
    );
    // Dentro do loop que processa os resultados da sua consulta SQL e constrói o GeoJSON
    while ($row = pg_fetch_assoc($result)) {
        $feature = array(
            'type' => 'Feature',
            'geometry' => array(
                'type' => 'Point',
                'coordinates' => array(
                    floatval($row['lng']),
                    floatval($row['lat'])
                )
            ),
            'properties' => array(
                'nome' => $row['nome'] // Adicionando o nome aqui
            )
        );
        array_push($geojson['features'], $feature);
    }

    pg_close($conn);

    file_put_contents($cacheFile, json_encode($geojson));

    return json_encode($geojson);
}

header('Content-Type: application/json');
echo getGeoJSON($_GET['tabela']);
?>