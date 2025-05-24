import NearbyIncidentsMap from "@/app/components/nearby-incident-map";

export default function NearbyIncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nearby Incidents Map</h1>
        <p className="text-gray-600 mt-2">View and track environmental incidents within 5km radius of your location</p>
      </div>

      <NearbyIncidentsMap />
    </div>
  )
}
