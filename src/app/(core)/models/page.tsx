import Sidebar from "@/components/Sidebar"

export default function WIP() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold">Work in Progress</h1>
        <p className="mt-4 text-xl text-gray-700">
          This section is currently under construction. Please check back later for updates.
        </p>
      </main>
    </div>
  )
}
