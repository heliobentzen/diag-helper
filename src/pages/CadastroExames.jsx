// import { useEffect, useState } from "react";
// import PageWrapper from "../components/PageWrapper";
// import BotaoCadastrar from "../components/BotaoCadastrar";
// import BarraPesquisa from "../components/BarraPesquisa";
// import ModalErro from "../modals/ModalErro";
// import ModalAviso from "../modals/ModalAviso";
// import {
//   MdSave,
//   MdEdit,
//   MdDelete,
//   MdScience,
//   MdVisibility,
//   MdClose,
//   MdNavigateBefore,
//   MdNavigateNext,
// } from "react-icons/md";
// import api from "../services/api";
// import { useAuth } from "../hooks/useAuth";
// import { registrarLog } from "../services/auditService";
// import { TIPOS_EXAMES } from "../components/ListaExames";

// export default function CadastroExames() {
//   const { usuario } = useAuth();
//   const [exames, setExames] = useState([]);
//   const [pacientes, setPacientes] = useState([]);
//   const [pesquisa, setPesquisa] = useState("");
//   const [mostrarFormulario, setMostrarFormulario] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [carregandoArquivos, setCarregandoArquivos] = useState(false);

//   const [arquivosBase64, setArquivosBase64] = useState([]);
//   const [modalArquivos, setModalArquivos] = useState(null);
//   const [indiceArquivoAtual, setIndiceArquivoAtual] = useState(0);

//   // Controle de Modais de Feedback
//   const [modalStatus, setModalStatus] = useState({
//     open: false,
//     tipo: "",
//     titulo: "",
//     mensagem: "",
//   });

//   const [form, setForm] = useState({
//     pacienteId: "",
//     pacienteNome: "",
//     tipo: "",
//     data: "",
//     resultado: "",
//     arquivos: [],
//     observacoes: "",
//   });

//   const nomeOperador = usuario?.nome || "Operador";

//   const carregarDados = async () => {
//     try {
//       const resExames = await api.get("/exames");
//       const resPacientes = await api.get("/pacientes");
//       setExames(resExames || []);
//       setPacientes(resPacientes || []);
//     } catch (error) {
//       console.error("Erro ao carregar dados:", error);
//     }
//   };

//   useEffect(() => {
//     carregarDados();
//   }, []);

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
//     const arquivosInvalidos = files.filter(
//       (file) => !tiposPermitidos.includes(file.type),
//     );

//     if (arquivosInvalidos.length > 0) {
//       setModalStatus({
//         open: true,
//         tipo: "erro",
//         titulo: "Arquivo Não Suportado",
//         mensagem:
//           "Apenas imagens (JPEG, PNG) são permitidas para análise morfológica.",
//       });
//       e.target.value = "";
//       return;
//     }

//     setCarregandoArquivos(true);
//     let processados = [];

//     try {
//       for (const file of files) {
//         const base64 = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve(reader.result);
//           reader.onerror = reject;
//           reader.readAsDataURL(file);
//         });
//         processados.push(base64);
//       }
//       setArquivosBase64(processados);
//     } catch (globalError) {
//       setModalStatus({
//         open: true,
//         tipo: "erro",
//         titulo: "Erro no Processamento",
//         mensagem: "Falha ao converter imagens para Base64.",
//       });
//     } finally {
//       setCarregandoArquivos(false);
//     }
//   };

//   const salvarExame = async (e) => {
//     e.preventDefault();
//     try {
//       const dadosParaSalvar = {
//         ...form,
//         arquivos: arquivosBase64.length > 0 ? arquivosBase64 : form.arquivos,
//         analisado: false,
//       };

//       if (editId) {
//         // --- LOG DE EDIÇÃO ---
//         await api.put(`/exames/${editId}`, dadosParaSalvar);
//         await registrarLog(
//           nomeOperador,
//           `Editou exame de: ${form.pacienteNome}`,
//           "ALTERAÇÃO",
//           `ID: ${editId} | Tipo: ${form.tipo}`,
//         );
//       } else {
//         // --- LOG DE CADASTRO ---
//         await api.post("/exames", dadosParaSalvar);
//         await registrarLog(
//           nomeOperador,
//           `Cadastrou novo exame: ${form.tipo}`,
//           "CADASTRO",
//           `Paciente: ${form.pacienteNome}`,
//         );
//       }

