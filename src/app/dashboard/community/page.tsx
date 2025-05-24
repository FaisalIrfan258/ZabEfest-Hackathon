import CommunityPanel from "@/app/components/community-panel"

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-gray-600 mt-2">Connect with neighbors and collaborate on environmental initiatives</p>
      </div>

      <CommunityPanel />
    </div>
  )
}
