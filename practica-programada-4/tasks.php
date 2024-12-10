<?php

require 'db.php';

function crearTarea($user_id, $title, $description, $due_date)
{
    global $pdo;
    try {
        $sql = "INSERT INTO tasks (user_id, title, description, due_date) values (:user_id, :title, :description, :due_date)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'user_id' => $user_id,
            'title' => $title,
            'description' => $description,
            'due_date' => $due_date
        ]);
        //devuelve el id de la tarea creada en la linea anterior
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        logError("Error creando tarea: " . $e->getMessage());
        return 0;
    }
}

function editarTarea($id, $title, $description, $due_date)
{
    global $pdo;
    try {
        $sql = "UPDATE tasks set title = :title, description = :description, due_date = :due_date where id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'title' => $title,
            'description' => $description,
            'due_date' => $due_date,
            'id' => $id
        ]);
        $affectedRows = $stmt->rowCount();
        return $affectedRows > 0;
    } catch (Exception $e) {
        logError($e->getMessage());
        return false;
    }
}

//obtenerTareasPorUsuario
function obtenerTareasPorUsuario($user_id)
{
    global $pdo;
    try {
        $sql = "Select * from tasks where user_id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error al obtener tareas: " . $e->getMessage());
        return [];
    }
}

//Eliminar una tarea por id
function eliminarTarea($id)
{
    global $pdo;
    try {
        $sql = "delete from tasks where id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;// true si se elimina algo
    } catch (Exception $e) {
        logError("Error al eliminar la tareas: " . $e->getMessage());
        return false;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');
function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

session_start();
if (isset($_SESSION['user_id'])) {
    //el usuario tiene sesion
    $user_id = $_SESSION['user_id'];
    logDebug($user_id);
    switch ($method) {
        case 'GET':
            //devolver las tareas del usuario conectado
            $tareas = obtenerTareasPorUsuario($user_id);
            echo json_encode($tareas);
            break;

        case 'POST':
            $input = getJsonInput();
            if (isset($input['title'], $input['description'], $input['due_date'])) {
                //vamos a crear tarea
                $id = crearTarea($user_id, $input['title'], $input['description'], $input['due_date']);
                if ($id > 0) {
                    http_response_code(201);
                    echo json_encode(value: ["messsage" => "Tarea creada: ID:" . $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error general creando la tarea"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT':
            $input = getJsonInput();
            if (isset($input['title'], $input['description'], $input['due_date']) && $_GET['id']) {
                $editResult = editarTarea($_GET['id'], $input['title'], $input['description'], $input['due_date']);
                if ($editResult) {
                    http_response_code(201);
                    echo json_encode(['message' => "Tarea actualizada"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error actualizando la tarea"]);
                }
            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'DELETE':
            if ($_GET['id']) {
                $fueEliminado = eliminarTarea($_GET['id']);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => "Tarea eliminada"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['message' => 'Sucedio un error al eliminar la tarea']);
                }

            } else {
                //retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Metodo no permitido"]);
            break;
    }

} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesion no activa"]);
}








//comentarios

function crearComentario($task_id, $comment)
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
        logError("Error al crear comentario: " . $e->getMessage());
        return 0;
    }
}

function editarComentario($id, $comment)
{
    global $pdo;
    try {
        $sql ="UPDATE comments SET comment = :comment WHERE id = :id";

        $stmt = $pdo-> prepare($sql);

        $stmt->execute([
            'comment' => $comment ,
            'id' => $id
        ]);


        $affectedRows = $stmt->rowCount();
        return $affectedRows > 0;
    } catch (Exception $e) {
        logError("Error editando el comentario: " . $e->getMessage());
        return false;
    }
}


function eliminarComentario($id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0; // true si se elimina algo
    } catch (Exception $e) {
        logError("Error al eliminar el comentario: " . $e->getMessage());
        return false;
    }
}

function obtenerComentarios($task_id)
{
    global $pdo;
    try {

        $sql = "SELECT id, comment FROM comments WHERE task_id = :task_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['task_id' => $task_id]);

        $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);


        return $comentarios ? $comentarios : [];

    } catch (Exception $e) {
        logError("Error obteniendo comentarios: " . $e->getMessage());
        return [];
    }
}



session_start();
if (isset($_SESSION['user_id'])) {
    // El usuario tiene sesión
    $user_id = $_SESSION['user_id'];
    logDebug($user_id);
    $method = $_SERVER['REQUEST_METHOD']; // Obtener el método de la solicitud

    switch ($method) {
        case 'GET':
            // Devolver los comentarios de la tarea del usuario conectado
            if (isset($_GET['task_id'])) {
                $comentarios = obtenerComentarios($_GET['task_id']);
                echo json_encode($comentarios);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Falta el ID de la tarea"]);
            }
            break;

        case 'POST':
            $input = getJsonInput();
            if (isset($input['task_id'], $input['comment'])) {
                // Vamos a crear un comentario
                $id = crearComentario($input['task_id'], $input['comment']);
                if ($id > 0) {
                    http_response_code(201);
                    echo json_encode(["message" => "Comentario creado: ID:" . $id]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Error general creando el comentario"]);
                }
            } else {
                // Retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'PUT':
            $input = getJsonInput();
            if (isset($input['id'], $input['comment'])) {
                $editResult = editarComentario($input['id'], $input['comment']);
                if ($editResult) {
                    http_response_code(201);
                    echo json_encode(['message' => "Comentario actualizado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error actualizando el comentario"]);
                }
            } else {
                // Retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        case 'DELETE':
            if (isset($_GET['id'])) {
                $fueEliminado = eliminarComentario($_GET['id']);
                if ($fueEliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => "Comentario eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['message' => 'Sucedió un error al eliminar el comentario']);
                }
            } else {
                // Retornar un error
                http_response_code(400);
                echo json_encode(["error" => "Datos insuficientes"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Método no permitido"]);
            break;
    }

} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}
