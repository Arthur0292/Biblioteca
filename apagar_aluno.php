<?php
header('Content-Type: application/json');

$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";
$dbname = "if0_40474741_biblioteca";

//Conexão com o banco
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Falha na conexão.']);
    exit();
}

//Receber o ID (que é a chave primária no banco)
$aluno_id = $_GET['id'] ?? null;

if (!$aluno_id || !is_numeric($aluno_id)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'ID de aluno inválido.']);
    $conn->close();
    exit();
}

//Query de deleção segura usando Prepared Statement
$sql = "DELETE FROM alunos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $aluno_id); // "i" para integer

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['sucesso' => true, 'mensagem' => 'Aluno excluído com sucesso.']);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Nenhum aluno encontrado com este ID.']);
    }
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao excluir aluno: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>