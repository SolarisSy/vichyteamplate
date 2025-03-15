import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import customFetch from '../../axios/custom';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import { HiPlus, HiX } from 'react-icons/hi';
import { Product, ProductColor, ProductImage, ProductSize } from '../../types/product';
import { uploadImages } from '../../services/imageService';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Basic product info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [popularity, setPopularity] = useState('0');
  const [featured, setFeatured] = useState(true);
  
  // Images
  const [images, setImages] = useState<ProductImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  
  // Sizes
  const [sizes, setSizes] = useState<ProductSize[]>([
    { name: 'XS', available: false },
    { name: 'S', available: false },
    { name: 'M', available: false },
    { name: 'L', available: false },
    { name: 'XL', available: false },
    { name: 'XXL', available: false },
  ]);
  
  // Colors
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const response = await customFetch.get(`/products/${id}`);
          const product = response.data;
          
          // Set basic info
          setTitle(product.title);
          setDescription(product.description || '');
          setCategory(product.category);
          setPrice(String(product.price));
          setStock(String(product.stock));
          setPopularity(String(product.popularity || 0));
          setFeatured(product.featured || false);
          
          // Set images if they exist in the expanded format
          if (product.images && Array.isArray(product.images)) {
            setImages(product.images);
            setPrimaryImageIndex(product.images.findIndex((img: ProductImage) => img.isPrimary) || 0);
          } else if (product.image) {
            // Handle legacy format with single image
            setImages([{ 
              id: nanoid(), 
              url: product.image, 
              isPrimary: true 
            }]);
          }
          
          // Set sizes if they exist
          if (product.sizes && Array.isArray(product.sizes)) {
            setSizes(prev => {
              return prev.map(size => {
                const foundSize = product.sizes.find((s: ProductSize) => s.name === size.name);
                return foundSize ? { ...foundSize } : size;
              });
            });
          }
          
          // Set colors if they exist
          if (product.colors && Array.isArray(product.colors)) {
            setColors(product.colors);
          }
        } catch (error) {
          toast.error('Failed to fetch product');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    console.log("Files selected:", files.length);
    
    // Adiciona os arquivos à lista de arquivos
    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Cria previews temporários para exibição imediata
    const newImages: ProductImage[] = Array.from(files).map(file => ({
      id: nanoid(),
      url: URL.createObjectURL(file),
      isPrimary: false
    }));
    
    console.log("Created temporary previews:", newImages.length);
    
    // Adiciona as novas imagens à lista existente
    setImages(prev => {
      const updated = [...prev, ...newImages];
      // Se não houver imagem primária definida, define a primeira como primária
      if (!prev.some(img => img.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
        setPrimaryImageIndex(0);
      }
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // Update primary image if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(prev => prev - 1);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    setImages(prev => 
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    );
  };

  const handleSizeToggle = (index: number) => {
    setSizes(prev => 
      prev.map((size, i) => 
        i === index ? { ...size, available: !size.available } : size
      )
    );
  };

  const handleAddColor = () => {
    if (newColorName.trim() === '') {
      toast.error('Color name is required');
      return;
    }
    
    setColors(prev => [
      ...prev, 
      { 
        name: newColorName, 
        hex: newColorHex,
        available: true
      }
    ]);
    
    setNewColorName('');
    setNewColorHex('#000000');
  };

  const handleRemoveColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!title || !category || !price || !stock) {
        toast.error('Please fill all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare product data
      const productData: Partial<Product> = {
        title,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        popularity: Number(popularity),
        featured,
        sizes: sizes.filter(size => size.available),
        colors,
        updatedAt: new Date().toISOString()
      };
      
      // Add createdAt for new products
      if (!isEditMode) {
        Object.assign(productData, { 
          createdAt: new Date().toISOString(),
          id: nanoid()
        });
      }
      
      // Handle images
      if (images.length > 0) {
        if (isEditMode) {
          // For edit mode, use the existing image URLs and update primary status
          Object.assign(productData, { 
            images: images.map((img, index) => ({
              ...img,
              isPrimary: index === primaryImageIndex
            })),
            // Keep the legacy image field for backward compatibility
            image: images[primaryImageIndex]?.url || images[0]?.url
          });
        } else {
          // For new products, upload the images
          if (imageFiles.length > 0) {
            try {
              // Upload images and get back URLs
              const uploadedImageUrls = await uploadImages(imageFiles);
              
              const newImages = uploadedImageUrls.map((url, index) => ({
                id: nanoid(),
                url,
                isPrimary: index === primaryImageIndex
              }));
              
              Object.assign(productData, { 
                images: newImages,
                image: newImages[primaryImageIndex]?.url || newImages[0]?.url
              });
            } catch (error) {
              toast.error('Failed to upload images');
              setIsSubmitting(false);
              return;
            }
          } else {
            toast.error('At least one image is required');
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        toast.error('At least one image is required');
        setIsSubmitting(false);
        return;
      }
      
      // Save to API
      if (isEditMode) {
        await customFetch.put(`/products/${id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await customFetch.post('/products', productData);
        toast.success('Product created successfully');
      }
      
      // Navigate back to products list
      navigate('/admin/products');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading product data...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                <option value="special-edition">Special Edition</option>
                <option value="luxury-collection">Luxury Collection</option>
                <option value="summer-edition">Summer Edition</option>
                <option value="unique-collection">Unique Collection</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)*
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock*
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Popularity (0-100)
              </label>
              <input
                type="number"
                value={popularity}
                onChange={(e) => setPopularity(e.target.value)}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-secondaryBrown border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        {/* Images Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Product Images</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images*
            </label>
            <input
              type="file"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload multiple images. The first image will be the primary image.
            </p>
          </div>
          
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`relative border rounded-md overflow-hidden ${
                    index === primaryImageIndex ? 'ring-2 ring-secondaryBrown' : ''
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt="Product preview" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(index)}
                      className={`p-1 rounded-full ${
                        index === primaryImageIndex 
                          ? 'bg-secondaryBrown text-white' 
                          : 'bg-white text-gray-700'
                      }`}
                      title="Set as primary image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-white text-red-500 rounded-full"
                      title="Remove image"
                    >
                      <HiX className="h-5 w-5" />
                    </button>
                  </div>
                  {index === primaryImageIndex && (
                    <div className="absolute bottom-0 left-0 right-0 bg-secondaryBrown text-white text-xs py-1 text-center">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Sizes Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Available Sizes</h3>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size, index) => (
              <button
                key={size.name}
                type="button"
                onClick={() => handleSizeToggle(index)}
                className={`px-4 py-2 rounded-md ${
                  size.available 
                    ? 'bg-secondaryBrown text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Colors Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Available Colors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Name
              </label>
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. Red, Blue, Green"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Hex
              </label>
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-secondaryBrown text-white px-4 py-2 rounded-md flex items-center"
              >
                <HiPlus className="mr-2" /> Add Color
              </button>
            </div>
          </div>
          
          {colors.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {colors.map((color, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-red-500"
                  >
                    <HiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondaryBrown text-white px-6 py-2 rounded-md disabled:opacity-70"
          >
            {isSubmitting 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 