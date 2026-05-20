import { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

let toastListeners = []
let toastData = null

export function showToast(message, type = 'success') {
  toastData = { message, type }
  toastListeners.forEach(fn => fn({ ...toastData }))
}

export default function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    toastListeners.push(setToast)
    return () => {
      toastListeners = toastListeners.filter(fn => fn !== setToast)
    }
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div role="alert" aria-live="polite" className={`fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-5 py-3.5 bg-elevated border rounded-lg backdrop-blur-xl shadow-xl transition-transform duration-300 ${
      toast.type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'
    } ${toast ? 'translate-x-0' : 'translate-x-[120%]'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
      }`}>
        {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
      </div>
      <span className="text-sm">{toast.message}</span>
    </div>
  )
}
