'use client'

import { ChevronDown, ArrowLeft, Plus, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        isFeatured: true,
        category: '',
        selectedBrands: [],
        hasVariants: false,
        price: '',
        discount: '',
        stock: '',
        sku: '',
        status: 'Active'
    })
    const [specificationGroups, setSpecificationGroups] = useState([])

    // Sample categories - replace with actual data from API
    const categories = [
        'Water-Pumps SS monobloc pump',
        'Water-Pumps Petrol engine pump',
        'Water-Pumps Monobloc pump',
        'Other Categories'
    ]

    // Sample brands - replace with actual data from API
    const brands = [
        { id: 1, name: 'SENBA' }
    ]

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleBrandChange = (brandId) => {
        setFormData(prev => ({
            ...prev,
            selectedBrands: prev.selectedBrands.includes(brandId)
                ? prev.selectedBrands.filter(id => id !== brandId)
                : [...prev.selectedBrands, brandId]
        }))
    }

    const handleAddSpecificationGroup = () => {
        setSpecificationGroups(prev => [
            ...prev,
            {
                id: Date.now(),
                groupLabel: '',
                specifications: [
                    { id: Date.now() + 1, featureName: '', featureValue: '' }
                ]
            }
        ])
    }

    const handleRemoveSpecificationGroup = (groupId) => {
        setSpecificationGroups(prev => prev.filter(group => group.id !== groupId))
    }

    const handleUpdateGroupLabel = (groupId, value) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId ? { ...group, groupLabel: value } : group
            )
        )
    }

    const handleAddSpecification = (groupId) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          specifications: [
                              ...group.specifications,
                              { id: Date.now(), featureName: '', featureValue: '' }
                          ]
                      }
                    : group
            )
        )
    }

    const handleRemoveSpecification = (groupId, specId) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          specifications: group.specifications.filter(spec => spec.id !== specId)
                      }
                    : group
            )
        )
    }

    const handleUpdateSpecification = (groupId, specId, field, value) => {
        setSpecificationGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                          ...group,
                          specifications: group.specifications.map(spec =>
                              spec.id === specId ? { ...spec, [field]: value } : spec
                          )
                      }
                    : group
            )
        )
    }

    const handleReset = () => {
        setFormData({
            title: '',
            isFeatured: true,
            category: '',
            selectedBrands: [],
            hasVariants: false,
            price: '',
            discount: '',
            stock: '',
            sku: '',
            status: 'Active'
        })
        setSpecificationGroups([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        const submitData = {
            ...formData,
            specificationGroups
        }
        console.log('Form submitted:', submitData)
        router.push('/admin/products')
    }

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-md transition"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">Add Product</h2>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 w-full">
                {/* Title Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter title"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Is Featured Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                        Is Featured
                    </label>
                    {formData.isFeatured && (
                        <span className="text-sm text-gray-500">✔ Yes</span>
                    )}
                </div>

                {/* Category Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="">--Select any category--</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Select Brands */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Brands
                    </label>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <div key={brand.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`brand-${brand.id}`}
                                    checked={formData.selectedBrands.includes(brand.id)}
                                    onChange={() => handleBrandChange(brand.id)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={`brand-${brand.id}`} className="text-sm text-gray-700">
                                    {brand.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Variants Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="hasVariants"
                        id="hasVariants"
                        checked={formData.hasVariants}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hasVariants" className="text-sm font-medium text-gray-700">
                        This product has variants
                    </label>
                </div>

                {/* Price Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Discount Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                    </label>
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        placeholder="Enter discount"
                        step="0.01"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Stock Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="Enter stock quantity"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* SKU Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU
                    </label>
                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Enter SKU"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Specification Groups */}
                <div className="space-y-4">
                    {specificationGroups.map((group) => (
                        <div key={group.id} className="bg-white p-6">
                            {/* Group Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Group Label
                                    </label>
                                    <input
                                        type="text"
                                        value={group.groupLabel}
                                        onChange={(e) => handleUpdateGroupLabel(group.id, e.target.value)}
                                        placeholder="Enter group label"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSpecificationGroup(group.id)}
                                    className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition text-sm"
                                >
                                    Remove Group
                                </button>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-3">
                                {group.specifications.map((spec) => (
                                    <div key={spec.id} className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Feature name
                                            </label>
                                            <input
                                                type="text"
                                                value={spec.featureName}
                                                onChange={(e) => handleUpdateSpecification(group.id, spec.id, 'featureName', e.target.value)}
                                                placeholder="Enter feature name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Feature value
                                            </label>
                                            <input
                                                type="text"
                                                value={spec.featureValue}
                                                onChange={(e) => handleUpdateSpecification(group.id, spec.id, 'featureValue', e.target.value)}
                                                placeholder="Enter feature value"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecification(group.id, spec.id)}
                                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition mb-0.5"
                                            title="Remove specification"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Specification Button */}
                            <button
                                type="button"
                                onClick={() => handleAddSpecification(group.id)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition text-sm"
                            >
                                <Plus size={16} />
                                Add Specification
                            </button>
                        </div>
                    ))}

                    {/* Add Specification Group Button */}
                    <button
                        type="button"
                        onClick={handleAddSpecificationGroup}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                        <Plus size={18} />
                        Add Specification Group
                    </button>
                </div>

                {/* Status Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

