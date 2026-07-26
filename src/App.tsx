import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import {
  CiPage,
  CliPage,
  DisclaimerPage,
  DocsIndexPage,
  GoldenPathPage,
  HonestyContractPage,
  KitCertifiedPage,
  RoadmapPage,
} from "./pages/DocsPages";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { ReviewPage } from "./pages/ReviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="docs" element={<DocsIndexPage />} />
          <Route path="docs/honesty-contract" element={<HonestyContractPage />} />
          <Route path="docs/cli" element={<CliPage />} />
          <Route path="docs/golden-path" element={<GoldenPathPage />} />
          <Route path="docs/ci" element={<CiPage />} />
          <Route path="docs/kit-certified" element={<KitCertifiedPage />} />
          <Route path="docs/disclaimer" element={<DisclaimerPage />} />
          <Route path="docs/roadmap" element={<RoadmapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
