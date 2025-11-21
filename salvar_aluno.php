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
$nome = $data['nome'] ?? '';
$matricula = $data['matricula'] ?? '';
$turma = $data['turma'] ?? '';
$email = $data['email'] ?? '';
$telefone = $data['telefone'] ?? '';
$cpf = $data['cpf'] ?? '';
$endereco = $data['endereco'] ?? '';

//Preparar a query de inserção (USANDO PREPARED STATEMENT)
$sql = "INSERT INTO alunos (nome, matricula, turma, email, telefone, cpf, endereco) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao preparar statement: ' . $conn->error]);
    $conn->close();
    exit();
}

//Bind dos parâmetros e execução
$stmt->bind_param("sssssss", $nome, $matricula, $turma, $email, $telefone, $cpf, $endereco);

if ($stmt->execute()) {
    //Sucesso na inserção
    echo json_encode(['sucesso' => true, 'mensagem' => 'Aluno cadastrado com sucesso!']);
} else {
    //Erro (ex: matrícula/email/cpf duplicado, que são UNIQUE)
    $error_msg = "Erro na inserção: " . $stmt->error;
    if ($conn->errno == 1062) {
         $error_msg = "Registro duplicado! Matrícula, E-mail ou CPF já existe.";
    }
    echo json_encode(['sucesso' => false, 'mensagem' => $error_msg]);
}

$stmt->close();
$conn->close();
?>