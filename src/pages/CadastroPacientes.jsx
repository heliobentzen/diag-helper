import { useState, useEffect } from "react";
import ModalConfirmarExclusao from "../modals/ModalConfirmarExclusao";
import PageWrapper from "../components/PageWrapper";

function CadastroPacientes() {
  // ===== STATES =====
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editId, setEditId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);

  const [formPacientes, setFormPacientes] = useState({
    nome: "",
    dataNascimento: "",
    telefone: "",
    cpf: "",
    idade: "",
    exames: [],
  });

  const [novoExame, setNovoExame] = useState({
    tipo: "",
    data: "",
    resultado: "",
  });

  // ===== LOAD =====
  useEffect(() => {
    fetch("http://localhost:3001/pacientes")
      .then((res) => res.json())
      .then(setPacientes)
      .catch(console.error);
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) =>
    setFormPacientes({ ...formPacientes, [e.target.name]: e.target.value });

  const handleExameChange = (e) =>
    setNovoExame({ ...novoExame, [e.target.name]: e.target.value });

  function limparFormulario() {
    setFormPacientes({
      nome: "",
      dataNascimento: "",
      telefone: "",
      cpf: "",
      idade: "",
      exames: [],
    });
    setNovoExame({ tipo: "", data: "", resultado: "" });
  }

  function iniciarEdicao(paciente) {
    setEditId(paciente.id);
    setFormPacientes(paciente);
    setMostrarFormulario(true);
  }

  function adicionarExame() {
    if (!novoExame.tipo || !novoExame.data || !novoExame.resultado) return;

    setFormPacientes({
      ...formPacientes,
      exames: [...formPacientes.exames, novoExame],
    });

    setNovoExame({ tipo: "", data: "", resultado: "" });
  }

  async function cadastrarPaciente(e) {
    e.preventDefault();

    if (!formPacientes.nome || !formPacientes.telefone) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const res = await fetch("http://localhost:3001/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formPacientes),
    });

    const novo = await res.json();
    setPacientes([...pacientes, novo]);
    limparFormulario();
    setMostrarFormulario(false);
  }

  async function salvarEdicao(e) {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3001/pacientes/${editId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPacientes),
      }
    );

    const atualizado = await res.json();

    setPacientes(
      pacientes.map((p) => (p.id === editId ? atualizado : p))
    );

    setEditId(null);
    limparFormulario();
    setMostrarFormulario(false);
  }

  async function confirmarExclusao() {
    await fetch(
      `http://localhost:3001/pacientes/${idSelecionado}`,
      { method: "DELETE" }
    );

    setPacientes(pacientes.filter((p) => p.id !== idSelecionado));
    setOpenModal(false);
  }

  // ===== FILTER =====
  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.cpf.includes(pesquisa)
  );

  // ===== RENDER =====
  return (
    <PageWrapper title="Cadastro de Pacientes">
      <main className="p-8 space-y-8">

        {/* 🔍 PESQUISA + BOTÃO */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <input
            type="text"
            placeholder="🔍 Pesquisar por nome ou CPF"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-lg"
          />

          <button
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              setEditId(null);
              limparFormulario();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            {mostrarFormulario ? "Fechar cadastro" : "Cadastrar paciente"}
          </button>
        </div>

        {/* 🧾 FORMULÁRIO */}
        {mostrarFormulario && (
          <form
            onSubmit={editId ? salvarEdicao : cadastrarPaciente}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg border"
          >
            <input
              name="nome"
              placeholder="Nome"
              value={formPacientes.nome}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            <input
              type="date"
              name="dataNascimento"
              value={formPacientes.dataNascimento}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            <input
              name="telefone"
              placeholder="Telefone"
              value={formPacientes.telefone}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            <input
              name="cpf"
              placeholder="CPF"
              value={formPacientes.cpf}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            <input
              type="number"
              name="idade"
              placeholder="Idade"
              value={formPacientes.idade}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            {/* EXAMES */}
            <div className="md:col-span-3 border-t pt-4">
              <h3 className="font-bold mb-2">Adicionar exame</h3>

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  name="tipo"
                  placeholder="Tipo"
                  value={novoExame.tipo}
                  onChange={handleExameChange}
                  className="p-2 border rounded"
                />

                <input
                  type="date"
                  name="data"
                  value={novoExame.data}
                  onChange={handleExameChange}
                  className="p-2 border rounded"
                />

                <input
                  name="resultado"
                  placeholder="Resultado"
                  value={novoExame.resultado}
                  onChange={handleExameChange}
                  className="p-2 border rounded"
                />
              </div>

              <button
                type="button"
                onClick={adicionarExame}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >
                Adicionar exame
              </button>
            </div>

            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 text-white py-2 rounded font-bold"
            >
              {editId ? "Salvar edição" : "Cadastrar paciente"}
            </button>
          </form>
        )}

        {/* 📋 LISTA SEMPRE VISÍVEL */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            Pacientes cadastrados ({pacientesFiltrados.length})
          </h2>

          {pacientesFiltrados.length === 0 ? (
            <p className="text-gray-500">Nenhum paciente encontrado.</p>
          ) : (
            <div className="space-y-2">
              {pacientesFiltrados.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-white p-4 rounded-lg border items-center"
                >
                  <p><strong>Nome:</strong> {p.nome}</p>
                  <p><strong>Telefone:</strong> {p.telefone}</p>
                  <p><strong>CPF:</strong> {p.cpf}</p>
                  <p><strong>Idade:</strong> {p.idade}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => iniciarEdicao(p)}
                      className="text-blue-600 font-semibold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        setIdSelecionado(p.id);
                        setOpenModal(true);
                      }}
                      className="text-red-600 font-semibold"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <ModalConfirmarExclusao
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={confirmarExclusao}
      />
    </PageWrapper>
  );
}

export default CadastroPacientes;
