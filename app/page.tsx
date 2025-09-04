import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Challenge from "./_components/Challenge";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header/>
      <Hero/>
      <Challenge/>
    </div>
  );
}
