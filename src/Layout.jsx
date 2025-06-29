import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#f1f5f9]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
