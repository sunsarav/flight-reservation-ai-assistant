import { RefreshCcw } from 'lucide-react'
 
interface PageHeaderProps {
  title: string
  description: string
  loading: boolean
  working: boolean
  onRefresh: () => void
}
 
function PageHeader({
  title,
  description,
  loading,
  working,
  onRefresh,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <p className="page-label">Flight Reservation System</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
 
      <button
        className="refresh-button"
        type="button"
        onClick={onRefresh}
        disabled={loading || working}
      >
        <RefreshCcw size={18} />
        Refresh
      </button>
    </header>
  )
}
 
export default PageHeader