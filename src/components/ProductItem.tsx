import React from 'react';
import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";
import { useAppDispatch } from "../hooks";
import { addProductToTheCart } from "../features/cart/cartSlice";
import toast from "react-hot-toast";

interface ProductItemProps {
  id: string;
  image: string;
  title: string;
  category?: string;
  price: number;
  popularity?: number;
  stock?: number;
  description?: string;
  featured?: boolean;
}

const ProductItem = ({ id, image, title, category = "", price, popularity, stock, description, featured }: ProductItemProps) => {
  const dispatch = useAppDispatch();
  
  // Verificar se é um produto novo (adicionado nos últimos 7 dias)
  const isNewProduct = () => {
    // Simulando que todos os produtos são novos para fins de demonstração
    return true;
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Previne a navegação ao clicar no botão
    dispatch(
      addProductToTheCart({
        id,
        image,
        title,
        category,
        price,
        quantity: 1,
        size: "m", // Tamanho padrão
        color: "black", // Cor padrão
        popularity,
        stock,
        description,
        featured
      })
    );
    toast.success("Produto adicionado ao carrinho");
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
        <Link to={`/product/${id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          {category && (
            <p className="text-sm text-gray-500 mb-2">{formatCategoryName(category)}</p>
          )}
          <p className="text-lg font-semibold text-gray-900 mb-4">${price.toFixed(2)}</p>
        </Link>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-secondaryBrown text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300 touch-manipulation"
          disabled={stock !== undefined && stock === 0}
        >
          {stock !== undefined && stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
