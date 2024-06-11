const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addresInput = document.getElementById('address');
const addresWarn = document.getElementById('address-warn');
const menuBebidas = document.getElementById('menu-bebidas');

let cart = []

// ABRIR O MODAL NO CARRINHO
cartBtn.addEventListener("click", function(){
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
    updateCartModal();
})

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(teste){
    if(teste.target === cartModal){
        cartModal.classList.remove("flex");
        cartModal.classList.add("hidden");
    }
})

// FECHAR AO CLICAR BOTAO DE FECHAR
closeModalBtn.addEventListener("click", function(){
    cartModal.classList.remove("flex");
    cartModal.classList.add("hidden");
})

// Adicionar ao carrinho ao clicar no botão no menu
menu.addEventListener("click", function(result){
    let parentButton = result.target.closest(".add-to-cart-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addtoCart(name, price)
    }
})

menuBebidas.addEventListener("click", function(result){
    let parentButton = result.target.closest(".add-to-cart-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addtoCart(name, price);
    }
});

function addtoCart(nome, preco){
    const existeItem = cart.find(item => item.nome === nome)
    if(existeItem){
        // Se o item já existe, aumenta a quantidade + 1 e atualiza o preço total
        existeItem.quantity += 1;
        existeItem.preco += preco;
    } else {
        cart.push({
            nome,
            preco,
            quantity: 1
        })
    }
    updateCartModal();
}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.nome}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">Valor: R$ ${item.preco.toFixed(2)}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${item.nome}">
                Remover
            </button>
        </div>
        `
        total += item.preco;
        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.textContent = cart.length;
}

// função para remover conteúdo do carrinho
cartItemsContainer.addEventListener("click", function(evento){
    if(evento.target.classList.contains("remove-from-cart-btn")){
        const nome = evento.target.getAttribute("data-name");
        //console.log(nome)
        removeFromCart(nome);
    }
})

function removeFromCart(nome){
    const index = cart.findIndex(item => item.nome === nome);
    
    if (index !== -1){  // Correção: Verificar se o índice é válido
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;  // Decrementar a quantidade do item
        } else {
            cart.splice(index, 1);  // Remover o item do carrinho se a quantidade for 1
        }
        updateCartModal();  // Atualizar o modal do carrinho
    }
}

addresInput.addEventListener("input", function(evento){
    let inputValue = evento.target.value;

    if(inputValue !== ""){ // SE O USUARIO ESTA DIGITANDO O VERMELHO SOME
        addresInput.classList.remove("border-red-500");
        addresWarn.classList.add("hidden"); // Corrigido para "add"
    }
})

// Finalizar PEDIDO
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if (!isOpen){
        Toastify({
            text: "Ops. O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
             },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;

    if(addresInput.value === ""){
        addresWarn.classList.remove("hidden");
        addresInput.classList.add("border-red-500");
        return;
    }

    // ENVIAR PEDIDO PARA API WHATS
    const cartItems = cart.map(item => {
        return `${item.nome} Quantidade: (${item.quantity}) Preço: R$ (${item.preco.toFixed(2)}) |`;
    }).join(" ") // join transforma a array em string

    const message = encodeURIComponent(cartItems + " Endereço: " + addresInput.value);
    const phone = "";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpando carrinho
    cart = [];
    updateCartModal();
})

// Verificando se o restaurante está aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; // true
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-500");
} else {
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}
