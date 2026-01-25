import React from "react";
import { MdAdd } from "react-icons/md";

const BotaoCadastrar = ({ onClick, label = " Cadastrar" }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 
                 w-40 md:w-48 flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
    >
      <MdAdd size={32} />
      {label}
    </button>
  );
};

export default BotaoCadastrar;