//       await carregarDados();
//       limparFormulario();
//       setModalStatus({
//         open: true,
//         tipo: "aviso",
//         titulo: "Operação Concluída",
//         mensagem: editId
//           ? "Alterações salvas com sucesso!"
//           : "Exame cadastrado com sucesso!",
//       });
//     } catch (error) {
//       setModalStatus({
//         open: true,
//         tipo: "erro",
//         titulo: "Erro de Sistema",
//         mensagem: "Não foi possível comunicar com o servidor.",
//       });
//     }
//   };

//   const deletarExame = async (id, nomePaciente) => {
//     // Mantendo confirm nativo por ser uma ação destrutiva rápida,
//     // mas registrando o log da exclusão após o sucesso.
//     if (
//       window.confirm(
//         `ATENÇÃO: Deseja excluir permanentemente o exame de ${nomePaciente}?`,
//       )
//     ) {
//       try {
//         await api.delete(`/exames/${id}`);
//         await registrarLog(
//           nomeOperador,
//           `Excluiu exame do paciente: ${nomePaciente}`,
//           "EXCLUSÃO",
//           `ID deletado: ${id}`,
//         );
//         carregarDados();
//       } catch (error) {
//         setModalStatus({
//           open: true,
//           tipo: "erro",
//           titulo: "Erro ao Excluir",
//           mensagem: "Não foi possível remover o registro.",
//         });
//       }
//     }
//   };

//   const abrirVisualizacao = async (exame) => {
//     setModalArquivos(exame.arquivos);
//     setIndiceArquivoAtual(0);
//     // LOG: Visualização de anexos (Privacidade)
//     await registrarLog(
//       nomeOperador,
//       `Acessou galeria de imagens: ${exame.pacienteNome}`,
//       "VISUALIZAÇÃO",
//     );
//   };

//   const limparFormulario = () => {
//     setForm({
//       pacienteId: "",
//       pacienteNome: "",
//       tipo: "",
//       data: "",
//       resultado: "",
//       arquivos: [],
//       observacoes: "",
//     });
//     setEditId(null);
//     setArquivosBase64([]);
//     setMostrarFormulario(false);
//   };

//   const formatarDataBR = (dataString) => {
//     if (!dataString) return "---";
//     const [ano, mes, dia] = dataString.split("-");
//     return `${dia}/${mes}/${ano}`;
//   };

//   return (
//     <PageWrapper title="Gestão de Exames">
//       <div className="max-w-7xl mx-auto space-y-6 pb-10">
//         {/* Cabeçalho de Ações */}
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
//           <BarraPesquisa
//             pesquisa={pesquisa}
//             setPesquisa={setPesquisa}
//             placeholder="Filtrar por nome do paciente..."
//           />
//           {!mostrarFormulario && (
//             <BotaoCadastrar
//               label="Novo Exame"
//               onClick={() => setMostrarFormulario(true)}
//             />
//           )}
//         </div>

//         {/* Seção de Formulário (Cadastro/Edição) */}
//         {mostrarFormulario && (
//           <section className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-in fade-in zoom-in duration-200">
//             <div className="flex items-center gap-2 mb-6 text-primary-600">
//               <MdScience size={26} />
//               <h2 className="font-bold text-xl text-slate-800">
//                 {editId ? "Editar Registro de Exame" : "Novo Cadastro de Exame"}
//               </h2>
//             </div>

