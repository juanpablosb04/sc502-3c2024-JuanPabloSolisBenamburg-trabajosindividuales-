document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let tasks = [];
    const API_URL = 'backend/tasks.php';

    async function loadTasks() {
        try {
            const response = await fetch('backend/tasks.php', {
                method: 'GET',
                credentials: 'include'
            });
    
            if (response.ok) {
                tasks = await response.json();
                for (const task of tasks) {
                    const commentsResponse = await fetch(`backend/comments.php?task_id=${task.id}`, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (commentsResponse.ok) {
                        task.comments = await commentsResponse.json();
                    } else {
                        task.comments = [];
                    }
                }
    
                renderTasks(tasks); 
            } else {
                if (response.status === 401) {
                    window.location.href = 'index.html';
                }
                console.error('Error al obtener tareas');
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    function renderTasks(tasks) {
        //traer las tareas desde el backend
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {

            let commentsList = '';
            if (task.comments && task.comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                task.comments.forEach(comment => {
                    commentsList += `
                    <li class="list-group-item">
                        ${comment.comment} 
                        <button type="button" class="btn btn-sm btn-link remove-comment" 
                            data-commentid="${comment.id}" data-taskid="${task.id}">
                            Remove
                        </button>
                    </li>`;
                });
                commentsList += '</ul>';
            }
            
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small> </p>
                    ${commentsList}
                     <button type="button" class="btn btn-sm btn-link add-comment"  data-id="${task.id}">Add Comment</button>

                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task"data-id="${task.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });

        document.querySelectorAll('.add-comment').forEach(function (button) {
            button.addEventListener('click', function (e) {
                // alert(e.target.dataset.id);
                document.getElementById("comment-task-id").value = e.target.dataset.id;
                const modal = new bootstrap.Modal(document.getElementById("commentModal"));
                modal.show()

            })
        });

        //codigo para quitar los comentarios
        document.querySelectorAll('.remove-comment').forEach(function (button) {
            button.addEventListener('click', async function (e) {
                const commentId = e.target.dataset.commentid;

                try {
                    const response = await fetch(`backend/comments.php?id=${commentId}`, {
                        
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    
                    if (response.ok) {
                        loadTasks();
                    } else {
                        console.error('Error eliminando comentario');
                    }
                } catch (error) {
                    
                    console.error('Error:', error);
                }
            });
        });
        //codigo para quitar los comentarios
    }

    function handleEditTask(event) {
        try {
            // alert(event.target.dataset.id);
            //localizar la tarea quieren editar
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            //cargar los datos en el formulario 
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.due_date;
            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = taskId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }


    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const response = await fetch(`${API_URL}?id=${id}`,{
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            loadTasks();
        } else {
            console.error("Error eliminando las tareas");
        }
    }

    document.getElementById('comment-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const comment = document.getElementById('task-comment').value;
        const selectedTask = parseInt(document.getElementById('comment-task-id').value);
        const task = tasks.find(t => t.id === selectedTask);


        let nextCommentId = 1;

        if (task.comments) {
            nextCommentId = task.comments.length + 1;
        } else {
            task.comments = [];
        }

        task.comments.push({ id: nextCommentId, description: comment });
        const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
        modal.hide();
        loadTasks();

    })

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            //editar
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, description: description, due_date: dueDate }),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }

        } else {
            const newTask = {
                title: title,
                description: description,
                due_date: dueDate
            };
            //enviar la tarea al backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedio un error");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('commentModal').addEventListener('show.bs.modal', function () {
        document.getElementById('comment-form').reset();
    })

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
            // document.getElementById('task-title').value = "";
            // document.getElementById('task-desc').value = "";
            // document.getElementById('due-date').value = "";
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    })
    loadTasks();


    document.getElementById('comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const comment = document.getElementById('task-comment').value;
        const taskId = document.getElementById('comment-task-id').value;
    
        try {
            const response = await fetch('backend/comments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task_id: taskId, comment: comment }),
                credentials: 'include'
            });
    
            if (response.ok) {
                loadTasks();
            } else {
                console.error('Error al guardar comentario');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    
        const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
        modal.hide();
    });

    

    });
