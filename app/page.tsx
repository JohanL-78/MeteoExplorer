"use client";

import { useState } from "react";
import GlobeComponent from "./components/Globe";
import Navbar from "./components/Navbar";
import About from "./components/About";

export default function Page() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <main className="w-full h-screen">
      <Navbar onAboutClick={() => setShowAbout(true)} />
      <GlobeComponent />
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </main>
  );
}
