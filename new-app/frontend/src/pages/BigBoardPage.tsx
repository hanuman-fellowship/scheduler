import { useBigBoard } from '../hooks/useBigBoard'

export default function BigBoardPage() {
  const { data: boardData, isLoading } = useBigBoard()

  if (isLoading) {
    return <div className="p-4 text-center">Loading Big Board...</div>
  }

  return (
    <div className="p-4">
      {/* Categories will be rendered here once API is integrated */}
      {boardData?.categories?.map((category: any) => (
        <CategorySection key={category.id} category={category} />
      )) || (
        <div className="text-center">
          <p>No schedule data available yet.</p>
          <p className="text-sm text-gray-600">
            Connect to the backend API to load the Big Board view.
          </p>
        </div>
      )}
    </div>
  )
}

function CategorySection({ category }: { category: any }) {
  return (
    <div className="mb-8">
      <div className="text-center mb-4">
        <button
          className="font-bold text-lg cursor-pointer hover:bg-schedule-hover px-2"
          onClick={() => {/* toggle category visibility */}}
        >
          {category.name}
        </button>
      </div>
      
      <table className="mx-auto border-2 border-gray-800 w-full max-w-6xl">
        <thead>
          <tr>
            <th className="schedule-cell font-bold">Name</th>
            <th className="schedule-cell font-bold">Hours</th>
            {category.days?.map((day: string) => (
              <th key={day} className="schedule-cell font-bold">{day}</th>
            ))}
            <th className="schedule-cell font-bold">Other</th>
          </tr>
        </thead>
        <tbody>
          {category.people?.map((person: any) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PersonRow({ person }: { person: any }) {
  return (
    <tr>
      <td className="schedule-cell">
        <a 
          href={`/people/${person.id}`}
          style={{ color: person.category?.color }}
          className="hover:bg-schedule-hover"
        >
          {person.name}
        </a>
      </td>
      <td className="schedule-cell">{person.totalHours || 0}</td>
      {person.shifts?.map((shift: any, index: number) => (
        <td key={index} className="schedule-cell">
          {shift.assignments?.map((assignment: any) => (
            <div key={assignment.id} className="shift-display">
              {assignment.display}
            </div>
          ))}
        </td>
      ))}
      <td className="schedule-cell">
        <div className="floating-shift">
          {person.floatingShifts?.join(', ')}
          {person.notes && (
            <>
              {person.floatingShifts?.length > 0 && <hr />}
              <i>{person.notes}</i>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}