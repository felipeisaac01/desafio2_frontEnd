const divCarrinho = document.querySelector('.carrinho');
const sacola = document.querySelector('.sacola')
const itemsNoCarrinho = JSON.parse(localStorage.getItem('carrinho'));



const adicionarHTMLAoItemDoCarrinho = (item, informacoesDoItem) => {
    item.innerHTML = `  <div class='poster-filme'></div>
                        <div class="dados-filme">
                            <span class='nome-filme'>${informacoesDoItem["nome"]}</span>
                            <span class='preco-filme'>${informacoesDoItem["preco"]}</span>
                        </div>
                        <div class="quantidade">
                            <span class='qntd'>${informacoesDoItem["quantidade"]}</span>
                        </div>`
}

const calcularValor = () => {
    let subtotal = 0;
    itemsNoCarrinho.filmes.forEach(filme => {
        let valorParcial = filme.preco * filme.quantidade;
        subtotal += valorParcial; 
    })
    document.querySelector('.preco-subtotal').innerText = subtotal;
    
    if (sacola.querySelector('input').value === 'HTMLNAOELINGUAGEM') {
        document.querySelector('.preco-total').innerText = subtotal/2
    } else {
        document.querySelector('.preco-total').innerText = subtotal
    };
}

const adicionarItemAoCarrinho = (informacoesDoItem) => {
    const item = document.createElement('div');
    item.classList.add('carrinho-filme');
    
    adicionarHTMLAoItemDoCarrinho(item, informacoesDoItem)
    item.querySelector('.poster-filme').style.background = informacoesDoItem.poster;
    divCarrinho.append(item)
}

itemsNoCarrinho.filmes.forEach(filme => {
    adicionarItemAoCarrinho(filme);
}); 

calcularValor()

sacola.querySelector('input').addEventListener('input', () => {
    calcularValor()
})

sacola.querySelector('input').value = itemsNoCarrinho.cupom;

const arrayInputsForm = document.querySelectorAll('form input');
arrayInputsForm.forEach(input => {
    input.addEventListener('input', () => {
        let completo = true;

        arrayInputsForm.forEach(input => {

            if (input.value === '') {
                completo = false;
            };
        });

        if (completo) {
            sacola.querySelector('button').setAttribute('id', 'botaoAtivo');
        } else {
            sacola.querySelector('button').removeAttribute('id')
        };
    });
});

sacola.querySelector('button').addEventListener('click', () => {
    
    if (sacola.querySelector('button').getAttribute('id') === 'botaoAtivo') {
        window.location.href = 'file:///C:/Users/felip/OneDrive/Documents/CURSO%20CUBOS/FRONT/SEGUNDA%20UNIDADE/desafio/desafio2_frontEnd/html/pedidoConcluido.html'
    } else {
        alert('O formulário não está completo!')
    }
})

