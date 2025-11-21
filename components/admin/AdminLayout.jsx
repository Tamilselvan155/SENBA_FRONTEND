'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    const fetchIsAdmin = async () => {
        setIsAdmin(true)
        setLoading(false)
    }

    useEffect(() => {
        fetchIsAdmin()
        
        // Aggressively hide Next.js development indicator
        const hideNextIndicator = () => {
            // Method 1: Hide by known selectors - INCLUDING BUTTON WATERMARK
            const selectors = [
                '[data-nextjs-dev-indicator]',
                '[class*="__next-dev-indicator"]',
                '[id*="__next-dev-indicator"]',
                '[data-testid="nextjs-dev-indicator"]',
                '[data-testid*="nextjs"]',
                '.__next-dev-indicator',
                '#__next-build-watcher',
                // Target the specific button watermark
                '#next-logo',
                'button#next-logo',
                'button[data-next-mark]',
                'button[data-next-mark="true"]',
                'button[data-next-mark-loading]',
                'button[data-nextjs-dev-tools-button]',
                'button[aria-label="Open Next.js Dev Tools"]',
                '[aria-controls="nextjs-dev-tools-menu"]',
                // Target the SVG inside the button
                'svg[data-next-mark-loading]',
                'svg[data-next-mark-loading="false"]',
                'svg[viewBox="0 0 40 40"]',
                'svg[width="40"][height="40"]'
            ]
            
            selectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; position: absolute !important; left: -9999px !important; width: 0 !important; height: 0 !important;'
                        el.remove()
                    })
                } catch (e) {}
            })
            
            // Method 2: Find ALL elements and check for "N" watermark anywhere on page
            document.querySelectorAll('*').forEach(el => {
                try {
                    const style = window.getComputedStyle(el)
                    const rect = el.getBoundingClientRect()
                    const text = el.textContent?.trim()
                    const innerHTML = el.innerHTML?.trim() || ''
                    const styleAttr = el.getAttribute('style') || ''
                    
                    // Skip if already hidden
                    if (el.offsetParent === null || style.display === 'none' || style.visibility === 'hidden') return
                    
                    // Check for button watermark FIRST (highest priority)
                    const isButtonWatermark = el.tagName === 'BUTTON' && (
                        el.id === 'next-logo' ||
                        el.getAttribute('data-next-mark') === 'true' ||
                        el.getAttribute('data-next-mark-loading') !== null ||
                        el.getAttribute('data-nextjs-dev-tools-button') === 'true' ||
                        el.getAttribute('aria-label') === 'Open Next.js Dev Tools' ||
                        el.getAttribute('aria-controls') === 'nextjs-dev-tools-menu'
                    )
                    
                    // Check for SVG watermark
                    const isSvgWatermark = el.tagName === 'SVG' && (
                        el.getAttribute('data-next-mark-loading') !== null ||
                        el.getAttribute('viewBox') === '0 0 40 40' ||
                        (el.getAttribute('width') === '40' && el.getAttribute('height') === '40')
                    )
                    
                    const hasN = text === 'N' || text === 'n' || innerHTML === 'N' || innerHTML === 'n'
                    const isFixed = style.position === 'fixed' || styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed')
                    const isAbsolute = style.position === 'absolute' || styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute')
                    const isSmall = rect.width < 100 && rect.height < 100
                    const isCircular = style.borderRadius === '50%' || (parseFloat(style.borderRadius) > 0 && rect.width === rect.height)
                    
                    // Remove button watermark FIRST (highest priority)
                    if (isButtonWatermark) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Remove SVG watermark
                    if (isSvgWatermark) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;'
                        el.remove()
                        return
                    }
                    
                    // Remove ANY small element with "N" that looks like a watermark
                    if (hasN && isSmall && (isFixed || isAbsolute || isCircular)) {
                        // Make sure it's not part of legitimate content
                        const parent = el.parentElement
                        const isInContent = parent && (
                            parent.closest('nav') || 
                            parent.closest('main') || 
                            parent.closest('article') || 
                            parent.closest('section') ||
                            parent.closest('header') ||
                            parent.closest('footer') ||
                            (parent.closest('aside') && !parent.closest('aside').classList.toString().includes('bg-blue-900'))
                        )
                        
                        // If it's a watermark-like element, remove it
                        if (!isInContent || (isFixed && isSmall)) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;'
                            el.remove()
                        }
                    }
                    
                    // Also check for Next.js indicator patterns
                    if (innerHTML.includes('__next-dev-indicator') || innerHTML.includes('__next')) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important;'
                        el.remove()
                    }
                    
                    // Check for black menu overlay and black lines
                    const menuId = el.id === 'nextjs-dev-tools-menu' || el.getAttribute('aria-labelledby')?.includes('next')
                    const bgColor = style.backgroundColor || ''
                    const hasBlackBg = bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('rgba(0, 0, 0') || bgColor === 'black' || bgColor.includes('#000')
                    const isBottomLeft = rect.left < 300 && (rect.bottom < 300 || (window.innerHeight - rect.bottom) < 300)
                    
                    // Remove menu overlay
                    if (menuId || (isFixed && isBottomLeft && hasBlackBg)) {
                        const children = el.querySelectorAll('*')
                        let hasNextJsContent = false
                        children.forEach(child => {
                            const childText = (child.textContent || '').trim()
                            if (childText.includes('Route') || childText.includes('Turbopack') || childText.includes('Preferences') || childText.includes('Dev Tools')) {
                                hasNextJsContent = true
                            }
                        })
                        
                        if (menuId || hasNextJsContent) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                            el.remove()
                            return
                        }
                    }
                    
                    // Check for black lines/borders
                    const isBlackLine = (
                        (rect.height <= 2 && rect.width > 10) || // Horizontal line
                        (rect.width <= 2 && rect.height > 10) || // Vertical line
                        (style.borderColor && style.borderColor.includes('rgb(0, 0, 0)')) ||
                        (style.borderColor && style.borderColor.includes('black'))
                    ) && isBottomLeft && (isFixed || isAbsolute)
                    
                    if (isBlackLine) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; height: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;'
                        el.remove()
                    }
                } catch(e) {}
            })
            
            // Method 3: Check inline styles for fixed/absolute position with "N"
            document.querySelectorAll('*[style]').forEach(el => {
                try {
                    const styleAttr = el.getAttribute('style') || ''
                    const hasFixed = styleAttr.includes('position: fixed') || styleAttr.includes('position:fixed')
                    const hasAbsolute = styleAttr.includes('position: absolute') || styleAttr.includes('position:absolute')
                    const text = el.textContent?.trim()
                    const rect = el.getBoundingClientRect()
                    const isSmall = rect.width < 100 && rect.height < 100
                    
                    if ((hasFixed || hasAbsolute) && (text === 'N' || text === 'n') && isSmall) {
                        el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; position: absolute !important; left: -9999px !important; width: 0 !important; height: 0 !important;'
                        el.remove()
                    }
                } catch(e) {}
            })
        }
        
        // Run immediately
        hideNextIndicator()
        
        // Run on very frequent interval - maximum aggressiveness
        const interval = setInterval(hideNextIndicator, 10)
        
        // Use MutationObserver to catch dynamically added elements
        const observer = new MutationObserver((mutations) => {
            hideNextIndicator()
        })
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'id', 'data-testid', 'data-nextjs-dev-indicator']
        })
        
        // Also observe document
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true
        })
        
        return () => {
            clearInterval(interval)
            observer.disconnect()
        }
    }, [])

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed)
    }

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex h-screen bg-white">
            <AdminSidebar isCollapsed={isSidebarCollapsed} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminNavbar onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto bg-white p-8">
                    {children}
                </main>
            </div>
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