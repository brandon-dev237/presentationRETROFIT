import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loader = () => {
    const [searchParams] = useSearchParams();
    const { navigate, clearCart } = useAppContext();

    useEffect(() => {
        clearCart();

        const next = searchParams.get("next");
        const destination = next === "orders" ? "/my-orders" : "/";

        const timer = setTimeout(() => {
            navigate(destination);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
                <p className="text-xl font-medium text-gray-700">Paiement confirmé !</p>
                <p className="text-sm text-gray-500 mt-1">Redirection vers vos commandes...</p>
            </div>
        </div>
    );
};

export default Loader;
