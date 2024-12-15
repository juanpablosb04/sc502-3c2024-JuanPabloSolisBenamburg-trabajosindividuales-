<?php
require 'db.php';

function agregarComentario($task_id, $comment)
{
    global $pdo;
    try {
        $sql = "INSERT INTO comments (task_id, comment) VALUES (:task_id, :comment)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'task_id' => $task_id,
            'comment' => $comment
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        logError("Error al agregar comentario: " . $e->getMessage());
        return 0;
    }
}

function obtenerComentariosPorTarea($task_id)
{
    global $pdo;
    try {
        $sql = "SELECT * FROM comments WHERE task_id = :task_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['task_id' => $task_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error al obtener comentarios: " . $e->getMessage());
        return [];
    }
}

function eliminarComentario($comment_id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $comment_id]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        logError("Error al eliminar comentario: " . $e->getMessage());
        return false;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

session_start();
if (isset($_SESSION['user_id'])) {
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents("php://input"), true);
            if (isset($input['task_id'], $input['comment'])) {
                $comment_id = agregarComentario($input['task_id'], $input['comment']);
                if ($comment_id > 0) {
                    http_response_code(201);
                    echo json_encode(['message' => "Comentario agregado", 'comment_id' => $comment_id]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al agregar comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => "Datos insuficientes"]);
            }
            break;

        case 'GET':
            if (isset($_GET['task_id'])) {
                $comments = obtenerComentariosPorTarea($_GET['task_id']);
                echo json_encode($comments);
            } else {
                http_response_code(400);
                echo json_encode(['error' => "Falta el ID de la tarea"]);
            }
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $comment_id = $_GET['id'];
                $fueEliminado = eliminarComentario($comment_id);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => "Comentario eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al eliminar el comentario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => "Falta el ID del comentario"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => "Método no permitido"]);
            break;
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => "Sesión no activa"]);
}
