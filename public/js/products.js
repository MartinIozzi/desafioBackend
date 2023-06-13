const socket = io();

function render (products) {
    let html = products.map((elem, index) => {
        return `<div class="card display" style="width: 18rem;">
        <img src="${elem.img}" class="card-img-top" alt="...">
        <div class="card-body">
          <h4 class="card-title">${elem.name}</h4>
          <p class="card-text">${elem.description}</p>
          <p class="card-text">${elem.price}</p>
          <p class="card-text">${elem.code}</p>
          <p class="card-text">${elem.stock}</p>
          <p class="card-text">${elem.type}</p>
          <button class="btn-eliminar btn btn-danger" id="${elem.id}">Eliminar producto</button>
          <button class="btn btn-primary" onclick="addToCart()">Agregar al carrito</button>
        </div>
      </div>`
    }).join(' ');
    document.getElementById('products').innerHTML = html;
}

socket.on ('send', (products) => {
    render(products)
    let botonesEliminar = document.getElementsByClassName("btn-eliminar");
    botonesEliminar = Array.from(botonesEliminar)
    botonesEliminar.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', () => {
        socket.emit ('delete', botonEliminar.id)
    });
});

socket.on('send', () => {
  
})
});