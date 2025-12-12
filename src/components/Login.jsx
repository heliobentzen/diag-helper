import { useState } from "react";
import { useNavigate } from "react-router-dom";
//IMPORTAÇÃO DO MÓDULO DE DADOS
import { carregarUsuarios } from "../data/dadosUsuarios";
// import { salvarLog } from "../modals/salvaLogs"; // Manter se for usar

//add logo
import logo from "../assets/3.svg";

export default function Login() {
  const [formData, setFormData] = useState({
    tipoUsuario: "",
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  // A lista de usuários fake foi movida para 'dadosUsuarios.js'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem("");

    // CARREGA TODOS OS USUÁRIOS DO 'BANCO DE DADOS FAKE'
    const todosUsuarios = carregarUsuarios();

    const usuario = todosUsuarios.find(
      (u) =>
        u.email === formData.email &&
        u.senha === formData.senha &&
        u.tipoUsuario === formData.tipoUsuario
    );

    if (!usuario) {
      setMensagem("Credenciais inválidas ou tipo de usuário incorreto.");
      return;
    }

    //SALVA INFORMAÇÕES DO USUÁRIO NO localStorage
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        nome: usuario.nome,
        email: usuario.email, 
        tipoUsuario: usuario.tipoUsuario,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">

        {/* FORMULÁRIO */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
            Acesse sua conta
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <select
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Quem está acessando?</option>
              <option value="administrador">Administrador</option>
              <option value="medico">Médico</option>
              <option value="recepcionista">Recepcionista</option>
            </select>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail institucional"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />

            {mensagem && (
              <p className="text-center text-red-600 font-semibold">
                {mensagem}
              </p>
            )}

            <button
              className="text-center bg-primary-600 text-white rounded-lg p-2 mt-2 hover:bg-primary-700 transition-all cursor-pointer"
              type="submit"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => navigate("/suporte")}
              className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">
              Esqueci minha senha? Falar com o suporte
            </button>
{/* text-blue-600 hover:underline mt-3 text-center*/}
          </form>
        </div>
        {/* logo */}
        <div className="hidden md:flex w-1/2 bg-primary-400 items-center justify-center text-slate-900 flex-col p-8">

        {/* /LOGO ACIMA DO TEXTO/ */}
          <img
            src={logo}
            alt="Logo"
            className="w-50 mb-5"
          />

          <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
          <p className="text-center">
            Acesse o sistema com suas credenciais.
          </p>
        </div>

      </div>
    </div>
  );
}