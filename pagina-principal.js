const banner = document.querySelector('.banner');
const labelPromocao = document.querySelector('.carrinho label')
const inputPromoção = document.querySelector('.sacola input');
const timer = document.querySelector('.contagem');
const divTopFilmes = document.querySelector('.topFilmes')
const divListaTopFilmes = document.querySelector('.topFilmes > .filmes')
const divListaFilmesGeneros = document.querySelector('.todosOsFilmes > .filmes')
const divBotoesDeGenero = document.querySelector('.botoesGeneros')
const divCarrinho = document.querySelector('.carrinho')

let topFilmes = [];
let todosOsFilmes = [];
let filmesNoCarrinho = [];



// calcula o preco do carrinho e testa possíveis cupons de desconto
const atualizarPrecoDoCarrinho = () => {
    const arrayDeFilmesNoCarrinho = document.querySelectorAll('.carrinho > .carrinho-filme')
    let valorTotal = 0;

    arrayDeFilmesNoCarrinho.forEach(filme => {
        valorDoFilme = Number(filme.querySelector('.preco-filme').innerText);
        quantidadeDoFilme = Number(filme.querySelector('.qntd').innerText)
        const valorParcial = valorDoFilme*quantidadeDoFilme
        valorTotal += valorParcial
    })

    if (inputPromoção.value === 'HTMLNAOELINGUAGEM') {
        valorTotal = valorTotal/2
    }

    document.querySelector('.preco-total').innerText = valorTotal;
}

// cria os cards das listas de filmes
const criarConteudoCard = (respostaJson, x) => {
    const card = document.createElement('div');
    card.classList.add('card');
    
    card.innerHTML = `
                        <img src="../imgs/Star 2.png" class='estrela-fav'>
                        <div>
                            <span class='nome-do-filme'>${respostaJson.results[x].original_title}</span>
                            <span class='nota-do-filme'>
                                <img src="../imgs/Star 1.png" alt="">
                                ${respostaJson.results[x].vote_average}
                            </span>
                        </div>
                        <button class='botao-adicionar-carrinho' id='${respostaJson.results[x].id}'>
                            <span>Sacola</span>
                            <span class='preco-do-filme'>${respostaJson.results[x].price}</span>
                        </button>`;

    card.style.background = `url(${respostaJson.results[x].poster_path}) center center no-repeat`;
    card.style['background-size'] = 'cover';

    return card;
};

// se a quantidade do filme no carrinho for maior do que 1, troca
// para o sinal de menos, se for igual a 1, troca para a lixeira
const atualizarImagemDeDiminuirValorNoCarrinho = (filme) => {
    const quantidade = filme.querySelector('.qntd').innerText;
    const ImgBotaoDiminuir = filme.querySelector('.botao-menos > img');

    if (Number(quantidade) > 1) {
        ImgBotaoDiminuir.removeAttribute('src');
        ImgBotaoDiminuir.setAttribute('src', '../imgs/menos.png');
    } else {
        ImgBotaoDiminuir.removeAttribute('src');
        ImgBotaoDiminuir.setAttribute('src', "../imgs/delete.png");
    };
} ;

// apaga o item da div carrinho e do array carrinho
const apagarItemDoCarrinho = (filme,x) => {
    filme.remove();
    filmesNoCarrinho.splice(x,1);

    if (filmesNoCarrinho.length === 0) {
        divCarrinho.innerHTML = `<span class='primeiroTexto'>Sua sacola está vazia</span>
                                 <span class='segundoTexto'>Adicione filmes agora</span>
                                 <img src='../imgs/Social Media.png'>`;

        document.querySelector('.fechar-carrinho').remove();
    };
};

