<?php
header('Content-Type: application/json');

$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";
$dbname = "if0_40474741_biblioteca";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Falha na conexão.']);
    exit();
}

$livro_id = $_GET['id'] ?? null;

if (!$livro_id || !is_numeric($livro_id)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'ID de livro inválido.']);
    $conn->close();
    exit();
}

//Deleta o livro
$sql = "DELETE FROM livros WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $livro_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Livro excluído com sucesso.']);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Nenhum livro encontrado com este ID.']);
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir livro: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>