import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      {toasts.map((toast) => {
        const { id, title, description, type } = toast

        return (
          <div
            key={id}
            className={`mb-2 w-full rounded-lg p-4 shadow-lg ${
              type === 'success' ? 'bg-green-500 text-white' :
              type === 'error' ? 'bg-red-500 text-white' :
              type === 'warning' ? 'bg-yellow-500 text-gray-900' :
              'bg-gray-800 text-white'
            }`}
          >
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="mt-1 text-sm">{description}</div>}
          </div>
        )
      })}
    </div>
  )
}
