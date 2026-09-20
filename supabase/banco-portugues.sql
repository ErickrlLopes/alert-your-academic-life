-- AlertCampus - Script de criação do banco de dados (MySQL 8+)
-- Todos os nomes em português

CREATE DATABASE IF NOT EXISTS alertcampus
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE alertcampus;

-- Tabela de usuários (login do sistema)
CREATE TABLE usuarios (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  senha_hash    VARCHAR(255) NOT NULL,
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Perfil do usuário
CREATE TABLE perfis (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL DEFAULT '',
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_perfis_usuario
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Atividades acadêmicas
CREATE TABLE atividades (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  usuario_id    CHAR(36)     NOT NULL,
  titulo        VARCHAR(255) NOT NULL,
  descricao     TEXT,
  disciplina    VARCHAR(255) NOT NULL DEFAULT '',
  tipo          ENUM('trabalho','prova','seminario','exercicio','projeto','apresentacao','outro')
                NOT NULL DEFAULT 'trabalho',
  prioridade    ENUM('baixa','media','alta') NOT NULL DEFAULT 'media',
  data_entrega  DATE         NOT NULL,
  hora_entrega  TIME         NOT NULL DEFAULT '23:59:00',
  concluida     BOOLEAN      NOT NULL DEFAULT FALSE,
  concluida_em  DATETIME     NULL,
  criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_atividades_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_atividades_usuario_entrega (usuario_id, data_entrega),
  INDEX idx_atividades_concluida (usuario_id, concluida)
) ENGINE=InnoDB;

-- Cria o perfil automaticamente ao cadastrar um usuário
DELIMITER $$
CREATE TRIGGER trg_usuarios_apos_inserir
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
  INSERT IGNORE INTO perfis (id, nome_completo) VALUES (NEW.id, '');
END$$
DELIMITER ;
