

const abrirformulario = () =>{
    document.getElementById('tabela2').classList.add('d-none')
    document.getElementById('formulario').classList.remove('d-none')

}


const fecharFormulario = () =>{
    // atualizarTabela()
    document.getElementById('tabela2').classList.remove('d-none')
    document.getElementById('formulario').classList.add('d-none')
    limparFormulario()
    document.location.reload(true)

}

const limparFormulario = () =>{
    document.getElementById("campoNome").value = ""
    document.getElementById("campoTelefone").value = ""
    document.getElementById("campoCidade").value = ""

}
const lerRegistros = () => getArmazenamentoLocal()

const getArmazenamentoLocal = () => JSON.parse(localStorage.getItem('db_cliente')) ?? []

const setArmazenamentoLocal = (dbRegistros) =>{
    localStorage.setItem('db_cliente', JSON.stringify(dbRegistros))
}

const criar = (documento) =>{
    const dbRegistros = getArmazenamentoLocal()
    dbRegistros.push(documento)
    setArmazenamentoLocal(dbRegistros)
}
const limpaTabela = () =>{
    const rows = document.querySelectorAll("#tabela>tbody tr")
    rows.forEach(row => row.parentNode.removeChild(row))

}


const atualizarTabela = () =>{
    const dbRegistros = getArmazenamentoLocal()
    limpaTabela()
    dbRegistros.forEach(criarLinha)
   
}

const criarLinha = (documento, index) =>{
    const newRow = document.createElement("tr")
    newRow.innerHTML = `
    <td>${documento.nome}</td>
    <td>${documento.telefone}</td>
    <td>${documento.cidade}</td>
    <td>
        <button class="btn btn-warning" type="button" id="edit-${index}" >
            <i class="fa fa-fw fa-pencil"></i>
            Alterar
        </button>
        <button class="btn btn-danger" type="button"  id="delete-${index}">
            <i class="fa fa-fw fa-trash"></i>
            Deletar
        </button>
    </td>
    `
    document.querySelector("#tabela>tbody").appendChild(newRow)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const atualizar = (index, documento) =>{
    const dbRegistros = getArmazenamentoLocal()
    dbRegistros[index] = documento
    setArmazenamentoLocal(dbRegistros)

}

const salvarFormulario = () =>{
    if (isValidFields()){
        const documento = {
            nome: document.getElementById("campoNome").value,
            telefone: document.getElementById("campoTelefone").value,
            cidade: document.getElementById("campoCidade").value
        }
        const index = document.getElementById("campoNome").dataset.index
        if (index=="new") {
            criar(documento)
            atualizarTabela()
            fecharFormulario()

        } else {
            atualizar(index, documento)
            atualizarTabela()
            fecharFormulario()

        }
    }

}


const setDadosFormulario = (documento) =>{
    document.getElementById("campoNome").dataset.index = documento.index
    document.getElementById("campoNome").value = documento.nome
    document.getElementById("campoTelefone").value = documento.telefone
    document.getElementById("campoCidade").value = documento.cidade

}

const editarRegistro = (index) =>{
    const documento = getArmazenamentoLocal()[index]
    documento.index = index
    setDadosFormulario(documento)
    abrirformulario()

}

const deletarRegistro = (index) =>{
    const dbRegistros = getArmazenamentoLocal()
    dbRegistros.splice(index,1)
    setArmazenamentoLocal(dbRegistros)
}

const editarDeletar = (event) =>{
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        if (action=="edit"){
            editarRegistro(index)

        } else if (action=="delete"){
            const documento = getArmazenamentoLocal()[index]
            const response = confirm("Você deseja realmente excluir?")
            if (response){
                deletarRegistro(index)
                atualizarTabela()

            }

        }

    }

}


document.getElementById('adicionar').addEventListener('click', abrirformulario)
document.getElementById('cancelar').addEventListener('click', fecharFormulario)
document.getElementById('cadastrar').addEventListener('click', salvarFormulario)

document.querySelector('#tabela>tbody').addEventListener('click', editarDeletar)


atualizarTabela()