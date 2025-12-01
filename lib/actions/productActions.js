import axiosInstance from '../api/axios';

// Get all products
export const fetchProducts = async (fullDetails = true) => {
  try {
    const response = await axiosInstance.get(`/products${fullDetails ? '?full=true' : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single product
export const fetchProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create product
export const createProduct = async (data) => {
  try {
    const response = await axiosInstance.post('/products', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update product
export const updateProduct = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Filter products
export const filterProducts = async (filterParams) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filterParams.categories && filterParams.categories.length > 0) {
      filterParams.categories.forEach(cat => queryParams.append('categories', cat));
    }
    if (filterParams.pipeSizes && filterParams.pipeSizes.length > 0) {
      filterParams.pipeSizes.forEach(ps => queryParams.append('pipeSizes', ps));
    }
    if (filterParams.speeds && filterParams.speeds.length > 0) {
      filterParams.speeds.forEach(s => queryParams.append('speeds', s));
    }
    if (filterParams.headRanges && filterParams.headRanges.length > 0) {
      filterParams.headRanges.forEach(hr => queryParams.append('headRanges', hr));
    }
    if (filterParams.flowRanges && filterParams.flowRanges.length > 0) {
      filterParams.flowRanges.forEach(fr => queryParams.append('flowRanges', fr));
    }
    if (filterParams.hpOptions && filterParams.hpOptions.length > 0) {
      filterParams.hpOptions.forEach(hp => queryParams.append('hpOptions', hp));
    }
    if (filterParams.inStockOnly) {
      queryParams.append('inStockOnly', 'true');
    }
    if (filterParams.sortBy) {
      queryParams.append('sortBy', filterParams.sortBy);
    }
    if (filterParams.categoryName) {
      queryParams.append('categoryName', filterParams.categoryName);
    }

    const response = await axiosInstance.get(`/products/filter?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

