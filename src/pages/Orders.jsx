export default function Orders() {
  return <Placeholder title="Orders" note="Stats and overview will go here." />
}

function Placeholder({ title, note }) {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500">{note}</p>
    </div>
  )
}