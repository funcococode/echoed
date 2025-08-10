"use client";

import NavBar from "./(features)/(marketing)/_components/nav-bar";
import EchoBackground from "./(features)/(marketing)/_components/echo-background";
import Hero from "./(features)/(marketing)/_components/hero";
import LogosRow from "./(features)/(marketing)/_components/logo-row";
import Features from "./(features)/(marketing)/_components/features";
import Showcase from "./(features)/(marketing)/_components/showcase";
import Testimonials from "./(features)/(marketing)/_components/testimonials";
import CTA from "./(features)/(marketing)/_components/cta";
import Footer from "./(features)/(marketing)/_components/footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0b10] text-zinc-100 antialiased overflow-x-clip">
      <EchoBackground />
      <NavBar />
      <main className="relative">
        <Hero />
        <LogosRow />
        <Features />
        <Showcase />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}



