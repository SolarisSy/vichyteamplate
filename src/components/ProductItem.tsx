import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";

interface ProductItemProps {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  popularity?: number;
  stock?: number;
}

const ProductItem = ({ id, image, title, category, price, popularity, stock }: ProductItemProps) => {
  // Verificar se é um produto novo (adicionado nos últimos 7 dias)
  const isNewProduct = () => {
    // Simulando que todos os produtos são novos para fins de demonstração
    return true;
  };

  return (
    <div className="w-full flex flex-col gap-2 justify-center shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden">
      <Link
        to={`/product/${id}`}
        className="w-full h-[300px] max-md:h-[200px] overflow-hidden group relative"
      >
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error("Error loading product item image:", e.currentTarget.src);
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
          {isNewProduct() && (
            <div className="absolute top-2 left-2 bg-secondaryBrown text-white text-xs px-2 py-1 rounded">
              Novo
            </div>
          )}
          {stock !== undefined && stock <= 5 && stock > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Apenas {stock} restantes
            </div>
          )}
          {stock !== undefined && stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Esgotado
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link
          to={`/product/${id}`}
          className="text-black text-xl font-medium tracking-[0.5px] hover:text-secondaryBrown transition-colors duration-300"
        >
          <h2 className="line-clamp-2 h-14">{title}</h2>
        </Link>
        <p className="text-secondaryBrown text-sm tracking-wide mt-1">
          {formatCategoryName(category)}{" "}
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-black text-xl font-bold">
            R$ {price.toFixed(2)}
          </p>
          {popularity !== undefined && (
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm ml-1">{popularity}/5</span>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-2 mt-4">
          <Link
            to={`/product/${id}`}
            className="text-white bg-secondaryBrown text-center text-sm font-medium tracking-[0.5px] py-2 rounded-md hover:bg-opacity-90 transition duration-300"
          >
            Ver produto
          </Link>
          <Link
            to={`/cart`}
            className="bg-white text-secondaryBrown text-center text-sm border border-secondaryBrown font-medium tracking-[0.5px] py-2 rounded-md hover:bg-secondaryBrown hover:text-white transition duration-300"
          >
            Adicionar ao carrinho
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
