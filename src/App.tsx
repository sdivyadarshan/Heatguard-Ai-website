/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HeatRiskMap from './pages/HeatRiskMap';
import ThermalStress from './pages/ThermalStress';
import Biometeorology from './pages/Biometeorology';
import HyperLocalView from './pages/HyperLocalView';
import Forecast from './pages/Forecast';
import WardAnalysis from './pages/WardAnalysis';
import Alerts from './pages/Alerts';
import ActionCentre from './pages/ActionCentre';
import Simulation from './pages/Simulation';
import Status from './pages/Status';
import Methodology from './pages/Methodology';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="map" element={<HeatRiskMap />} />
          
          {/* Hyper-Local Neighborhood Surveillance (Avadi, Pattabiram, Poonamallee, etc.) */}
          <Route path="hyperlocal" element={<HyperLocalView />} />
          <Route path="local" element={<HyperLocalView />} />

          {/* Biometeorological Graphs & WBGT Analytics */}
          <Route path="biometeorology" element={<Biometeorology />} />
          <Route path="stress" element={<Biometeorology />} />

          {/* Risk Outlook */}
          <Route path="outlook" element={<Forecast />} />
          <Route path="forecast" element={<Forecast />} />

          {/* Vulnerability */}
          <Route path="vulnerability" element={<WardAnalysis />} />
          <Route path="wards" element={<WardAnalysis />} />

          {/* Warnings & Alerts */}
          <Route path="warnings" element={<Alerts />} />
          <Route path="alerts" element={<Alerts />} />

          {/* Heat Action Plan */}
          <Route path="action-plan" element={<ActionCentre />} />
          <Route path="action-centre" element={<ActionCentre />} />

          {/* Citizen Directory & Simulation */}
          <Route path="data-sources" element={<Simulation />} />
          <Route path="sources" element={<Simulation />} />
          <Route path="simulation" element={<Simulation />} />

          {/* Governance & Status */}
          <Route path="status" element={<Status />} />
          <Route path="methodology" element={<Methodology />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
