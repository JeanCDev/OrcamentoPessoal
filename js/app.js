// Objeto despesa
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true;
    }
}

// Gravar despesa - local Storage
class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    }
    
    recuperarTodosRegistros(){
        //array de despesas
        let despesas = [];
        
        let id = localStorage.getItem('id');
        
        // recuperar todas as despesas do localStorage
        for(let i = 1; i <= id; i++){
            //recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i));
            
            //verificar possibilidade de indice removido.
            if(despesa === null){
                continue
            }
            
            despesa.id = i;
            
            //adicionar despesa ao array
            despesas.push(despesa);
        }
        return despesas;
    }
    
    pesquisar(despesa){
        let despesasFiltradas = [];
        
        despesasFiltradas = this.recuperarTodosRegistros();
        
        //filtros
        //ano
        if(despesa.ano != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }
        //mes
       if(despesa.mes != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }
        
        //dia
        if(despesa.dia != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }
        
        //tipo
        if(despesa.tipo != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }
        
        //descricao
        if(despesa.descricao != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }
        
        //valor
        if(despesa.valor != ''){
           despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }
        
        return despesasFiltradas;
    }
    
    remover(id){
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

// Extrair dados de input
function cadastrarDespesa() {

    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if (despesa.validarDados()) {
        bd.gravar(despesa);

        //modificar modal(sucesso)
        document.getElementById('tituloModal').innerHTML = 'Nova Despesa Cadastrada';
        document.getElementById('corpoModal').innerHTML = 'Despesa cadastrada com successo';
        document.getElementById('tituloModal').className = 'text-success';
        document.getElementById('botaoModal').className = 'btn btn-success';
        document.getElementById('botaoModal').innerHTML = 'Voltar';

        $('#modalRegistraDespesa').modal('show');
        
        //apagar inputs
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else {

        //modificar Modal(Erro)
        document.getElementById('tituloModal').innerHTML = 'Dados Inválidos';
        document.getElementById('corpoModal').innerHTML = 'Faltam dados para cadastrar a despesa';
        document.getElementById('tituloModal').className = 'text-danger';
        document.getElementById('botaoModal').className = 'btn btn-danger';
        document.getElementById('botaoModal').innerHTML = 'Voltar e Corrigir';

        $('#modalRegistraDespesa').modal('show');
    }
}

function carregaListaDespesas(despesas = [], filtro = false){
    
    if(despesas.length == 0 &&filtro == false){
        despesas = bd.recuperarTodosRegistros();
    }
    
    //selecionando tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';
    
    //percorrer array despesa, dinamicamente
    despesas.forEach(function(d){
        
        //criando a linha da tabela
        let linha = listaDespesas.insertRow()
        
        //inserir Colunas
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano;
        
        //ajustar o tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        
        linha.insertCell(1).innerHTML = d.tipo;
        
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
        
        //botão de exclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = 'id_despesa_' + d.id;
        btn.onclick = function(){
            //remover despesa
            let id = this.id.replace('id_despesa_', '');
            
            bd.remover(id);
            
            window.location.reload();
        }
        linha.insertCell(4).append(btn);
        
        console.log(d)
    });   
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;
    
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    
    let despesas = bd.pesquisar(despesa);
    
    this.carregaListaDespesas(despesas, true) 
    
}
