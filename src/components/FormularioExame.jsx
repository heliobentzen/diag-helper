// import React from "react";
// import { MdSave, MdScience, MdClose } from "react-icons/md";
// import { TIPOS_EXAMES } from "./ListaExames"; 

// export default function FormularioExame({
//   form,
//   setForm,
//   pacientes,
//   onSubmit,
//   onCancel,
//   handleFileChange,
//   carregandoArquivos,
//   isEdit = false,
// }) {
//   return (
//     <section className="bg-white p-8 relative">
//       {/* Botão de Fechar no topo */}
//       <button 
//         onClick={onCancel}
//         className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
//         title="Fechar"
//       >
//         <MdClose size={28} />
//       </button>

//       <div className="flex items-center gap-3 mb-8 text-blue-600">
//         <div className="p-2 bg-blue-50 rounded-xl">
//           <MdScience size={28} />
//         </div>
//         <div>
//           <h2 className="font-bold text-2xl text-slate-800 leading-tight">
//             {isEdit ? "Editar Exame" : "Novo Cadastro"}
//           </h2>
//           <p className="text-sm text-slate-500">Preencha os dados técnicos da amostra.</p>
//         </div>
//       </div>

//       <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Field label="Paciente">
//           <select
//             required
//             value={form.pacienteId}
//             onChange={(e) => {
//               const p = pacientes.find((x) => String(x.id) === String(e.target.value));
//               if (p) setForm({ ...form, pacienteId: p.id, pacienteNome: p.nome });
//             }}
//             className="border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
//           >
//             <option value="">Selecione o paciente</option>
//             {pacientes.map((p) => (
//               <option key={p.id} value={p.id}>{p.nome}</option>
//             ))}
//           </select>
//         </Field>

//         <Field label="Tipo de Análise">
//           <select
//             value={form.tipo}
//             onChange={(e) => setForm({ ...form, tipo: e.target.value })}
//             required
//             className="border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
//           >
//             <option value="">Selecione o tipo</option>
//             {TIPOS_EXAMES.map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>
//         </Field>

//         <Field label="Data da Coleta">
//           <input
//             type="date"
//             value={form.data}
//             onChange={(e) => setForm({ ...form, data: e.target.value })}
//             className="border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all text-sm"
//             required
//           />
//         </Field>

//         <Field label="Resultado Preliminar">
//           <input
//             placeholder="Ex: Normal, Alterado..."
//             value={form.resultado}
//             onChange={(e) => setForm({ ...form, resultado: e.target.value })}
//             className="border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 transition-all text-sm"
//           />
//         </Field>

//         <Field label="Upload de Imagens">
//           <div className="relative">
//             <input
//               type="file"
//               multiple
//               accept="image/jpeg,image/png,image/jpg"
//               onChange={handleFileChange}
//               className={`w-full border-slate-200 border-dashed border-2 p-2 rounded-xl text-xs transition-all ${carregandoArquivos ? "opacity-50 cursor-wait" : "bg-slate-50"}`}
//               disabled={carregandoArquivos}
//             />
//             {carregandoArquivos && (
//               <span className="absolute right-3 top-3 text-[10px] text-blue-600 font-bold animate-pulse">PROCESSANDO...</span>
//             )}
//           </div>
//         </Field>

//         <div className="col-span-full flex flex-col gap-1.5">
//           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Observações</label>
//           <textarea
//             placeholder="Notas adicionais..."
//             value={form.observacoes}
//             onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
//             className="border-slate-200 p-4 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 resize-none transition-all text-sm"
//           />
//         </div>

//         <div className="flex gap-4 col-span-full pt-4 border-t border-slate-100 mt-2">
//           <button
//             type="submit"
//             disabled={carregandoArquivos}
//             className="flex-1 md:flex-none bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:bg-slate-400 active:scale-95 shadow-lg shadow-slate-200"
//           >
//             <MdSave size={20} />
//             {carregandoArquivos ? "Salvando..." : isEdit ? "Atualizar Registro" : "Confirmar Cadastro"}
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
//       {children}
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { MdSave } from "react-icons/md";
import { TIPOS_EXAMES } from "../components/ListaExames";

export default function FormularioExame({ 
  pacientes, 
  exameParaEditar, 
  onSalvar, 
  onCancelar, 
  setModalStatus 
}) {
  const [carregandoArquivos, setCarregandoArquivos] = useState(false);
  const [arquivosBase64, setArquivosBase64] = useState([]);
  
  const [form, setForm] = useState({
    pacienteId: "",
    pacienteNome: "",
    tipo: "",
    data: "",
    resultado: "",
    arquivos: [],
    observacoes: "",
  });

  useEffect(() => {
    if (exameParaEditar) {
      setForm(exameParaEditar);
      setArquivosBase64(exameParaEditar.arquivos || []);
    }
  }, [exameParaEditar]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    const arquivosInvalidos = files.filter(file => !tiposPermitidos.includes(file.type));

    if (arquivosInvalidos.length > 0) {
      setModalStatus({
        open: true,
        tipo: "erro",
        titulo: "Arquivo Não Suportado",
        mensagem: "Apenas imagens (JPEG, PNG) são permitidas.",
      });
      return;
    }

    setCarregandoArquivos(true);
    try {
      const processados = await Promise.all(
        files.map(file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }))
      );
      setArquivosBase64(processados);
    } catch (err) {
      setModalStatus({ open: true, tipo: "erro", titulo: "Erro", mensagem: "Falha ao converter imagens." });
    } finally {
      setCarregandoArquivos(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      ...form,
      arquivos: arquivosBase64.length > 0 ? arquivosBase64 : form.arquivos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 p-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Paciente</label>
        <select
          required
          value={form.pacienteId}
          onChange={(e) => {
            const p = pacientes.find(x => String(x.id) === String(e.target.value));
            if (p) setForm({ ...form, pacienteId: p.id, pacienteNome: p.nome });
          }}
          className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        >
          <option value="">Selecione o paciente</option>
          {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Tipo de Análise</label>
        <select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          required
          className="border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        >
          <option value="">Selecione o tipo</option>
          {TIPOS_EXAMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Data da Coleta</label>
        <input
          type="date"
          required
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Resultado Preliminar</label>
        <input
          placeholder="Ex: Normal, Alterado..."
          value={form.resultado}
          onChange={(e) => setForm({ ...form, resultado: e.target.value })}
          className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Imagens da Amostra</label>
        <div className="relative">
          <input
            type="file" multiple accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2.5 rounded-xl text-xs bg-slate-50"
            disabled={carregandoArquivos}
          />
        </div>
      </div>

      <div className="col-span-full flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Observações Médicas</label>
        <textarea
          placeholder="Notas adicionais..."
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          className="border p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 resize-none transition-all text-sm"
        />
      </div>

      <div className="flex gap-3 col-span-full pt-4 border-t border-slate-100 mt-2">
        <button
          type="submit"
          disabled={carregandoArquivos}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-md cursor-pointer"
        >
          <MdSave size={20} />
          {carregandoArquivos ? "Processando..." : "Salvar Registro"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}