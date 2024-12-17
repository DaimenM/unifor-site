import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center text-center md:text-left gap-2">
          <div className="flex flex-col md:flex-row md:items-center gap-4 items-center">
            <Link href="/" className="text-2xl font-bold flex justify-center">
              <Image
                src="/DISTR-300.png"
                alt="Site Logo"
                width={120}
                height={40}
                quality={100}
                priority
              />
            </Link>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-4xl md:text-6xl font-bold">District 300</h1>
              <h2 className="text-xl md:text-3xl">Unifor Local 2002</h2>
            </div>
          </div>
          <p className="text-lg mt-2 md:hidden">416 352 2328</p>
        </div>
      </div>
    </header>
  );
} 
