// import React from "react";
// import { MdClose } from "react-icons/md";

// export default function ModalForm({ isOpen, onClose, title, icon: Icon, children }) {
//   if (!isOpen) return null;

//   // Fecha o modal ao clicar no fundo escuro
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) onClose();
//   };

//   return (
//     <div 
//       onClick={handleBackdropClick}
//       className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
//     >
//       <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 relative">
        
//         {/* Botão de Fechar */}
//         <button 
//           onClick={onClose}
//           className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors cursor-pointer z-20"
//         >
//           <MdClose size={28} />
//         </button>

//         <div className="p-8">
          
//           <div className="flex items-center gap-3 mb-8 text-primary-600">
//             {Icon && (
//               <div className="p-2 bg-primary-50 rounded-xl">
//                 <Icon size={28} />
//               </div>
//             )}
//             <div>
//               <h2 className="font-bold text-2xl text-slate-800 leading-tight">
//                 {title}
//               </h2>
//               <p className="text-sm text-slate-500">Preencha os campos abaixo para prosseguir.</p>
//             </div>
//           </div>

//           {/* Conteúdo (Formulário) */}
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { MdClose } from "react-icons/md";

export default function ModalForm({ isOpen, onClose, title, icon: Icon, children }) {
  if (!isOpen) return null;

  return (
    /* h-screen e w-screen garantem que ocupe a janela toda, independente do conteúdo pai */
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center">
      
      {/* Overlay: Forçamos o inset-0 e usamos h-full w-full */}
      <div 
        className="absolute inset-0 w-full h-full bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
        style={{ height: '100vh', width: '100vw' }} // Reforço via Style se o Tailwind falhar
      />

      {/* Conteúdo do Modal */}
      <div className="relative z-[10000] w-full max-w-4xl mx-4 bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 text-primary-600">
            {Icon && <Icon size={24} />}
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Área interna com Scroll - h-full garante que ocupe o espaço disponível */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}