//             <form
//               onSubmit={salvarExame}
//               className="grid grid-cols-1 md:grid-cols-3 gap-5"
//             >
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-bold text-slate-500 ml-1">
//                   Paciente
//                 </label>
//                 <select
//                   required
//                   value={form.pacienteId}
//                   onChange={(e) => {
//                     const p = pacientes.find(
//                       (x) => String(x.id) === String(e.target.value),
//                     );
//                     if (p)
//                       setForm({
//                         ...form,
//                         pacienteId: p.id,
//                         pacienteNome: p.nome,
//                       });
//                   }}
//                   className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
//                 >
//                   <option value="">Selecione o paciente</option>
//                   {pacientes.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.nome}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-bold text-slate-500 ml-1">
//                   Tipo de Análise
//                 </label>
//                 <select
//                   name="tipo"
//                   value={form.tipo}
//                   onChange={(e) => setForm({ ...form, tipo: e.target.value })}
//                   required
//                   className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
//                 >
//                   <option value="">Selecione o tipo</option>
//                   {TIPOS_EXAMES.map((t) => (
//                     <option key={t} value={t}>
//                       {t}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-bold text-slate-500 ml-1">
//                   Data da Coleta
//                 </label>
//                 <input
//                   type="date"
//                   value={form.data}
//                   onChange={(e) => setForm({ ...form, data: e.target.value })}
//                   className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition-all"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-bold text-slate-500 ml-1">
//                   Resultado Preliminar
//                 </label>
//                 <input
//                   placeholder="Ex: Normal, Alterado..."
//                   value={form.resultado}
//                   onChange={(e) =>
//                     setForm({ ...form, resultado: e.target.value })
//                   }
//                   className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition-all"
//                 />
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-bold text-slate-500 ml-1">
//                   Imagens da Amostra
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/jpeg,image/png,image/jpg"
//                     onChange={handleFileChange}
//                     className={`w-full border p-3 rounded-xl text-sm ${carregandoArquivos ? "opacity-50 cursor-wait" : "bg-slate-50"}`}
//                     disabled={carregandoArquivos}
//                   />
//                   {carregandoArquivos && (
//                     <span className="absolute right-3 top-3 text-xs text-primary-600 font-bold animate-pulse">
//                       Processando...
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="col-span-full flex flex-col gap-1">
//                 <label className="text-xs font-bold text-slate-500 ml-1">
//                   Observações Médicas
//                 </label>
//                 <textarea
//                   placeholder="Notas adicionais sobre a coleta ou estado da amostra..."
//                   value={form.observacoes}
//                   onChange={(e) =>
//                     setForm({ ...form, observacoes: e.target.value })
//                   }
//                   className="border p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 resize-none transition-all"
//                 />
//               </div>

//               <div className="flex gap-3 col-span-full pt-2">
//                 <button
//                   type="submit"
//                   disabled={carregandoArquivos}
//                   className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all disabled:bg-slate-400 cursor-pointer shadow-md"
//                 >
//                   <MdSave size={20} />{" "}
//                   {carregandoArquivos ? "Aguarde..." : "Salvar Registro"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={limparFormulario}
//                   className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
//                 >
//                   Descartar
//                 </button>
//               </div>
//             </form>
//           </section>
//         )}

