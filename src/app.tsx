import { LandingSection } from "./components/landing";
import { FunctionalSection } from "./components/functional";

function App() {
  return (
    <main className="flex h-svh flex-col">
      <LandingSection />
      <FunctionalSection />
      <footer className="mx-auto mt-auto space-x-2 p-4 text-sm">
        <a href="https://github.com/narasaka/poke" target="_blank">
          github
        </a>
        <span>&middot;</span>
        <a href="https://narasaka.dev" target="_blank">
          me
        </a>
      </footer>
    </main>
  );
}

export default App;
