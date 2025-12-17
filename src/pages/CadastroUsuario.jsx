import { useState, useEffect } from "react";
import { MdSaveAlt } from "react-icons/md";
import PageWrapper from "../components/PageWrapper";

export default function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    status: "Ativo",
  });

  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("medico");
  const [erroCadastro, setErroCadastro] = useState("");

  // ===== LOAD =====
  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then(setUsuarios)
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  const gerarDataHora = () => {
    const agora = new Date();
    return `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  // ===== CADASTRAR =====
  const cadastrar = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      setErroCadastro("As senhas não coincidem.");
      return;
    }

    const novoUsuario = {
      ...form,
      senha,
      tipoUsuario,
      criadoEm: gerarDataHora(),
    };

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });

      const usuarioSalvo = await res.json();
      setUsuarios((prev) => [...prev, usuarioSalvo]);

      setForm({ nome: "", cpf: "", cargo: "", status: "Ativo" });
      setSenha("");
      setConfirmaSenha("");
      setTipoUsuario("medico");
      setErroCadastro("");
    } catch (err) {
      console.error(err);
      setErroCadastro("Erro ao cadastrar usuário.");
    }
  };

  // ===== REMOVER =====
  const remover = async (id) => {
    await fetch(`http://localhost:3001/usuarios/${id}`, { method: "DELETE" });
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  // ===== FILTER =====
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      u.cpf.includes(pesquisa) ||
      u.cargo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      u.tipoUsuario.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <PageWrapper title="Dashboard">
      {/* 🔍 PESQUISA NO TOPO */}
      <section className="bg-white p-4 shadow rounded mb-6">
        <input
          type="text"
          placeholder="🔍 Pesquisar por nome, CPF, cargo ou tipo de usuário"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-lg"
        />
      </section>

      {/* FORM CADASTRO */}
      <section className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-bold mb-4">Novo Usuário</h2>

        <form
          onSubmit={cadastrar}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Input
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />

          <Input
            label="CPF"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />

          <Input
            label="Cargo"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          />

          <select
            className="border p-2 rounded w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Input
            label="Confirme a Senha"
            type="password"
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="medico">Médico Laudista</option>
            <option value="medicoAssistente">Médico Assistente</option>
            <option value="recepcionista">Recepcionista</option>
            <option value="administrador">Administrador</option>
          </select>

          {erroCadastro && (
            <p className="text-red-500 text-sm col-span-2">
              {erroCadastro}
            </p>
          )}

          <button
            type="submit"
            className="bg-gray-500 text-black rounded flex items-center justify-center px-3 py-2 w-32 hover:bg-gray-600"
          >
            <MdSaveAlt size={16} className="mr-2" />
            Salvar
          </button>
        </form>
      </section>

      {/* TABELA */}
      <section className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-bold mb-4">
          Usuários Cadastrados ({usuariosFiltrados.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <Th>Nome</Th>
                <Th>CPF</Th>
                <Th>Cargo</Th>
                <Th>Status</Th>
                <Th>Tipo</Th>
                <Th>Criado em</Th>
                <Th>Ações</Th>
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-b">
                  <Td>{u.nome}</Td>
                  <Td>{u.cpf}</Td>
                  <Td>{u.cargo}</Td>
                  <Td>{u.status}</Td>
                  <Td>{u.tipoUsuario}</Td>
                  <Td>{u.criadoEm}</Td>
                  <Td>
                    <button
                      onClick={() => remover(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ===== COMPONENTES ===== */
function Input({ label, type = "text", ...props }) {
  return (
    <input
      type={type}
      placeholder={label}
      className="border p-2 rounded w-full"
      {...props}
      required
    />
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="px-3 py-2">{children}</td>;
}
