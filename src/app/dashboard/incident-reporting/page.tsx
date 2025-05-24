import IncidentReportingForm from "@/app/components/incident-reporting-form";


export default function IncidentReportingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Incident Reporting</h1>
        <p className="text-gray-600 mt-2">
          Report environmental incidents to help maintain a cleaner and safer community
        </p>
      </div>
      
      <IncidentReportingForm />
    </div>
  )
}
