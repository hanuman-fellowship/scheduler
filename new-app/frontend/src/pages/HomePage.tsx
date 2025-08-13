import BoxyButton from '../components/ui/BoxyButton'
import { useDashboard } from '../hooks/useDashboard'

export default function HomePage() {
  const { data: _ } = useDashboard()

  return (
    <div className="p-4">
      <div className="text-center space-x-4 mb-8">
        <BoxyButton to="/board">View Big Board</BoxyButton>
        <BoxyButton>Published Schedules</BoxyButton>
      </div>

      <div className="max-w-4xl mx-auto">
        <table className="mx-auto bg-schedule-bg border-4 border-gray-400">
          <tbody>
            <tr>
              <td className="p-4 align-top">
                <div>
                  <h3 className="font-bold mb-2">People</h3>
                  <div className="text-sm">
                    <p>Loading people...</p>
                  </div>
                </div>
              </td>
              <td className="p-4 align-top">
                <div>
                  <h3 className="font-bold mb-2">Areas</h3>
                  <div className="text-sm">
                    <p>Loading areas...</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-8 mt-8">
        <HoursSummaryTable title="Hours by Person" />
        <HoursSummaryTable title="Hours by Area" />
      </div>
    </div>
  )
}

function HoursSummaryTable({ title }: { title: string }) {
  return (
    <div>
      <div className="text-center mb-2">
        <a 
          href="#" 
          className="font-bold text-sm cursor-pointer hover:bg-schedule-hover"
        >
          {title}
        </a>
      </div>
      <table className="border-4 border-gray-400 bg-white">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-1"><strong>Total:</strong></td>
            <td className="px-4 py-1"><strong>0</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}