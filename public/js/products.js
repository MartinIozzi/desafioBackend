const socket = io();

function render (products) {
    let html = products.map((elem) => {
        return `<div class="card display bg-dark-subtle" style="width: 22rem;">
        <div class="card-body col">
        <img src="${elem.img}" class="card-img-top" style="width: 12rem;" alt="...">
          <h4 class="card-title">${elem.name}</h4>
          <p class="card-text">${elem.description}</p>
          <p class="card-text">${elem.price}</p>
          <p class="card-text">${elem.code}</p>
          <p class="card-text">${elem.stock}</p>
          <p class="card-text">${elem.type}</p>
          <button class="btn-eliminar btn btn-danger" id="${elem._id}">Eliminar producto</button>
        </div>
      </div>`
    }).join(' ');
    document.getElementById('products').innerHTML = html;
}

socket.on ('send', (products) => {
  try {
    render(products)
    let botonesEliminar = document.getElementsByClassName("btn-eliminar");
    botonesEliminar = Array.from(botonesEliminar)
    botonesEliminar.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', () => {
      const productId = botonEliminar.id;
        socket.emit ('delete', productId);
    });
  });
  } catch (error) {
    console.log(error);
  }
});

async function showCart() {
  
}

let btnShowCart = document.getElementById("showCart")
btnShowCart.addEventListener('click', (showCart))