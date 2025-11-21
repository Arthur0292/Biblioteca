<?php
header('Content-Type: application/json');

$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";
$dbname = "if0_40474741_biblioteca";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    // Retorna JSON de erro se a conexão falhar
    echo json_encode(['sucesso' => false, 'erro' => 'Falha na conexão: ' . $conn->connect_error]);
    exit();
}

// Query: Seleciona todos os campos necessários da tabela livros
$sql = "SELECT 
            id, 
            nome, 
            autor, 
            sumario, 
            localizacao, 
            url_imagem AS imagem, 
            reservadoPor, 
            dataDevolucao 
        FROM 
            livros 
        ORDER BY 
            nome ASC";

$resultado = $conn->query($sql);

$livros = [];
if ($resultado && $resultado->num_rows > 0) {
    while($row = $resultado->fetch_assoc()) {
        $livros[] = $row;
    }
}

$conn->close();
// Retorna a lista de livros (mesmo que vazia)
echo json_encode($livros);
?>