'use client'

import { Plus, Edit, Trash2, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminBrands() {
    const router = useRouter()
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")

    const brands = [
        {
            id: 1,
            sn: 1,
            title: "SENBA",
            slug: "SENBA",
            status: "active"
        }
    ]

    // Filter brands based on search term
    const filteredBrands = brands.filter(brand =>
        brand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Pagination logic
    const startIndex = 0
    const endIndex = Math.min(entriesPerPage, filteredBrands.length)
    const paginatedBrands = filteredBrands.slice(startIndex, endIndex)

    return (
        <div className="bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-semibold text-blue-600">Brand List</h1>
                <button 
                    onClick={() => router.push('/admin/brands/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    <Plus size={18} />
                    Add Brand
                </button>
            </div>

            {/* Controls Section */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select 
                        value={entriesPerPage} 
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Search:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    S.N.
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Title
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Slug
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Status
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    Action
                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {paginatedBrands.length > 0 ? (
                            paginatedBrands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {brand.sn}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {brand.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {brand.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                            {brand.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                                                <Edit size={14} />
                                            </button>
                                            <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No brands found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <div className="px-6 py-4">
                <p className="text-sm text-gray-700">
                    Showing {paginatedBrands.length > 0 ? startIndex + 1 : 0} to {endIndex} of {filteredBrands.length} entries
                </p>
            </div>
        </div>
    )
}
