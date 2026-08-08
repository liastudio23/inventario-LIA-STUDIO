import "./Equipos.css";
import { FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { QRCodeCanvas } from "qrcode.react";

export default function Equipos() {
  const [showModal, setShowModal] = useState(false);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("DISPONIBLE");
  const [fechaCompra, setFechaCompra] = useState("");
  const [costoCompra, setCostoCompra] = useState("");
  const [vidaUtilAnios, setVidaUtilAnios] = useState("");
  const [horasVidaUtil, setHorasVidaUtil] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [equipoDetalle, setEquipoDetalle] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [equipoQr, setEquipoQr] = useState(null);

  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre");

    if (!error) {
      setCategorias(data);
      if (data.length > 0) {
        setTipo(data[0].prefijo);
      }
    }
  };

  const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from("equipos")
      .select("*")
      .order("codigo");

    if (!error) {
      setEquipos(data);
    }
  };

  useEffect(() => {
    cargarEquipos();
    cargarCategorias();
  }, []);

  const guardarEquipo = async (e) => {
    e.preventDefault();

    if (modoEdicion) {
      // Usa la clave primaria correcta: id o codigo
      const { data, error } = await supabase
        .from("equipos")
        .update({ marca, modelo, tipo, estado })
        .eq("id", equipoEditando.id) // 👈 cambia a "codigo" si tu tabla no tiene id
        .select();

      if (error) {
        alert(error.message);
        return;
      }

      if (data.length === 0) {
        alert("No se encontró el equipo para actualizar");
        return;
      }

      alert("Equipo actualizado correctamente");
    } else {

      const valorResidual = Number(costoCompra) * 0.10;

      const depreciacionAnual =
        (Number(costoCompra) - valorResidual) /
        Number(vidaUtilAnios);

      const depreciacionMensual =
        depreciacionAnual / 12;

      const costoHora =
        (Number(costoCompra) - valorResidual) /
        Number(horasVidaUtil);
        console.log("Costo Hora:", costoHora);

      const { data: ultimoEquipo } = await supabase
        .from("equipos")
        .select("codigo")
        .eq("tipo", tipo)
        .order("codigo", { ascending: false })
        .limit(1);

      let nuevoCodigo = `${tipo}-0001`;

      if (ultimoEquipo && ultimoEquipo.length > 0) {
        const ultimoNumero = parseInt(ultimoEquipo[0].codigo.split("-")[1]);
        nuevoCodigo = `${tipo}-${String(ultimoNumero + 1).padStart(4, "0")}`;
      }
console.log({
  costoHora,
  costo_hora: String(costoHora),
});
console.log({
  costoHora,
  tipoCostoHora: typeof costoHora,
  costoCompra,
  valorResidual,
  horasVidaUtil,
});
      const { error } = await supabase
        .from("equipos")

        .insert([
          {
            codigo: nuevoCodigo,
            tipo,
            marca,
            modelo,
            fecha_compra: fechaCompra,
            costo_compra: costoCompra,
            valor_residual: valorResidual,
            vida_util_anios: vidaUtilAnios,
            horas_vida_util: horasVidaUtil,
            costo_hora: costoHora,
            depreciacion_anual: depreciacionAnual,
            depreciacion_mensual: depreciacionMensual,
            estado
          }
        ]);

      if (error) {
        alert("Error: " + error.message);
        return;
      }

      alert("Equipo guardado correctamente");
    }

    cargarEquipos();
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setMarca("");
    setModelo("");
    setEstado("DISPONIBLE");
    setModoEdicion(false);
    setEquipoEditando(null);
    setShowModal(false);
  };

  const editarEquipo = (equipo) => {
    setEquipoEditando(equipo);
    setMarca(equipo.marca);
    setModelo(equipo.modelo);
    setTipo(equipo.tipo);
    setEstado(equipo.estado);
    setModoEdicion(true);
    setShowModal(true);
  };

  const verEquipo = (equipo) => {
    setEquipoDetalle(equipo);
    setShowDetalle(true);
  };
  const generarQr = (equipo) => {
    setEquipoQr(equipo);
    setShowQr(true);
  };

  const eliminarEquipo = async (id) => {
    const confirmar = window.confirm("¿Desea eliminar este equipo?");
    if (!confirmar) return;

    const { error } = await supabase.from("equipos").delete().eq("id", id); // 👈 igual, usa "codigo" si no tienes id

    if (error) {
      alert(error.message);
      return;
    }

    cargarEquipos();
  };

  return (
    <div className="page-container">
      <h1>Gestión de Equipos</h1>
      <button className="btn-nuevo" onClick={() => setShowModal(true)}>
        <FaPlus /> Nuevo Equipo
      </button>

      <table className="tabla-equipos">
        <thead>
          <tr>
            <th>Código</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.id || equipo.codigo}>
              <td>{equipo.codigo}</td>
              <td>{equipo.marca}</td>
              <td>{equipo.modelo}</td>
              <td>
                <span className={`estado ${equipo.estado?.toLowerCase()}`}>
                  {equipo.estado || "DISPONIBLE"}
                </span>
              </td>
              <td>
                <button
                  className="btn-ver"
                  onClick={() => verEquipo(equipo)}
                >
                  Ver
                </button>

                <button
                  className="btn-editar"
                  onClick={() => editarEquipo(equipo)}
                >
                  Editar
                </button>

                <button
                  className="btn-eliminar"
                  onClick={() => eliminarEquipo(equipo.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modoEdicion ? "Editar Equipo" : "Nuevo Equipo"}</h2>


            <form onSubmit={guardarEquipo}>
              <label>Marca</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />

              <label>Modelo</label>
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />

              <label>Tipo de Equipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.prefijo}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <label>Fecha de Compra</label>
              <input
                type="date"
                value={fechaCompra}
                onChange={(e) => setFechaCompra(e.target.value)}
              />

              <label>Costo de Compra</label>
              <input
                type="number"
                value={costoCompra}
                onChange={(e) => setCostoCompra(e.target.value)}
              />

              <label>Vida Útil (Años)</label>
              <input
                type="number"
                value={vidaUtilAnios}
                onChange={(e) => setVidaUtilAnios(e.target.value)}
              />

              <label>Horas de Vida Útil</label>
              <input
                type="number"
                value={horasVidaUtil}
                onChange={(e) => setHorasVidaUtil(e.target.value)}
              />

              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option>DISPONIBLE</option>
                <option>PRESTADO</option>
                <option>MANTENIMIENTO</option>
              </select>
              <button

                className="btn-ver"
                onClick={() => verEquipo(equipo)}
              >
                Ver
              </button>
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



      {showDetalle && equipoDetalle && (
        <div className="modal">
          <div className="modal-content">

            <h2>Ficha del Equipo</h2>

            <p><strong>Código:</strong> {equipoDetalle.codigo}</p>
            <p><strong>Marca:</strong> {equipoDetalle.marca}</p>
            <p><strong>Modelo:</strong> {equipoDetalle.modelo}</p>
            <p><strong>Tipo:</strong> {equipoDetalle.tipo}</p>
            <p><strong>Estado:</strong> {equipoDetalle.estado}</p>

            <hr />

            <h3>Información Financiera</h3>

            <p>
              <strong>Fecha Compra:</strong>{" "}
              {equipoDetalle.fecha_compra}
            </p>

            <p>
              <strong>Costo Compra:</strong> S/
              {equipoDetalle.costo_compra}
            </p>

            <p>
              <strong>Valor Residual:</strong> S/
              {equipoDetalle.valor_residual}
            </p>

            <p>
              <strong>Vida Útil:</strong>{" "}
              {equipoDetalle.vida_util_anios} años
            </p>

            <p>
              <strong>Horas Vida Útil:</strong>{" "}
              {equipoDetalle.horas_vida_util}
            </p>

            <hr />

            <h3>Depreciación</h3>

            <p>
              <strong>Depreciación Anual:</strong> S/
              {equipoDetalle.depreciacion_anual}
            </p>

            <p>
              <strong>Depreciación Mensual:</strong> S/
              {equipoDetalle.depreciacion_mensual}
            </p>

            <p>
              <strong>Costo por Hora:</strong> S/
              {Number(equipoDetalle.costo_hora || 0).toFixed(4)}
            </p>


            <div className="modal-actions">

              <button
                className="btn-ver"
                onClick={() => generarQr(equipoDetalle)}
              >
                Generar QR
              </button>

              <div id="etiqueta-print">

                <h3>{equipoDetalle.codigo}</h3>

                <p>
                  {equipoDetalle.marca} {equipoDetalle.modelo}
                </p>

              </div>

              {/* 
<QRCodeCanvas
  value={equipoQr.codigo}
  size={80}
/>
*/}
            </div>

            <button
              style={{
                background: "red",
                color: "white",
                padding: "10px",
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => setShowDetalle(false)}
            >
              Cerrar
            </button>

          </div>

        </div>
      )}
      {showQr && equipoQr && (
        <div className="modal">
          <div className="modal-content">

            <h2>QR del Equipo</h2>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px 0"
              }}
            >
              <div
                style={{
                  background: "white",
                  color: "black",
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "10px"
                }}
              >
                <h3>{equipoQr.codigo}</h3>
                <p>{equipoQr.marca}</p>
                <p>{equipoQr.modelo}</p>
              </div>
            </div>

            <p style={{ textAlign: "center" }}>
              {equipoQr.codigo}
            </p>

            <div className="modal-actions">


              <button
                className="btn-editar"
                onClick={() => window.print()}
              >
                Imprimir
              </button>

              <button
                className="btn-cancelar"
                onClick={() => setShowQr(false)}
              >
                Cerrar
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