// aumenta a quantidade do item no carrinho
const aumentarQuantidadeDoItemNoCarrinho = (idDoFilmeAAumentarQuantidade) => { 
    const arrayItemsNoCarrinho = divCarrinho.querySelectorAll('.carrinho-filme');

    let filmeASerAumentado;
    for (let x = 0; x < arrayItemsNoCarrinho.length; x++) {
        if (Number(idDoFilmeAAumentarQuantidade) === Number(arrayItemsNoCarrinho[x].id)) {
            filmeASerAumentado = arrayItemsNoCarrinho[x];
            let quantidade = Number(filmeASerAumentado.querySelector('.qntd').innerText);
            quantidade++;
            filmeASerAumentado.querySelector('.qntd').innerText = quantidade;
        };
    };
    atualizarImagemDeDiminuirValorNoCarrinho(filmeASerAumentado);
};

//diminui a quantidade do item no carrinho se a quantidade for maior do que um;
//caso seja menor, apaga o item do carrinho
const diminuirQuantidadeDoItemNoCarrinho = (idDoFilmeADiminuirQuantidade) => { 
    const arrayItemsNoCarrinho = divCarrinho.querySelectorAll('.carrinho-filme');

    let filmeASerDiminuido;
    for (let x = 0; x < arrayItemsNoCarrinho.length; x++) {
        if (Number(idDoFilmeADiminuirQuantidade) === Number(arrayItemsNoCarrinho[x].id)) {
            filmeASerDiminuido = arrayItemsNoCarrinho[x];
            let quantidade = Number(filmeASerDiminuido.querySelector('.qntd').innerText);
            quantidade--;

            if (quantidade < 1) {
                apagarItemDoCarrinho(filmeASerDiminuido, x);
            } else {
                filmeASerDiminuido.querySelector('.qntd').innerText = quantidade;
            };
        };
    };
    atualizarImagemDeDiminuirValorNoCarrinho(filmeASerDiminuido);
};

// define o innerHTML do item do filme no carrinho e adiciona as informacoes necessárias
const inserirHTMLAoItemDoCarrinho = (itemFilmeCarrinho, filme) => {
    itemFilmeCarrinho.innerHTML = `<div class='poster-filme' style='background: url("${filme.poster_path}") center center / cover no-repeat;'></div>
                                    <div class="dados-filme">
                                        <span class='nome-filme'>${filme["title"]}</span>
                                        <span class='preco-filme'>${filme["price"]}</span>
                                    </div>
                                    <div class="quantidade">
                                        <button class='botao-mais'><img src="../imgs/add.png" class='iconesQuantidade'></button>
                                        <span class='qntd'>1</span>
                                        <button class='botao-menos'><img src="../imgs/delete.png" class='iconesQuantidade'></button>
                                    </div>`;
}

//cria a div do item do filme no carrinho
const adicionarFilmesNoCarrinho = (filme) => {
        let itemFilmeCarrinho = document.createElement('div') ;
        itemFilmeCarrinho.classList.add('carrinho-filme');
        itemFilmeCarrinho.setAttribute('id', filme.id);

        inserirHTMLAoItemDoCarrinho(itemFilmeCarrinho, filme);
        
        const botaoAumentar = itemFilmeCarrinho.querySelector('.botao-mais');
        const botaoDiminuir = itemFilmeCarrinho.querySelector('.botao-menos');
        botaoAumentar.addEventListener('click', () => {
            aumentarQuantidadeDoItemNoCarrinho(itemFilmeCarrinho.id);
            atualizarPrecoDoCarrinho();
        });
        botaoDiminuir.addEventListener('click', () => {
            diminuirQuantidadeDoItemNoCarrinho(itemFilmeCarrinho.id);
            atualizarPrecoDoCarrinho();
        });
        
        divCarrinho.append(itemFilmeCarrinho)
};

