import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Challenge from "./_components/Challenge";
import Solution from "./_components/Solution";
import ContactSection from "./_components/Contact";
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header/>
      <Hero/>
      <Challenge/>
      <Solution/>
      <ContactSection/>
    </div>
  );
}
