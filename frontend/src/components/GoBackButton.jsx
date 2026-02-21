import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function GoBackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg hover:bg-[#e50914] text-gray-700 hover:text-white transition-all duration-200 group active:scale-95"
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
    </button>
  )
}
