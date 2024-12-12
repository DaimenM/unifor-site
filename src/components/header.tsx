import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <Image
            src="/DISTR-300.png" 
            alt="Site Logo"
            width={120}
            height={40}
            quality={100}
            priority
          />
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
