import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import dummyAddress from "../data/dummyAddress";
import assets from "../assets/assets";
import toast from "react-hot-toast";


const Cart= () => {
    const {products, currency, cartItems, setCartItems, deleteFromCart, getCartAmount, updateCartItem, navigate, getCartCount, axios, user} = useAppContext();
    const cartArray = useMemo(() =>
        Object.keys(cartItems).map(key => {
            const product = products.find(p => p._id === key);
            return product ? { ...product, quantity: cartItems[key] } : null;
        }).filter(Boolean),
        [cartItems, products]
    );

    const subtotal = useMemo(() =>
        cartArray.reduce((sum, p) => sum + p.offerPrice * p.quantity, 0),
        [cartArray]
    );
    const tax = useMemo(() => Math.floor(subtotal * 0.02 * 100) / 100, [subtotal]);
    const total = useMemo(() => Math.floor((subtotal + tax) * 100) / 100, [subtotal, tax]);
    const [addresses, setAddresses] = useState(dummyAddress)
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentoption, setSelectedPaymentOption] = useState('COD')

const fetchAddresses = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success && data.addresses.length > 0) {
                setAddresses(data.addresses);
                setSelectedAddress(data.addresses[0]);
            } else {
                setSelectedAddress(dummyAddress[0]);
            }
        } catch {
            setSelectedAddress(dummyAddress[0]);
        }
    };

    const placeOrder = async () => {
        try {
            if (!selectedAddress) return toast.error('Veuillez sélectionner une adresse');
            if (cartArray.length === 0) return toast.error('Votre panier est vide');

            const items = cartArray.map(p => ({ product: p._id, quantity: p.quantity }));

            if (paymentoption === 'COD') {
                const { data } = await axios.post('/api/order/cod', {
                    items,
                    address: selectedAddress._id
                });
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post('/api/order/stripe', {
                    items,
                    address: selectedAddress._id
                });
                if (data.success) {
                    window.location.href = data.url;
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

     useEffect(() => {
        if (user) fetchAddresses();
     }, [user])


    return products.length > 0 ? (
        <div className="flex flex-col md:flex-row mt-16 ">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">detail du produit</p>
                    <p className="text-center">Total</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product) => (
                    <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=>{
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Size: <span>{product.size || "N/A"}</span></p>
                                    <div className='flex items-center gap-2'>
                                        <p>Qty:</p>
                                        <select onChange={(e) => updateCartItem(product._id, Number(e.target.value))} value={product.quantity} className='outline-none border border-gray-300 rounded px-1'>
                                            {Array(Math.max(product.quantity, 9)).fill('').map((_, i) => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button onClick={()=>deleteFromCart(product._id)} className="cursor-pointer mx-auto text-gray-400 hover:text-red-500 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5a1 1 0 000 2h14a1 1 0 000-2h-4z" />
                            </svg>
                        </button>
                    </div>)
                )}

                <button onClick={()=>{navigate('/products'); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                    ajouter des articles
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium"> Fiche de commande  </h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Addresse de livraison</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "pas d'address retrouvée"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            modifie
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                              { addresses.map((address, index)=>(<p onClick={() => { setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                   {address.street}, {address.city}, {address.state}, {address.country}
                                   </p>) 
                                )}
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    ajouter votre addresse
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e => setSelectedPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash a la livraison</option>
                        <option value="Online">Paiement en ligne</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Prix</span><span>{currency}{subtotal}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>livraison</span><span className="text-green-600">gratuite</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{tax}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total :</span><span>{currency}{total}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary-dull text-white font-medium hover:bg-primary transition">
              {paymentoption === "COD" ? "payer à la livraison" : "Payer maintenant"}
                </button>
            </div>
        </div>
    ) : null
}
export default Cart;