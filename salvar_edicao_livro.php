<?php
header('Content-Type: application/json');

$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";
$dbname = "if0_40474741_biblioteca";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro de conexão.']);
    exit();
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

//Dados do formulário
$id = $data['id'] ?? null;
$nome = $data['nome'] ?? '';
$autor = $data['autor'] ?? '';
$sumario = $data['sumario'] ?? '';
$localizacao = $data['localizacao'] ?? '';
$imagem = $data['imagem'] ?? '';

if (!$id || !is_numeric($id)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'ID de livro inválido para edição.']);
    $conn->close();
    exit();
}

//Query de atualização segura
$sql = "UPDATE livros SET nome = ?, autor = ?, sumario = ?, localizacao = ?, url_imagem = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $nome, $autor, $sumario, $localizacao, $imagem, $id);

if ($stmt->execute()) {
    echo json_encode(['sucesso' => true, 'mensagem' => 'Livro editado com sucesso!']);
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao editar livro: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>