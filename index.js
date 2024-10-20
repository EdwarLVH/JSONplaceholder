const postsTable = document.getElementById('postsTable');
let posts = [];
let nextId = 101; // Post nuevo empieza con el ID 101

// Función para mostrar mensajes en el modal
function showMessage(text) {
    const modalMessageBody = document.getElementById('modalMessageBody');
    modalMessageBody.textContent = text;
    $('#messageModal').modal('show'); 
}

// Funcion para obtener todos los posts
function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            posts = data.map(post => ({ ...post, editable: false }));
            renderPosts();
        })
        .catch(error => showMessage('Error al obtener los posts.')); 
}

// Funcion para renderizar posts en la tabla
function renderPosts() {
    postsTable.innerHTML = '';
    posts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${post.id}</td>
            <td>
                <input type="text" value="${post.title}" ${post.editable ? '' : 'readonly'}>
            </td>
            <td>
                <textarea rows="3" ${post.editable ? '' : 'readonly'}>${post.body}</textarea>
            </td>
            <td>
                <button class="btn btn-warning" onclick="editPost(${post.id})" ${post.editable ? 'disabled' : ''}>
                    <i class="fas fa-pencil-alt"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
                ${post.editable ? `<button class="btn btn-primary" onclick="updatePost(${post.id})">OK</button>` : ''}
            </td>
        `;
        postsTable.appendChild(row);
    });
}

// Funcion para crear un nuevo post
function createPost() {
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    if (!title || !body) {
        showMessage('Por favor, completa todos los campos.');
        return;
    }

    const newPost = { id: nextId++, title, body };
    posts.push(newPost);
    clearInputs(); // Limpia los inputs después de crear el post

    showMessage('El post ha sido creado de forma exitosa.');
    renderPosts();
}

// Función para limpiar los inputs
function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('body').value = '';
}

// Funcion para editar un post
function editPost(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.editable = true; 
        renderPosts();
    }
}

// Funcion para actualizar un post
function updatePost(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        const row = postsTable.querySelector(`tr:nth-child(${posts.indexOf(post) + 1})`);
        post.title = row.querySelector('input').value;
        post.body = row.querySelector('textarea').value;
        post.editable = false; 
        showMessage('El post ha sido editado correctamente.');
        renderPosts();
    }
}

// Funcion para eliminar un post
function deletePost(id) {
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts.splice(index, 1);
        showMessage('El post ha sido eliminado correctamente.');
        renderPosts();
    } else {
        showMessage('Post no encontrado.');
    }
}


fetchPosts();
