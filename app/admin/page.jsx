'use client'

import { FolderTree, Package, ClipboardList, FolderOpen, Store, Tag, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    // Sample data - replace with actual API calls
    const stats = {
        category: 15,
        products: 20,
        order: 0,
        stores: 5,
        brands: 8,
        banners: 3,
        attributes: 12,
    }

    const modules = [
        {
            id: 'products',
            name: 'Products',
            count: stats.products,
            color: 'blue',
            icon: Package,
            route: '/admin/products',
            subNav: [
                { label: 'View All', route: '/admin/products', icon: Package }
            ]
        },
        {
            id: 'categories',
            name: 'Categories',
            count: stats.category,
            color: 'purple',
            icon: FolderTree,
            route: '/admin/category',
            subNav: [
                { label: 'Add Category', route: '/admin/category/add', icon: FolderTree }
            ]
        },
        {
            id: 'brands',
            name: 'Brands',
            count: stats.brands,
            color: 'green',
            icon: Store,
            route: '/admin/brands',
            subNav: [
                { label: 'Add Brand', route: '/admin/brands/add', icon: Store }
            ]
        },
        {
            id: 'banners',
            name: 'Banners',
            count: stats.banners,
            color: 'orange',
            icon: ImageIcon,
            route: '/admin/banners',
            subNav: [
                { label: 'Add Banner', route: '/admin/banners/add', icon: ImageIcon }
            ]
        },
        {
            id: 'attributes',
            name: 'Attributes',
            count: stats.attributes,
            color: 'teal',
            icon: Tag,
            route: '/admin/attribute',
            subNav: [
                { label: 'Add Attribute', route: '/admin/attribute/add', icon: Tag }
            ]
        },
        {
            id: 'stores',
            name: 'Stores',
            count: stats.stores,
            color: 'indigo',
            icon: Store,
            route: '/admin/stores',
            subNav: [
                { label: 'View All', route: '/admin/stores', icon: Store }
            ]
        },
        {
            id: 'orders',
            name: 'Orders',
            count: stats.order,
            color: 'emerald',
            icon: ClipboardList,
            route: '/admin/orders',
            subNav: [
                { label: 'View All', route: '/admin/orders', icon: ClipboardList }
            ]
        },
        {
            id: 'asset-manager',
            name: 'Asset Manager',
            color: 'pink',
            icon: FolderOpen,
            route: '/admin/asset-manager',
            subNav: [
                { label: 'View All', route: '/admin/asset-manager', icon: FolderOpen }
            ]
        },
    ]

    const getIconColorClass = (color) => {
        const colorMap = {
            blue: 'bg-blue-500 text-white',
            purple: 'bg-purple-500 text-white',
            orange: 'bg-orange-500 text-white',
            indigo: 'bg-indigo-500 text-white',
            pink: 'bg-pink-500 text-white',
            green: 'bg-green-500 text-white',
            teal: 'bg-teal-500 text-white',
            emerald: 'bg-emerald-500 text-white',
            cyan: 'bg-cyan-500 text-white',
            violet: 'bg-violet-500 text-white',
            slate: 'bg-slate-500 text-white',
        };
        return colorMap[color] || 'bg-gray-500 text-white';
    };

    const handleModuleClick = (route) => {
        window.location.href = route
    }

    return (
        <div className="h-full w-full">
            {/* Main Content */}
            <div className="w-full h-full">
                {/* Header Section */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage and access all your modules</p>
                    </div>
                </div>

                {/* Modules Grid */}
                {modules.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer"
                            >
                                {/* Main Card Content */}
                                <button
                                    onClick={() => handleModuleClick(module.route)}
                                    className="w-full p-6 text-left flex-1 cursor-pointer min-h-[100px] flex items-start"
                                >
                                    <div className="flex items-start justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColorClass(module.color)}`}>
                                                <module.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {module.name}
                                                </h3>
                                                {module.count !== undefined ? (
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {`${module.count.toLocaleString()} items`}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-500 mt-0.5 h-5">
                                                        &nbsp;
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Sub-Navigation */}
                                {module.subNav && module.subNav.length > 0 && (
                                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 mt-auto">
                                        <div className={`grid ${module.subNav.length === 4 ? 'grid-cols-2' : module.subNav.length === 3 ? 'grid-cols-3' : 'grid-cols-1'} gap-2`}>
                                            {module.subNav.map((subNavItem, index) => (
                                                <Link
                                                    key={index}
                                                    href={subNavItem.route}
                                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200 hover:border-gray-300 transition-all duration-150 cursor-pointer"
                                                >
                                                    <subNavItem.icon className="w-4 h-4 flex-shrink-0" />
                                                    <span className="truncate">{subNavItem.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}
