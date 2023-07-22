import { useState, useContext } from "react"
import { CarritoContext } from '../../context/context'
import { db } from "../../services/config"
import { collection, addDoc } from "firebase/firestore"
import './Checkout.css'


const Checkout = () => {
  const { carrito, vaciarCarrito, cantidadTotal } = useContext(CarritoContext);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmacion, setEmailConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [ordenId, setOrdenId] = useState("");


  // funciones y manejadores
  const manejadorFormulario = (e) => {
    e.preventDefault();

    // CONTROLAR LOS CAMPOS
    if (!nombre || !apellido || !telefono || !email || !emailConfirmacion) {
      setError("Debe completar todos los campos");
      return;
    }

    if (email !== emailConfirmacion) {
      setError("Los campos de email son incorrectos");
      return;
    }

    // aqui se efectua la orden de compra
    const orden = {
      items: carrito.map(producto => ({
        id: producto.item.id,
        nombre: producto.item.nombre,
        cantidad: producto.cantidad
      })),
      total: cantidadTotal,
      nombre,
      apellido,
      telefono,
      email,
      fecha: new Date()
    };

    addDoc(collection(db, "ordenes"), orden)
      .then(docRef => {
        setOrdenId(docRef.id);
        vaciarCarrito();
      })
      .catch(error => {
        console.log("Se produjo un error", error);
        setError("Se produjo un error al generar la orden de compra");
      })
  }


  return (
    <section className="checkoutSection">
      <h2 >Cheackout de la compra</h2>
      <form onSubmit={manejadorFormulario} className="boxForm">
        {carrito.map(producto => (
          <div key={producto.id} className="mostrarProducto">
            <p>
              {producto.item.nombre} x {producto.cantidad}
            </p>
            <p> Precio $ {producto.item.precio} </p>
          </div>
        ))}
        <div className="boxFormularioCompra">
          <div>
            <h3>Ingrese sus datos</h3>
          </div>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div>
            <label htmlFor="apellido">Apellido</label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>
          <div>
            <label htmlFor="telefono">Telefono</label>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="">Email confirmacion</label>
            <input type="email" value={emailConfirmacion} onChange={(e) => setEmailConfirmacion(e.target.value)} />
          </div>

          {
            error && <p style={{ color: "red" }} > {error} </p>
          }

          <button type="submit" className="btnFinalizarCompra" >Finalizar esta compra</button>
        </div>
      </form>

      <div className="compraExitosa">
        {
          ordenId && (
            <strong>Gracias por su compre. Su numero de orden es: {ordenId} </strong>
          )
        }
      </div>
    </section>
  )
}

export default Checkout