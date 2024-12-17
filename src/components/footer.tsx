import { Phone } from 'lucide-react' // or any other icon library you prefer

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <p>District 300. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={18} />
          <a href="tel:416-352-2328" className="hover:text-gray-300">
            416-352-2328
          </a>
        </div>
      </div>
    </footer>
  )
}