// adiciona o botao de fechar o carrinho e suas interatividades
const adicionarBotaoDeFecharOCarrinho = () => {
    const botao = document.createElement('button');
    botao.classList.add('fechar-carrinho');
    botao.innerHTML = `<span>Confirme seus dados</span>
                       <span class='preco-total'></span>`;
    botao.setAttribute('id', 'botaoAtivo');
    document.querySelector('.sacola').append(botao);

    botao.addEventListener('click', () => {
        const carrinhoFechado = {
            filmes: [],
            cupom: inputPromoção.value,
        };

        const arrayItemsNoCarrinho = divCarrinho.querySelectorAll('.carrinho-filme');
        for (x = 0; x < arrayItemsNoCarrinho.length; x++) {
            const novoItem = {
                nome: arrayItemsNoCarrinho[x].querySelector('.nome-filme').innerText,
                preco: Number(arrayItemsNoCarrinho[x].querySelector('.preco-filme').innerText),
                quantidade: Number(arrayItemsNoCarrinho[x].querySelector('.qntd').innerText),
                poster: arrayItemsNoCarrinho[x].querySelector('.poster-filme').style.background
            };
            carrinhoFechado.filmes.push(novoItem);
        };
        localStorage.setItem('carrinho', JSON.stringify(carrinhoFechado));
        window.location.href = 'file:///C:/Users/felip/OneDrive/Documents/CURSO%20CUBOS/FRONT/SEGUNDA%20UNIDADE/desafio/desafio2_frontEnd/html/confirmarDados.html';
    });
};

// adiciona a funcionalidade do botão do card do filme na lista, para adicionar o item
// do filme ao carrinho
const adicionarInteracaoDoBotaoDeAdicionarFilmeAoCarrinho = (card, listaDeFilmes) => {
    const botao = card.querySelector('button');
    const idDoFilme = botao.id;

    botao.addEventListener('click', () => {
        if (filmesNoCarrinho.length === 0) {
            const listaDeFilmesFiltrada = listaDeFilmes.filter(filme => {
                return filme.id === Number(idDoFilme);
            });
            filmesNoCarrinho.push(listaDeFilmesFiltrada[0]);
            divCarrinho.innerHTML = '';
            adicionarFilmesNoCarrinho(filmesNoCarrinho[filmesNoCarrinho.length-1]);
            adicionarBotaoDeFecharOCarrinho();
        } else {
            let existente = false;
            for (let x = 0; x < filmesNoCarrinho.length; x++) {
                if (filmesNoCarrinho[x].id === Number(idDoFilme)) {
                    existente = true;
                    aumentarQuantidadeDoItemNoCarrinho(filmesNoCarrinho[x].id);
                };
            };

            if(!existente) {
                const listaDeFilmesFiltrada = listaDeFilmes.filter(filme => {
                    return filme.id === Number(idDoFilme);
                });
                filmesNoCarrinho.push(listaDeFilmesFiltrada[0]);
                adicionarFilmesNoCarrinho(filmesNoCarrinho[filmesNoCarrinho.length-1]);
            };
        };
        atualizarPrecoDoCarrinho();
    });
};



//criando lista dos 5 top filmes
fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR')
    .then(respostaTopFilmes => respostaTopFilmes.json())
    .then(respostaJsonTopFilmes => {
        topFilmes = respostaJsonTopFilmes.results
        for(let x = 0; x < 5; x++) {
            const card = criarConteudoCard(respostaJsonTopFilmes, x)
            divListaTopFilmes.append(card);
            adicionarInteracaoDoBotaoDeAdicionarFilmeAoCarrinho(card, topFilmes)
        }
    })