//         {/* Listagem de Exames */}
//         <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-slate-50 border-b border-slate-200">
//                 <tr>
//                   <th className="p-4 text-slate-600 font-bold">Paciente</th>
//                   <th className="p-4 text-slate-600 font-bold">
//                     Tipo de Exame
//                   </th>
//                   <th className="p-4 text-slate-600 font-bold">Data</th>
//                   <th className="p-4 text-center text-slate-600 font-bold">
//                     Imagens
//                   </th>
//                   <th className="p-4 text-center text-slate-600 font-bold">
//                     Ações
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {exames
//                   .filter((e) =>
//                     e.pacienteNome
//                       ?.toLowerCase()
//                       .includes(pesquisa.toLowerCase()),
//                   )
//                   .map((e) => (
//                     <tr
//                       key={e.id}
//                       className="hover:bg-primary-50/30 transition-colors group"
//                     >
//                       <td className="p-4 font-semibold text-slate-700">
//                         {e.pacienteNome}
//                       </td>
//                       <td className="p-4 text-slate-600">
//                         <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs uppercase font-medium">
//                           {e.tipo}
//                         </span>
//                       </td>
//                       <td className="p-4 text-slate-500">
//                         {formatarDataBR(e.data)}
//                       </td>
//                       <td className="p-4 text-center">
//                         <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold border border-primary-100">
//                           {e.arquivos?.length || 0} anexo(s)
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex justify-center gap-4">
//                           {e.arquivos?.length > 0 && (
//                             <button
//                               onClick={() => abrirVisualizacao(e)}
//                               className="text-emerald-500 hover:scale-120 transition-transform cursor-pointer"
//                               title="Ver Imagens"
//                             >
//                               <MdVisibility size={22} />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => {
//                               setForm(e);
//                               setEditId(e.id);
//                               setArquivosBase64(e.arquivos || []);
//                               setMostrarFormulario(true);
//                             }}
//                             className="text-blue-500 hover:scale-120 transition-transform cursor-pointer"
//                             title="Editar"
//                           >
//                             <MdEdit size={22} />
//                           </button>
//                           <button
//                             onClick={() => deletarExame(e.id, e.pacienteNome)}
//                             className="text-red-400 hover:scale-120 transition-transform cursor-pointer"
//                             title="Excluir"
//                           >
//                             <MdDelete size={22} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//           {exames.length === 0 && (
//             <div className="p-20 text-center">
//               <MdScience size={48} className="mx-auto text-slate-200 mb-2" />
//               <p className="text-slate-400">
//                 Nenhum exame encontrado no banco de dados.
//               </p>
//             </div>
//           )}
//         </section>

//         {/* Galeria de Fotos (Modal) */}
//         {modalArquivos && (
//           <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999] p-4">
//             <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
//               <div className="p-4 border-b flex justify-between items-center bg-white">
//                 <div className="flex flex-col">
//                   <h3 className="font-bold text-slate-800">
//                     Galeria de Exames
//                   </h3>
//                   <p className="text-xs text-slate-500">
//                     Imagem {indiceArquivoAtual + 1} de {modalArquivos.length}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setModalArquivos(null)}
//                   className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
//                 >
//                   <MdClose size={28} />
//                 </button>
//               </div>

//               <div className="flex-1 bg-slate-100 flex items-center justify-between relative overflow-hidden">
//                 <button
//                   disabled={indiceArquivoAtual === 0}
//                   onClick={() => setIndiceArquivoAtual((prev) => prev - 1)}
//                   className={`absolute left-4 z-10 p-3 rounded-full bg-white shadow-xl text-slate-800 hover:bg-blue-600 hover:text-white transition-all ${indiceArquivoAtual === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
//                 >
//                   <MdNavigateBefore size={32} />
//                 </button>

//                 <div className="w-full h-full flex items-center justify-center p-6">
//                   <img
//                     src={modalArquivos[indiceArquivoAtual]}
//                     alt="Exame"
//                     className="max-w-full max-h-full object-contain rounded-lg shadow-lg bg-white"
//                   />
//                 </div>

//                 <button
//                   disabled={indiceArquivoAtual === modalArquivos.length - 1}
//                   onClick={() => setIndiceArquivoAtual((prev) => prev + 1)}
//                   className={`absolute right-4 z-10 p-3 rounded-full bg-white shadow-xl text-slate-800 hover:bg-blue-600 hover:text-white transition-all ${indiceArquivoAtual === modalArquivos.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
//                 >
//                   <MdNavigateNext size={32} />
//                 </button>
//               </div>

//               <div className="p-4 flex justify-center gap-3 overflow-x-auto bg-white border-t">
//                 {modalArquivos.map((arq, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setIndiceArquivoAtual(idx)}
//                     className={`w-16 h-16 rounded-xl border-4 transition-all overflow-hidden flex-shrink-0 ${indiceArquivoAtual === idx ? "border-blue-500 scale-105 shadow-md" : "border-slate-100 opacity-60 hover:opacity-100"}`}
//                   >
//                     <img
//                       src={arq}
//                       className="w-full h-full object-cover"
//                       alt="Thumbnail"
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* Modais de Feedback */}
//       <ModalErro
//         open={modalStatus.open && modalStatus.tipo === "erro"}
//         onClose={() => setModalStatus({ ...modalStatus, open: false })}
//         titulo={modalStatus.titulo}
//         mensagem={modalStatus.mensagem}
//       />
//       <ModalAviso
//         open={modalStatus.open && modalStatus.tipo === "aviso"}
//         onClose={() => setModalStatus({ ...modalStatus, open: false })}
//         titulo={modalStatus.titulo}
//         mensagem={modalStatus.mensagem}
//       />
//     </PageWrapper>
//   );
// }


// import { useEffect, useState } from "react";
// import PageWrapper from "../components/PageWrapper";
// import BotaoCadastrar from "../components/BotaoCadastrar";
// import BarraPesquisa from "../components/BarraPesquisa";
// import ModalErro from "../modals/ModalErro";
// import ModalAviso from "../modals/ModalAviso";
// import FormularioExame from "../components/FormularioExame"; // Importe o novo componente
// import {
//   MdEdit,
//   MdDelete,
//   MdScience,
//   MdVisibility,
//   MdClose,
//   MdNavigateBefore,
//   MdNavigateNext,
// } from "react-icons/md";
// import api from "../services/api";
// import { useAuth } from "../hooks/useAuth";
// import { registrarLog } from "../services/auditService";

