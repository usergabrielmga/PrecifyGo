type CardProps = {
  title: string
  value: string | number
}

export default function Card({ title, value }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2 text-gray-800">{value}</p>
    </div>
  )
}
