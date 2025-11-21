<?php
//Configurações do Servidor
$servername = "sql308.infinityfree.com";
$username = "if0_40474741";
$password = "8fJzevkLl5EJlQw";      
$dbname = "if0_40474741_biblioteca";

//CONEXÃO INICIAL E CRIAÇÃO DO BANCO
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("❌ Conexão com o servidor falhou: " . $conn->connect_error);
}

$sql_create_db = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql_create_db) === TRUE) {
    echo "✅ Banco de dados **$dbname** criado ou já existente.<br>";
} else {
    echo "❌ Erro ao criar banco: " . $conn->error . "<br>";
    $conn->close();
    exit();
}
$conn->close();

//NOVA CONEXÃO, AGORA SELECIONANDO O BANCO
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("❌ Conexão com o DB $dbname falhou: " . $conn->connect_error);
}

//CRIAÇÃO DA TABELA 'alunos'
$sql_create_table_alunos = "
    CREATE TABLE IF NOT EXISTS alunos (
        id INT(11) NOT NULL AUTO_INCREMENT,
        nome VARCHAR(100) NOT NULL,
        matricula VARCHAR(20) NOT NULL UNIQUE,
        turma VARCHAR(10) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefone VARCHAR(20) NOT NULL,
        cpf CHAR(11) NOT NULL UNIQUE,
        endereco VARCHAR(255) NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )
";

if ($conn->query($sql_create_table_alunos) === TRUE) {
    echo "✅ Tabela **alunos** criada ou já existente com sucesso!<br>";
} else {
    echo "❌ Erro ao criar a tabela alunos: " . $conn->error . "<br>";
}


//CRIAÇÃO DA TABELA 'livros' (INCLUINDO NOVOS CAMPOS SE NÃO EXISTIR)
$sql_create_table_livros = "
    CREATE TABLE IF NOT EXISTS livros (
        id INT(11) NOT NULL AUTO_INCREMENT,
        nome VARCHAR(150) NOT NULL,
        autor VARCHAR(100) NOT NULL,
        sumario TEXT NOT NULL,
        localizacao VARCHAR(50) NOT NULL,
        url_imagem VARCHAR(255) NULL,
        reservadoPor VARCHAR(100) NULL DEFAULT NULL,
        dataDevolucao DATE NULL DEFAULT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )
";

if ($conn->query($sql_create_table_livros) === TRUE) {
    echo "✅ Tabela **livros** criada ou já existente com sucesso!<br>";
} else {
    echo "❌ Erro ao criar a tabela livros: " . $conn->error . "<br>";
}

//Comandos ALTER TABLE (Garante que os campos de reserva existam, caso a tabela já estivesse criada)

$sql_alter_table = "
    -- Tenta adicionar reservadoPor se não existir
    ALTER TABLE livros ADD COLUMN reservadoPor VARCHAR(100) NULL DEFAULT NULL;
    -- Tenta adicionar dataDevolucao se não existir
    ALTER TABLE livros ADD COLUMN dataDevolucao DATE NULL DEFAULT NULL;
";

//Executa os comandos ALTER TABLE
if ($conn->multi_query($sql_alter_table)) {
    // Limpa os resultados do multi_query
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    echo "✅ Campos de reserva atualizados na tabela **livros** (se necessário).<br>";
} else {
    //MySQL retorna erro 1060 se a coluna já existir, que é o que queremos evitar
    if ($conn->errno != 1060) {
        echo "❌ Erro ao atualizar campos de reserva: " . $conn->error . "<br>";
    } else {
        echo "✅ Campos de reserva já existiam na tabela **livros**.<br>";
    }
}


$conn->close();
?>