// export default function CadastroExames() {
//   const { usuario } = useAuth();
//   const [exames, setExames] = useState([]);
//   const [pacientes, setPacientes] = useState([]);
//   const [pesquisa, setPesquisa] = useState("");
//   const [mostrarFormulario, setMostrarFormulario] = useState(false);
//   const [exameParaEditar, setExameParaEditar] = useState(null);

//   const [modalArquivos, setModalArquivos] = useState(null);
//   const [indiceArquivoAtual, setIndiceArquivoAtual] = useState(0);

//   const [modalStatus, setModalStatus] = useState({
//     open: false,
//     tipo: "",
//     titulo: "",
//     mensagem: "",
//   });

//   const nomeOperador = usuario?.nome || "Operador";

//   const carregarDados = async () => {
//     try {
//       const [resExames, resPacientes] = await Promise.all([
//         api.get("/exames"),
//         api.get("/pacientes")
//       ]);
//       setExames(resExames || []);
//       setPacientes(resPacientes || []);
//     } catch (error) {
//       console.error("Erro ao carregar dados:", error);
//     }
//   };

//   useEffect(() => { carregarDados(); }, []);

//   const salvarExame = async (dados) => {
//     try {
//       const payload = { ...dados, analisado: false };
      
//       if (exameParaEditar) {
//         await api.put(`/exames/${exameParaEditar.id}`, payload);
//         await registrarLog(nomeOperador, `Editou exame de: ${dados.pacienteNome}`, "ALTERAÇÃO", `ID: ${exameParaEditar.id}`);
//       } else {
//         await api.post("/exames", payload);
//         await registrarLog(nomeOperador, `Cadastrou novo exame: ${dados.tipo}`, "CADASTRO", `Paciente: ${dados.pacienteNome}`);
//       }

//       await carregarDados();
//       setMostrarFormulario(false);
//       setExameParaEditar(null);
//       setModalStatus({
//         open: true,
//         tipo: "aviso",
//         titulo: "Operação Concluída",
//         mensagem: exameParaEditar ? "Alterações salvas!" : "Exame cadastrado!",
//       });
//     } catch (error) {
//       setModalStatus({ open: true, tipo: "erro", titulo: "Erro", mensagem: "Falha na comunicação." });
//     }
//   };

//   const deletarExame = async (id, nomePaciente) => {
//     if (window.confirm(`Deseja excluir o exame de ${nomePaciente}?`)) {
//       try {
//         await api.delete(`/exames/${id}`);
//         await registrarLog(nomeOperador, `Excluiu exame: ${nomePaciente}`, "EXCLUSÃO", `ID: ${id}`);
//         carregarDados();
//       } catch (error) {
//         setModalStatus({ open: true, tipo: "erro", titulo: "Erro", mensagem: "Não foi possível remover." });
//       }
//     }
//   };

//   return (
//     <PageWrapper title="Gestão de Exames">
//       <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
//           <BarraPesquisa pesquisa={pesquisa} setPesquisa={setPesquisa} placeholder="Filtrar por nome..." />
//           {!mostrarFormulario && (
//             <BotaoCadastrar label="Novo Exame" onClick={() => { setExameParaEditar(null); setMostrarFormulario(true); }} />
//           )}
//         </div>

//         {/* USO DO COMPONENTE EXTERNO */}
//         {mostrarFormulario && (
//           <FormularioExame 
//             pacientes={pacientes}
//             exameParaEditar={exameParaEditar}
//             onSalvar={salvarExame}
//             onCancelar={() => { setMostrarFormulario(false); setExameParaEditar(null); }}
//             setModalStatus={setModalStatus}
//           />
//         )}

//         {/* TABELA (Original) */}
//         <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50 border-b border-slate-200">
//               <tr>
//                 <th className="p-4 text-slate-600 font-bold">Paciente</th>
//                 <th className="p-4 text-slate-600 font-bold">Tipo</th>
//                 <th className="p-4 text-slate-600 font-bold">Data</th>
//                 <th className="p-4 text-center text-slate-600 font-bold">Ações</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {exames.filter(e => e.pacienteNome?.toLowerCase().includes(pesquisa.toLowerCase())).map((e) => (
//                 <tr key={e.id} className="hover:bg-primary-50/30 transition-colors group">
//                   <td className="p-4 font-semibold text-slate-700">{e.pacienteNome}</td>
//                   <td className="p-4 uppercase text-xs font-medium text-slate-600">{e.tipo}</td>
//                   <td className="p-4 text-slate-500">{e.data}</td>
//                   <td className="p-4">
//                     <div className="flex justify-center gap-4">
//                        <button onClick={() => { setExameParaEditar(e); setMostrarFormulario(true); }} className="text-blue-500 cursor-pointer"><MdEdit size={22}/></button>
//                        <button onClick={() => deletarExame(e.id, e.pacienteNome)} className="text-red-400 cursor-pointer"><MdDelete size={22}/></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       </div>

