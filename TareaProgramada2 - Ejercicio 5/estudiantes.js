
const estudiantes = [
    {nombre: "Juan", apellido: "Solis", nota: 90},
    {nombre: "Sofia", apellido: "Perez", nota: 80},
    {nombre: "Pedro", apellido: "Paredes", nota: 50},
    {nombre: "Maria", apellido: "Gutierrez", nota: 60},
    {nombre: "Maria", apellido: "Gutierrez", nota: 80},
    {nombre: "Brian", apellido: "Garro", nota: 95}

]

let sumaDeLasNotas = 0;

const infoEstudiantes = document.getElementById("informacionEstudiantes");

estudiantes.forEach(estudiante => {
    const { nombre, apellido, nota } = estudiante;

    const parrafoNyA = document.createElement("p");
    parrafoNyA.textContent = `${nombre} ${apellido}`;

    infoEstudiantes.appendChild(parrafoNyA);

    sumaDeLasNotas += nota;

});

const promedioNotas = sumaDeLasNotas/estudiantes.length;

const parrafoPromedioNotas = document.createElement("p");
parrafoPromedioNotas.textContent = "Promedio de Notas: " + promedioNotas;

infoEstudiantes.appendChild(parrafoPromedioNotas);