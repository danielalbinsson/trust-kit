import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function Layout() {
  return (
    <div className="site-shell min-h-screen">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
