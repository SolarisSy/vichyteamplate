import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Banner, ProductItem } from "../components";
import customFetch from "../utils/customFetch";
import { useCategories } from '../context/CategoryContext';

const Landing = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { categories } = useCategories();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await customFetch.get('/products?_sort=createdAt&_order=desc&_limit=12');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <Banner />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Compre por Categoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link 
                key={category.id} 
                to={`/shop/${category.slug}`}
                className="group"
              >
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-center md:text-left">Produtos em Destaque</h2>
            <p className="text-gray-600 mt-2 md:mt-0">
              Nossos produtos mais recentes e populares
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondaryBrown"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  category={product.category}
                  price={product.price}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/shop" 
              className="inline-block bg-secondaryBrown text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-300"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
