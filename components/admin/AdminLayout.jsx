'use client'
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import ActionButtons from "../common/ActionButtons"

const AdminLayout = ({ children, actionButtons }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

    const fetchIsAdmin = async () => {
        setIsAdmin(true)
        setLoading(false)
    }

    useEffect(() => {
        fetchIsAdmin()
    }, [])

    // Determine module type from pathname for action buttons
    const getModuleType = () => {
        if (pathname.includes('/products')) return 'products'
        if (pathname.includes('/category')) return 'categories'
        if (pathname.includes('/brands')) return 'brands'
        if (pathname.includes('/banners')) return 'banners'
        if (pathname.includes('/attribute-value')) return 'attribute-values'
        if (pathname.includes('/attribute')) return 'attributes'
        if (pathname.includes('/stores')) return 'stores'
        if (pathname.includes('/coupons')) return 'coupons'
        return null
    }

    const moduleType = getModuleType()
    const isDashboard = pathname === '/admin' || pathname === '/admin/'

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <AdminNavbar 
                actionButtons={actionButtons || (moduleType ? <ActionButtons moduleType={moduleType} /> : null)}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className={`${isDashboard ? 'container mx-auto px-6 py-8' : 'mx-auto px-6 py-8'}`}>
                    {children}
                </div>
            </main>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout