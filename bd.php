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

    $query = "SELECT lat, lng, nome, imgurl" . 
        ($tabela === 'ondas' ? ", velocidadevento, alturaonda, direcaovento, swellaltura, swellperiodo, swelldirecao, mare_high_tides" : "") . 
        " FROM " . $tabela . ";";
    
    $result = pg_query($conn, $query);
    if (!$result) {
        die("Erro ao executar a consulta SQL.");
    }

    $geojson = array(
        'type' => 'FeatureCollection',
        'features' => array()
    );

    while ($row = pg_fetch_assoc($result)) {
        $properties = array(
            'nome' => $row['nome'],
            'imgurl' => $row['imgurl']
        );

        if ($tabela === 'ondas') {
            $properties['velocidadevento'] = $row['velocidadevento'];
            $properties['alturaonda'] = $row['alturaonda'];
            $properties['direcaovento'] = $row['direcaovento'];
            $properties['swellaltura'] = $row['swellaltura'];
            $properties['swellperiodo'] = $row['swellperiodo'];
            $properties['swelldirecao'] = $row['swelldirecao'];
            
            // Correção: Decodificação correta do JSON antes de processar
            $mare_high_tides = json_decode($row['mare_high_tides'], true);

                       // Processar cada horário para extrair e formatar apenas a hora
                       $horas_mare = array_map(function($datetime) {
                        // Converter a string de data/hora em um objeto DateTime
                        $date = new DateTime($datetime);
                        // Formatar para obter apenas a hora e minuto (HH:MM)
                        return $date->format('H:i');
                    }, $mare_high_tides);
        
                    // Limitar o array resultante às duas primeiras horas
                    $primeiras_duas_horas = array_slice($horas_mare, 0, 2);
        
                    // Alteração: Unir as duas primeiras horas com " | " para a exibição
                    $formato_mare = implode(" | ", $primeiras_duas_horas);
        
                    // Adicionar as duas primeiras horas de volta às propriedades, agora em um único string
                    $properties['mare_high_tides'] = $formato_mare;
        }

        $feature = array(
            'type' => 'Feature',
            'geometry' => array(
                'type' => 'Point',
                'coordinates' => array(
                    floatval($row['lng']),
                    floatval($row['lat'])
                )
            ),
            'properties' => $properties
        );
        
        array_push($geojson['features'], $feature);
    }

    pg_close($conn);

    // Escrever os dados atualizados no arquivo de cache
    file_put_contents($cacheFile, json_encode($geojson));

    return json_encode($geojson);
}

header('Content-Type: application/json');
echo getGeoJSON($_GET['tabela']);
?>