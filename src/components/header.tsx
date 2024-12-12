import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          <div>
            <h1 className="text-6xl font-bold">District 300</h1>
            <h2 className="text-3xl">Unifor Local 2002</h2>
          </div>
        </div>
      </div>
    </header>
  );
}
