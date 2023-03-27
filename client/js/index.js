// Add SDK credenciais
// Substitua pela chave PUBLIC_KEY em: https://www.mercadopago.com.br/settings/account/credentials/
const mercadopago = new MercadoPago('TEST-ba349520-3786-457c-8554-a49e61cf2c19', { //PUBLIC_KEY
    locale: 'pt-BR' // Os mais comuns são: 'pt-BR', 'es-AR' and 'en-US'
});

// Lidar com chamada para back-end e gerar preferência.
document.getElementById("checkout-btn").addEventListener("click", function () {

    $('#checkout-btn').attr("disabled", true);

    const orderData = {
        quantity: document.getElementById("quantity").value,
        description: document.getElementById("product-description").innerHTML,
        price: document.getElementById("unit-price").innerHTML
    };

    fetch("/create_preference", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (preference) {
            createCheckoutButton(preference.id);

            $(".shopping-cart").fadeOut(500);
            setTimeout(() => {
                $(".container_payment").show(500).fadeIn();
            }, 500);
        })
        .catch(function () {
            alert("Unexpected error");
            $('#checkout-btn').attr("disabled", false);
        });
});

// Criar preferência ao clicar no botão de checkout
function createCheckoutButton(preferenceId) {
    // Inicializa o checkout
    mercadopago.checkout({
        preference: {
            id: preferenceId
        },
        render: {
            container: '#button-checkout', // Nome da classe onde será exibido o botão de pagamento
            label: 'Pay', // Altere o texto do botão de pagamento (opcional)
        }
    });
}

// Lidar com atualização de preço
function updatePrice() {
    let quantity = document.getElementById("quantity").value;
    let unitPrice = document.getElementById("unit-price").innerHTML;
    let amount = parseInt(unitPrice) * parseInt(quantity);

    document.getElementById("cart-total").innerHTML = "$ " + amount;
    document.getElementById("summary-price").innerHTML = "$ " + unitPrice;
    document.getElementById("summary-quantity").innerHTML = quantity;
    document.getElementById("summary-total").innerHTML = "$ " + amount;
}

document.getElementById("quantity").addEventListener("change", updatePrice);
updatePrice();

// voltar
document.getElementById("go-back").addEventListener("click", function () {
    $(".container_payment").fadeOut(500);
    setTimeout(() => {
        $(".shopping-cart").show(500).fadeIn();
    }, 500);
    $('#checkout-btn').attr("disabled", false);
});