//       <ModalErro open={modalStatus.open && modalStatus.tipo === "erro"} onClose={() => setModalStatus({ ...modalStatus, open: false })} titulo={modalStatus.titulo} mensagem={modalStatus.mensagem} />
//       <ModalAviso open={modalStatus.open && modalStatus.tipo === "aviso"} onClose={() => setModalStatus({ ...modalStatus, open: false })} titulo={modalStatus.titulo} mensagem={modalStatus.mensagem} />
//     </PageWrapper>
//   );
// }



import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import BotaoCadastrar from "../components/BotaoCadastrar";
import BarraPesquisa from "../components/BarraPesquisa";
import ModalErro from "../modals/ModalErro";
import ModalAviso from "../modals/ModalAviso";
import ModalForm from "../modals/ModalForm"; // Novo componente de moldura
import FormularioExame from "../components/FormularioExame"; // Componente com os campos
import ModalGaleria from "../modals/ModalGaleria";
import {
  MdEdit,
  MdDelete,
  MdScience,
  MdVisibility,
  MdClose,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { registrarLog } from "../services/auditService";

export default function CadastroExames() {
  const { usuario } = useAuth();
  const [exames, setExames] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [exameParaEditar, setExameParaEditar] = useState(null);

  // Estados da Galeria (Originais)
  const [modalArquivos, setModalArquivos] = useState(null);
  const [indiceArquivoAtual, setIndiceArquivoAtual] = useState(0);

  // Controle de Modais de Feedback
  const [modalStatus, setModalStatus] = useState({
    open: false,
    tipo: "",
    titulo: "",
    mensagem: "",
  });

  const nomeOperador = usuario?.nome || "Operador";

  const carregarDados = async () => {
    try {
      const [resExames, resPacientes] = await Promise.all([
        api.get("/exames"),
        api.get("/pacientes")
      ]);
      setExames(resExames || []);
      setPacientes(resPacientes || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const salvarExame = async (dados) => {
    try {
      const payload = { ...dados, analisado: false };
      
      if (exameParaEditar) {
        await api.put(`/exames/${exameParaEditar.id}`, payload);
        await registrarLog(
          nomeOperador, 
          `Editou exame de: ${dados.pacienteNome}`, 
          "ALTERAÇÃO", 
          `ID: ${exameParaEditar.id} | Tipo: ${dados.tipo}`
        );
      } else {
        await api.post("/exames", payload);
        await registrarLog(
          nomeOperador, 
          `Cadastrou novo exame: ${dados.tipo}`, 
          "CADASTRO", 
          `Paciente: ${dados.pacienteNome}`
        );
      }

      await carregarDados();
      setMostrarFormulario(false);
      setExameParaEditar(null);
      setModalStatus({
        open: true,
        tipo: "aviso",
        titulo: "Operação Concluída",
        mensagem: exameParaEditar ? "As alterações foram salvas!" : "Novo exame cadastrado com sucesso!",
      });
    } catch (error) {
      setModalStatus({ 
        open: true, 
        tipo: "erro", 
        titulo: "Erro de Sistema", 
        mensagem: "Falha na comunicação com o servidor." 
      });
    }
  };

  const deletarExame = async (id, nomePaciente) => {
    if (window.confirm(`ATENÇÃO: Deseja excluir permanentemente o exame de ${nomePaciente}?`)) {
      try {
        await api.delete(`/exames/${id}`);
        await registrarLog(
          nomeOperador, 
          `Excluiu exame do paciente: ${nomePaciente}`, 
          "EXCLUSÃO", 
          `ID deletado: ${id}`
        );
        carregarDados();
      } catch (error) {
        setModalStatus({ 
          open: true, 
          tipo: "erro", 
          titulo: "Erro ao Excluir", 
          mensagem: "Não foi possível remover o registro." 
        });
      }
    }
  };

  const abrirVisualizacao = async (exame) => {
    setModalArquivos(exame.arquivos);
    setIndiceArquivoAtual(0);
    await registrarLog(
      nomeOperador,
      `Acessou galeria de imagens: ${exame.pacienteNome}`,
      "VISUALIZAÇÃO"
    );
  };

  const formatarDataBR = (dataString) => {
    if (!dataString) return "---";
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <PageWrapper title="Gestão de Exames">
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Barra Superior */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <BarraPesquisa 
            pesquisa={pesquisa} 
            setPesquisa={setPesquisa} 
            placeholder="Filtrar por nome do paciente..." 
          />
          <BotaoCadastrar 
            label="Novo Exame" 
            onClick={() => { setExameParaEditar(null); setMostrarFormulario(true); }} 
          />
        </div>

        {/* MODAL DO FORMULÁRIO (Componente Reutilizável) */}
        <ModalForm
          isOpen={mostrarFormulario}
          onClose={() => { setMostrarFormulario(false); setExameParaEditar(null); }}
          title={exameParaEditar ? "Editar Registro de Exame" : "Novo Cadastro de Exame"}
          icon={MdScience}
        >
          <FormularioExame 
            pacientes={pacientes}
            exameParaEditar={exameParaEditar}
            onSalvar={salvarExame}
            onCancelar={() => { setMostrarFormulario(false); setExameParaEditar(null); }}
            setModalStatus={setModalStatus}
          />
        </ModalForm>

        {/* TABELA DE LISTAGEM (Estilização Original Mantida) */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-slate-600 font-bold">Paciente</th>
                  <th className="p-4 text-slate-600 font-bold">Tipo de Exame</th>
                  <th className="p-4 text-slate-600 font-bold">Data</th>
                  <th className="p-4 text-center text-slate-600 font-bold">Imagens</th>
                  <th className="p-4 text-center text-slate-600 font-bold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exames
                  .filter(e => e.pacienteNome?.toLowerCase().includes(pesquisa.toLowerCase()))
                  .map((e) => (
                    <tr key={e.id} className="hover:bg-primary-50/30 transition-colors group">
                      <td className="p-4 font-semibold text-slate-700">{e.pacienteNome}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs uppercase font-medium">
                          {e.tipo}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatarDataBR(e.data)}</td>
                      <td className="p-4 text-center">
                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-bold border border-primary-100">
                          {e.arquivos?.length || 0} anexo(s)
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-4">
                           {e.arquivos?.length > 0 && (
                             <button onClick={() => abrirVisualizacao(e)} className="text-emerald-500 hover:scale-120 transition-transform cursor-pointer" title="Ver Imagens">
                               <MdVisibility size={22} />
                             </button>
                           )}
                           <button onClick={() => { setExameParaEditar(e); setMostrarFormulario(true); }} className="text-blue-500 hover:scale-120 transition-transform cursor-pointer" title="Editar">
                             <MdEdit size={22}/>
                           </button>
                           <button onClick={() => deletarExame(e.id, e.pacienteNome)} className="text-red-400 hover:scale-120 transition-transform cursor-pointer" title="Excluir">
                             <MdDelete size={22}/>
                           </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          {exames.length === 0 && (
            <div className="p-20 text-center">
              <MdScience size={48} className="mx-auto text-slate-200 mb-2" />
              <p className="text-slate-400">Nenhum exame encontrado.</p>
            </div>
          )}
        </section>
      </div>

      <ModalGaleria 
  isOpen={!!modalArquivos} 
  imagens={modalArquivos} 
  indiceAtual={indiceArquivoAtual} 
  setIndice={setIndiceArquivoAtual} 
  onClose={() => setModalArquivos(null)} 
/>

      {/* Modais de Feedback */}
      <ModalErro open={modalStatus.open && modalStatus.tipo === "erro"} onClose={() => setModalStatus({ ...modalStatus, open: false })} titulo={modalStatus.titulo} mensagem={modalStatus.mensagem} />
      <ModalAviso open={modalStatus.open && modalStatus.tipo === "aviso"} onClose={() => setModalStatus({ ...modalStatus, open: false })} titulo={modalStatus.titulo} mensagem={modalStatus.mensagem} />
    </PageWrapper>
  );
}