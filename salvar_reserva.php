<?php
header('Content-Type: application/json');
//Conexão com o BD
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

//Dados da requisição
$livro_id = $data['livro_id'] ?? null;
$nome_aluno = $data['nome_aluno'] ?? null;
$data_devolucao = $data['data_devolucao'] ?? null;
$acao = $data['acao'] ?? ''; // 'reservar' ou 'liberar'

if (!$livro_id || !is_numeric($livro_id)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'ID de livro inválido.']);
    $conn->close();
    exit();
}

if ($acao === 'reservar' && (!$nome_aluno || !$data_devolucao)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Dados de reserva incompletos.']);
    $conn->close();
    exit();
}

if ($acao === 'reservar') {
    //Atualiza o livro com dados de reserva
    $sql = "UPDATE livros SET reservadoPor = ?, dataDevolucao = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $nome_aluno, $data_devolucao, $livro_id);
    $mensagem_sucesso = "Livro reservado com sucesso para $nome_aluno!";
} elseif ($acao === 'liberar') {
    //Libera a reserva (seta os campos para NULL)
    $null_val = null;
    $sql = "UPDATE livros SET reservadoPor = ?, dataDevolucao = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    //Usamos bind_param para enviar NULL, mas o tipo é string e null para NULL
    $stmt->bind_param("ssi", $null_val, $null_val, $livro_id);
    $mensagem_sucesso = "Reserva cancelada. Livro liberado!";
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Ação inválida.']);
    $conn->close();
    exit();
}

if ($stmt->execute()) {
    echo json_encode(['sucesso' => true, 'mensagem' => $mensagem_sucesso]);
} else {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao processar reserva: ' . $stmt->error]);
}

$stmt->close();
$conn->close();

?>
