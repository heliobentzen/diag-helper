// import React from "react";
// import { MdClose, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

// export default function ModalGaleria({ isOpen, imagens, indiceAtual, setIndice, onClose }) {
//   if (!isOpen || !imagens || imagens.length === 0) return null;

//   const anterior = () => indiceAtual > 0 && setIndice(indiceAtual - 1);
//   const proximo = () => indiceAtual < imagens.length - 1 && setIndice(indiceAtual + 1);

//   return (
//     <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
      
//       {/* Header Slim */}
//       <div className="flex justify-between items-center p-6 text-white">
//         <div>
//           <h3 className="text-lg font-medium">Visualização do Exame</h3>
//           <p className="text-sm text-slate-400">Amotra {indiceAtual + 1} de {imagens.length}</p>
//         </div>
//         <button 
//           onClick={onClose}
//           className="p-3 hover:bg-white/10 rounded-full transition-all cursor-pointer"
//         >
//           <MdClose size={32} />
//         </button>
//       </div>

//       {/* Área da Imagem Central */}
//       <div className="flex-1 relative flex items-center justify-center p-4">
//         <button
//           onClick={anterior}
//           disabled={indiceAtual === 0}
//           className={`absolute left-8 z-10 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-0 cursor-pointer`}
//         >
//           <MdNavigateBefore size={40} />
//         </button>

//         <div className="max-w-5xl max-h-full flex items-center justify-center overflow-hidden">
//           <img 
//             src={imagens[indiceAtual]} 
//             alt="Análise" 
//             className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500"
//           />
//         </div>

//         <button
//           onClick={proximo}
//           disabled={indiceAtual === imagens.length - 1}
//           className={`absolute right-8 z-10 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-0 cursor-pointer`}
//         >
//           <MdNavigateNext size={40} />
//         </button>
//       </div>

//       {/* Rodapé com Miniaturas */}
//       <div className="p-8 flex justify-center gap-3 bg-black/20">
//         {imagens.map((img, idx) => (
//           <button
//             key={idx}
//             onClick={() => setIndice(idx)}
//             className={`w-20 h-20 rounded-xl border-2 transition-all overflow-hidden flex-shrink-0 ${
//               indiceAtual === idx 
//                 ? "border-primary-500 scale-110 shadow-lg shadow-primary-500/20" 
//                 : "border-transparent opacity-40 hover:opacity-100"
//             }`}
//           >
//             <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";
import { MdClose, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

export default function ModalGaleria({ isOpen, imagens, indiceAtual, setIndice, onClose }) {
  if (!isOpen || !imagens || imagens.length === 0) return null;

  const anterior = () => indiceAtual > 0 && setIndice(indiceAtual - 1);
  const proximo = () => indiceAtual < imagens.length - 1 && setIndice(indiceAtual + 1);

  // Fecha o modal ao clicar na área escura (backdrop)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[1000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      {/* Container Centralizado - Reduzido com max-w-4xl */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Slim Interno */}
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <div>
            <h3 className="text-slate-800 font-bold text-lg">Galeria de Amostras</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Item {indiceAtual + 1} de {imagens.length}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all cursor-pointer"
          >
            <MdClose size={26} />
          </button>
        </div>

        {/* Área da Imagem - Altura Fixa/Controlada */}
        <div className="relative flex-1 bg-slate-50 flex items-center justify-center min-h-[350px] md:min-h-[450px]">
          <button
            onClick={anterior}
            disabled={indiceAtual === 0}
            className={`absolute left-4 z-10 p-3 rounded-full bg-white shadow-lg text-slate-700 hover:bg-primary-600 hover:text-white transition-all disabled:opacity-0 cursor-pointer`}
          >
            <MdNavigateBefore size={32} />
          </button>

          <div className="w-full h-full p-6 flex items-center justify-center">
            <img 
              src={imagens[indiceAtual]} 
              alt="Análise" 
              className="max-w-full max-h-[350px] object-contain rounded-lg shadow-sm"
            />
          </div>

          <button
            onClick={proximo}
            disabled={indiceAtual === imagens.length - 1}
            className={`absolute right-4 z-10 p-3 rounded-full bg-white shadow-lg text-slate-700 hover:bg-primary-600 hover:text-white transition-all disabled:opacity-0 cursor-pointer`}
          >
            <MdNavigateNext size={32} />
          </button>
        </div>

        {/* Miniaturas Inferiores - Mais discretas */}
        <div className="p-5 flex justify-center gap-3 bg-white border-t border-slate-50 overflow-x-auto no-scrollbar">
          {imagens.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setIndice(idx)}
              className={`w-16 h-16 rounded-2xl border-2 transition-all overflow-hidden flex-shrink-0 ${
                indiceAtual === idx 
                  ? "border-primary-500 scale-105 shadow-md" 
                  : "border-transparent opacity-40 hover:opacity-100"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}