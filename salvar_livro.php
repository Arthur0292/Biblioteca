<?php
header('Content-Type: application/json');

//Configurações do Banco de Dados
$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";
$dbname = "if0_40474741_biblioteca";

//Conexão
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão com o banco de dados.']);
    exit();
}

//Receber os dados JSON do JavaScript
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

//Sanitizar os dados
//Usamos ?? '' para garantir que a variável exista, mesmo se o campo não vier.
$nome = $data['nome'] ?? '';
$autor = $data['autor'] ?? '';
$sumario = $data['sumario'] ?? '';
$localizacao = $data['localizacao'] ?? '';
$imagem = $data['imagem'] ?? ''; // url_imagem no banco

//Preparar a query de inserção (USANDO PREPARED STATEMENT)
$sql = "INSERT INTO livros (nome, autor, sumario, localizacao, url_imagem) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao preparar statement: ' . $conn->error]);
    $conn->close();
    exit();
}

//Bind dos parâmetros (sssss = 5 strings) e execução
$stmt->bind_param("sssss", $nome, $autor, $sumario, $localizacao, $imagem);

if ($stmt->execute()) {
    //Sucesso na inserção
    echo json_encode(['sucesso' => true, 'mensagem' => 'Livro cadastrado com sucesso!']);
} else {
    //Erro (se houver alguma restrição única futura)
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao cadastrar livro: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>