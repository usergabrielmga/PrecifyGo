import { motion } from 'framer-motion'
import { TrendingUp, FileText, CheckCircle, User } from "lucide-react";

type CardProps = {
  title: string
  value: string | number
}

const icons = {
  "Orçamentos este mês": <FileText size={24} color="#EA2E52" />,
  "Total este mês": <TrendingUp size={24} color="#EA2E52" />,
  "Total de Orçamentos": <CheckCircle size={24} color="#EA2E52" />,
  "Clientes": <User size={24} color="#EA2E52" />
}


export default function Card({ title, value }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-[#FEF2F4] rounded-lg flex items-center justify-center">
          {icons[title as keyof typeof icons] || <FileText size={24} color="#EA2E52" />}
        </div>
      </div>

      <div>
        <p className="text-3xl font-semibold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </motion.div>
  )
}