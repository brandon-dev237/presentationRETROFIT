const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-3 mt-12 sm:mt-16 md:mt-24 pb-14 px-4">
            <h1 className="text-[clamp(1.2rem,4vw,2.5rem)] font-semibold">
                Ne ratez aucune pépite vintage!
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-500/70 pb-4 md:pb-8 max-w-xl">
                Abonnez-vous pour ne rien manquer : offres, nouveautés et promotions exclusives.
            </p>
            <form className="flex items-center justify-between max-w-2xl w-full h-11 sm:h-12 md:h-13">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-sm sm:text-base text-gray-500"
                    type="email"
                    placeholder="Entrez votre e-mail"
                    required
                />
                <button
                    type="submit"
                    className="px-4 sm:px-8 md:px-12 h-full text-sm sm:text-base text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none whitespace-nowrap"
                >
                    S'inscrire
                </button>
            </form>
        </div>
    )
}

export default NewsLetter
