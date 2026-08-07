import "./Responsables.css";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Responsables() {
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [responsables, setResponsables] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [responsableEditando, setResponsableEditando] = useState(null);

 const cargarResponsables = async () => {
  const { data, error } = await supabase
    .from("responsables")
    .select("*")
    .order("nombre");

  if (!error) {
    setResponsables(data);
  }
};


  useEffect(() => {
    cargarResponsables();
  }, []);

  const guardarResponsable = async (e) => {
    e.preventDefault();

    if (modoEdicion) {
      const { data, error } = await supabase
        .from("responsables")
        .update({
  nombre,
  telefono
})
        .eq("id", responsableEditando.id) // 👈 usa la PK correcta
        .select();

      if (error) {
        alert(error.message);
        return;
      }

      if (data.length === 0) {
        alert("No se encontró el responsable para actualizar");
        return;
      }

      alert("Responsable actualizado correctamente");
    } else {
      const { error } = await supabase
        .from("responsables")
        .insert([
  {
    nombre,
    telefono
  }
]);

      if (error) {
        alert("Error: " + error.message);
        return;
      }

      alert("Responsable guardado correctamente");
    }

    cargarResponsables();
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setTelefono("");
    setModoEdicion(false);
    setResponsableEditando(null);
    setShowModal(false);
  };

  const editarResponsable = (responsable) => {
    setResponsableEditando(responsable);
    setNombre(responsable.nombre);
    setTelefono(responsable.telefono);
    setModoEdicion(true);
    setShowModal(true);
  };

  const eliminarResponsable = async (id) => {
    const confirmar = window.confirm("¿Desea eliminar este responsable?");
    if (!confirmar) return;

    const { error } = await supabase.from("responsables").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    cargarResponsables();
  };

  return (
    <div className="page-container">
      <h1>Gestión de Responsables</h1>
      <button className="btn-nuevo" onClick={() => setShowModal(true)}>
        <FaPlus /> Nuevo Responsable
      </button>

      <table className="tabla-responsables">
        <thead>
          <tr>
            <th>Nombre</th>
          
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {responsables.map((responsable) => (
            <tr key={responsable.id}>
              <td>{responsable.nombre}</td>
             
              <td>{responsable.telefono}</td>
              <td>
                <button className="btn-editar" onClick={() => editarResponsable(responsable)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminarResponsable(responsable.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modoEdicion ? "Editar Responsable" : "Nuevo Responsable"}</h2>
            <form onSubmit={guardarResponsable}>
              <label>Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />

        
              <label>Teléfono</label>
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

              <div className="modal-actions">
                <button type="submit" className="btn-guardar">
                  {modoEdicion ? "Actualizar" : "Guardar"}
                </button>
                <button type="button" className="btn-cancelar" onClick={limpiarFormulario}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
