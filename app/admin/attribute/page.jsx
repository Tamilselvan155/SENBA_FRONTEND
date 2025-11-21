'use client'

import { Plus, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminAttribute() {
    const router = useRouter()
    
    const attributes = [
        { id: 8, title: "qwert" },
        { id: 7, title: "kw" },
        { id: 6, title: "Bore X stroke (mm)" },
        { id: 5, title: "Pipe Size" },
        { id: 4, title: "Type" },
        { id: 3, title: "HP" },
    ]

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between p-6">
                <h1 className="text-2xl font-semibold text-blue-600">Attribute List</h1>
                <button 
                    onClick={() => router.push('/admin/attribute/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                    <Plus size={18} />
                    Add Attribute
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">S.N.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {attributes.map((attr) => (
                            <tr key={attr.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{attr.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{attr.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
                                        <Edit size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

