import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section className="relative bg-gray-100">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="banner-container flex justify-center items-center">
          <img 
            src="/promo-banner.jpg" 
            alt="VICHY Laboratories Promotion" 
            className="w-full h-auto object-contain md:object-cover object-center"
          />
        </div>
      </div>
      <div className="absolute bottom-4 md:bottom-10 right-4 md:right-10 z-10">
        <Link 
          to="/shop" 
          className="bg-secondaryBrown text-white px-4 py-2 md:px-8 md:py-3 text-base md:text-lg rounded-md hover:bg-opacity-90 transition duration-300 shadow-md"
        >
          Comprar Agora
        </Link>
      </div>
    </section>
  );
};

export default Banner;
