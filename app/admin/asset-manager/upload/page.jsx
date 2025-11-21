'use client'

import { ChevronDown, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AssetUploadPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        file: null,
        fileName: ''
    })

    const assetTypes = [
        'Image',
        'Video',
        'Short'
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData(prev => ({
                ...prev,
                file: file,
                fileName: file.name
            }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle file upload here
        console.log('Form submitted:', formData)
        // You can add file upload logic here
        router.push('/admin/asset-manager')
    }

    const handleBack = () => {
        router.push('/admin/asset-manager')
    }

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Asset Upload</h2>
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
                        placeholder="Asset Title"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Type Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="">-- Select Type --</option>
                            {assetTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        <ChevronDown 
                            size={20} 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Upload File Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <label className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md cursor-pointer transition">
                            Choose File
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </label>
                        <input
                            type="text"
                            value={formData.fileName}
                            readOnly
                            placeholder="No file chosen"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    )
}

