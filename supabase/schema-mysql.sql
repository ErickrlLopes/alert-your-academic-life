-- AlertCampus - script de criação do banco (MySQL 8+)

CREATE DATABASE IF NOT EXISTS alertcampus
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE alertcampus;

-- Usuários (equivalente ao auth.users)
CREATE TABLE users (
  id            CHAR(36)     NOT NULL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Perfil do usuário
CREATE TABLE profiles (
  id         CHAR(36) NOT NULL PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Atividades acadêmicas
CREATE TABLE activities (
  id           CHAR(36) NOT NULL PRIMARY KEY,
  user_id      CHAR(36) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  subject      VARCHAR(255) NOT NULL DEFAULT '',
  type         ENUM('trabalho','prova','seminario','exercicio','projeto','apresentacao','outro')
               NOT NULL DEFAULT 'trabalho',
  priority     ENUM('baixa','media','alta') NOT NULL DEFAULT 'media',
  due_date     DATE NOT NULL,
  due_time     TIME NOT NULL DEFAULT '23:59:00',
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activities_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_activities_user_due (user_id, due_date),
  INDEX idx_activities_completed (user_id, completed)
) ENGINE=InnoDB;

-- Cria o perfil automaticamente ao cadastrar um usuário
DELIMITER $$
CREATE TRIGGER trg_users_after_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT IGNORE INTO profiles (id, full_name) VALUES (NEW.id, '');
END$$
DELIMITER ;
