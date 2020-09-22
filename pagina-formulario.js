const divCarrinho = document.querySelector('.carrinho');
const sacola = document.querySelector('.sacola')
const itemsNoCarrinho = JSON.parse(localStorage.getItem('carrinho'));





// calcula o valor do carrinho, levando em consideração os filmes e o cupom de descontos inserido;
const calcularValor = () => {
    let subtotal = 0;
    itemsNoCarrinho.filmes.forEach(filme => {
        let valorParcial = filme.preco * filme.quantidade;
        subtotal += valorParcial; 
    })
    document.querySelector('.preco-subtotal').innerText = subtotal;
    
    if (sacola.querySelector('input').value === 'HTMLNAOELINGUAGEM') {
        document.querySelector('.preco-total').innerText = subtotal/2;
    } else {
        document.querySelector('.preco-total').innerText = subtotal;
    };
};

// adicionar o innerHTML do item do carrinho
const adicionarHTMLAoItemDoCarrinho = (item, informacoesDoItem) => {
    item.innerHTML = `  <div class='poster-filme'></div>
                        <div class="dados-filme">
                            <span class='nome-filme'>${informacoesDoItem["nome"]}</span>
                            <span class='preco-filme'>${informacoesDoItem["preco"]}</span>
                        </div>
                        <div class="quantidade">
                            <span class='qntd'>${informacoesDoItem["quantidade"]}</span>
                        </div>`;
};

// cria os itens do carrinho ao iniciar a página
const adicionarItemAoCarrinho = (informacoesDoItem) => {
    const item = document.createElement('div');
    item.classList.add('carrinho-filme');
    
    adicionarHTMLAoItemDoCarrinho(item, informacoesDoItem);
    item.querySelector('.poster-filme').style.background = informacoesDoItem.poster;
    divCarrinho.append(item);
};

// roda o array dos filmes no carrinho, para adicionar os itens no html da página
itemsNoCarrinho.filmes.forEach(filme => {
    adicionarItemAoCarrinho(filme);
}); 

// insere o cupom de desconto que estava na página anterior
sacola.querySelector('input').value = itemsNoCarrinho.cupom;

// calcula o valor inicial do carrinho;
calcularValor();
// toda vez que digitarem no input, ele chama a funcao de calcular valor para testar o cupom de desconto
sacola.querySelector('input').addEventListener('input', () => {
    calcularValor();
});

// testa para ver se o formulário está completo, caso esteja, ativa o botao de terminar a compra
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

// interatividade do botao de fechar a compra. caso esteja ativo, termina a compra e direciona para a próxima página,
// caso nao, da um alert
sacola.querySelector('button').addEventListener('click', () => {
    
    if (sacola.querySelector('button').getAttribute('id') === 'botaoAtivo') {
        window.location.href = 'file:///C:/Users/felip/OneDrive/Documents/CURSO%20CUBOS/FRONT/SEGUNDA%20UNIDADE/desafio/desafio2_frontEnd/html/pedidoConcluido.html'
        localStorage.removeItem('carrinho')
    } else {
        alert('O formulário não está completo!')
    }
})