// criando lista dos 20 top filmes
fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR')
    .then(respostaTodos => respostaTodos.json())
    .then(respostaJsonTodos => {
        todosOsFilmes = respostaJsonTodos.results
        
        todosOsFilmes.forEach((filme, x) => {
            const card = criarConteudoCard(respostaJsonTodos, x)
            divListaFilmesGeneros.append(card)
            adicionarInteracaoDoBotaoDeAdicionarFilmeAoCarrinho(card, todosOsFilmes)
        })

        const botaoGeneroTodos = document.querySelector('.botoesGeneros > button')
        botaoGeneroTodos.addEventListener('click', () => {
            //trocando o botao ativo
            const arrayBotoesDeGenero = document.querySelectorAll('.botoesGeneros > button')
            for(let x = 0; x < arrayBotoesDeGenero.length; x++) {
                arrayBotoesDeGenero[x].setAttribute('id', '');
            }
            botaoGeneroTodos.setAttribute('id', 'ativo');
            
            //apagando a lista
            divListaFilmesGeneros.innerHTML = ''

            todosOsFilmes.forEach((filme, x) => {
                const card = criarConteudoCard(respostaJsonTodos, x)
                divListaFilmesGeneros.append(card)
                adicionarInteracaoDoBotaoDeAdicionarFilmeAoCarrinho(card, todosOsFilmes)
            })
        })
    })

// criando lista dos outros generos
fetch('https://tmdb-proxy-workers.vhfmag.workers.dev/3/genre/movie/list?language=pt-BR')
    .then(respostaAPIIdGeneros => respostaAPIIdGeneros.json())
    .then(respostaJsonApiIdGeneros => {
        const listaDeGeneros = respostaJsonApiIdGeneros.genres
        for (let x = 0; x < 4; x++) {
            const botao = document.createElement('button')
            botao.classList.add(listaDeGeneros[x].name)
            botao.innerText = listaDeGeneros[x].name
            divBotoesDeGenero.append(botao)

            botao.addEventListener('click', ()=> {
                //trocando o botao ativo
                const arrayBotoesDeGenero = document.querySelectorAll('.botoesGeneros > button')
                for(let x = 0; x < arrayBotoesDeGenero.length; x++) {
                    arrayBotoesDeGenero[x].setAttribute('id', '');
                }
                botao.setAttribute('id', 'ativo');
                
                //apagando a lista
                divListaFilmesGeneros.innerHTML = ''

                //fazendo a requisicao da nova lista
                fetch(`https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?with_genres=${listaDeGeneros[x].id}&language=pt-BR`)
                    .then(respostaListaFilmesGeneros => respostaListaFilmesGeneros.json())
                    .then(respostaJsonListaFilmesGeneros => {
                        todosOsFilmes = respostaJsonListaFilmesGeneros.results;
                        const listaDeFilmesDoGenero = respostaJsonListaFilmesGeneros.results
                        for (let x = 0; x < listaDeFilmesDoGenero.length; x++) {
                            const card = criarConteudoCard(respostaJsonListaFilmesGeneros, x)
                            divListaFilmesGeneros.append(card)
                            adicionarInteracaoDoBotaoDeAdicionarFilmeAoCarrinho(card, todosOsFilmes)
                        }
                    })
            })
        }
    })

// inserindo cupom de desconto
banner.addEventListener('click', () => {
    inputPromoção.value = 'HTMLNAOELINGUAGEM'
    banner.style.display = 'none';
    divTopFilmes.style['margin-top'] = 0;

    if (document.querySelector('.fechar-carrinho')) {
        atualizarPrecoDoCarrinho()
    }
})

// implementando o timer do banner
let minutos = 5;
let segundos = 0;
timer.innerText = `00:${minutos.toString().padStart(2, 0)}:${segundos.toString().padStart(2, 0)}`
const diminuirTempo = () => {
    if (minutos === 0 && segundos === 0) {
        banner.style.display = 'none';
        divTopFilmes.style['margin-top'] = 0;
        clearInterval(idDoSetInterval)
    } else if (segundos > 0) {
        segundos--;
    } else if (segundos === 0) {
        minutos--;
        segundos = 59;
    }

    timer.innerText = `00:${minutos.toString().padStart(2, 0)}:${segundos.toString().padStart(2, 0)}`
} 
const idDoSetInterval = setInterval(diminuirTempo, 1000)

// toda vez que digitarem no input do carrinho, ele testa se o cupom inserido existe
document.querySelector('.sacola').querySelector('input').addEventListener('input', () => {
    atualizarPrecoDoCarrinho();
});