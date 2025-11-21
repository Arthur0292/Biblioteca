<?php
header('Content-Type: application/json');

$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";
$dbname = "if0_40474741_biblioteca";

//Conexão com o banco
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['sucesso' => false, 'erro' => 'Falha na conexão: ' . $conn->connect_error]);
    exit();
}

$sql = "SELECT id, nome, email, turma FROM alunos ORDER BY nome ASC";
$resultado = $conn->query($sql);

$alunos = [];
if ($resultado->num_rows > 0) {
    while($row = $resultado->fetch_assoc()) {
        $alunos[] = $row;
    }
}

$conn->close();

//Retorna os alunos em formato JSON
echo json_encode($alunos);
?>