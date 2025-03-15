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
    </section>
  );
};

export default Banner;
