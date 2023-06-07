import "./CartWidget.css"

const CartWidget = () => {
    const carrito = "https://e7.pngegg.com/pngimages/833/426/png-clipart-shopping-cart-shopping-cart.png";
  return (
    <div>
        <img className="carrito" src={carrito} alt="Imagen de un carrito de compras"/>
        <strong> 15 </strong>
    </div>
  )
}

export default CartWidget