'use client'

import { Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminAttributeValue() {
    const router = useRouter()
    
    const attributeValues = [
        { id: 1, attribute: "kw", value: "93" },
        { id: 2, attribute: "kw", value: "75" },
        { id: 3, attribute: "kw", value: "55" },
        { id: 4, attribute: "kw", value: "45" },
        { id: 5, attribute: "kw", value: "37" },
        { id: 6, attribute: "kw", value: "30" },
        { id: 7, attribute: "kw", value: "26" },
        { id: 8, attribute: "kw", value: "22" },
        { id: 9, attribute: "kw", value: "18.5" },
    ]

    return (
        <div className="bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-semibold text-blue-600">Attribute Values List</h1>
                <button 
                    onClick={() => router.push('/admin/attribute-value/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    <Plus size={18} />
                    Add Attribute Value
                </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Attribute</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {attributeValues.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.attribute}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.value}
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

