document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;

    const tasks = [{
        id: 1,
        title: "Complete project report",
        description: "Prepare and submit the project report",
        dueDate: "2024-12-01",
        comentarios: []
    },
    {
        id: 2,
        title: "Team Meeting",
        description: "Get ready for the season",
        dueDate: "2024-12-01",
        comentarios: []
    },
    {
        id: 3,
        title: "Code Review",
        description: "Check partners code",
        dueDate: "2024-12-01",
        comentarios: []
    }];

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-primary btn-sm Anadir-comentario" data-id="${task.id}">Nuevo Comentario</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
                <div class="comentarios mt-2 text-center">
                    
                    <div id="comments-${task.id}" class="mt-2">
                        ${task.comentarios.map((comentario, index) => `
                            <div class="card mb-2">
                <div class="card-body">
                    <p class="card-text">
                        <small class="text-muted">${comentario}</small>
                        <button class="btn btn-danger btn-sm float-end Eliminar-comentario" data-task-id="${task.id}" data-comment-index="${index}">Eliminar</button>
                    </p>
                </div>
            </div>
                        `).join('')}
                    </div>
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

        document.querySelectorAll('.Anadir-comentario').forEach(function (button) {
            button.addEventListener('click', handleAnadirComentario);
        });
        document.querySelectorAll('.Eliminar-comentario').forEach(function (button) {
            button.addEventListener('click', handleEliminarComentario);
        });

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
            document.getElementById('due-date').value = task.dueDate;
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

    function handleDeleteTask(event) {
        // alert(event.target.dataset.id);
        const id = parseInt(event.target.dataset.id);
        const index = tasks.findIndex(t => t.id === id);
        tasks.splice(index, 1);
        loadTasks();
    }

    function handleAnadirComentario(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        document.getElementById('comment-text').value = "";
        const modal = new bootstrap.Modal(document.getElementById("commentModal"));
        modal.show();

        document.getElementById('comment-form').onsubmit = function (e) {
            e.preventDefault();
            const newComment = document.getElementById('comment-text').value;
            task.comentarios.push(newComment);
            modal.hide();
            loadTasks();
        };
    }

    function handleEliminarComentario(event) {
        // alert(event.target.dataset.id);
        const taskId = parseInt(event.target.dataset.taskId);
        const commentIndex = parseInt(event.target.dataset.commentIndex);
        const task = tasks.find(t => t.id === taskId);
        task.comentarios.splice(commentIndex, 1);
        loadTasks();
    }

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            //todo editar
            const task = tasks.find(t => t.id === edittingId);
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
        } else {
            const newTask = {
                id: tasks.length + 1,
                title: title,
                description: description,
                dueDate: dueDate
            };
            tasks.push(newTask);
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });


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





});