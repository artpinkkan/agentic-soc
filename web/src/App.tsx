import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { Dashboard } from "@/pages/Dashboard"
import { Investigate } from "@/pages/Investigate"
import { Triage } from "@/pages/Triage"
import { Reports } from "@/pages/Reports"
import { Inspector } from "@/pages/Inspector"
import { AiGovernance } from "@/pages/AiGovernance"
import { PreventionEdge } from "@/pages/PreventionEdge"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import { Onboarding } from "@/pages/Onboarding"
import { Pricing } from "@/pages/Pricing"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/investigate" element={<Investigate />} />
        <Route path="/inspector" element={<Inspector />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai-governance" element={<AiGovernance />} />
        <Route path="/sse" element={<PreventionEdge />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
