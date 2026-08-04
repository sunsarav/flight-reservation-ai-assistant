import { AlertCircle, CheckCircle2 } from 'lucide-react'
 
export type ApiMessage = { type: 'success' | 'error'; text: string } | null
 
interface StatusMessageProps {
  message: ApiMessage
}
 
function StatusMessage({ message }: StatusMessageProps) {
  if (!message) {
    return null
  }
 
  return (
    <div className={`toast-message ${message.type}`}>
      {message.type === 'success' ? (
        <CheckCircle2 size={19} />
      ) : (
        <AlertCircle size={19} />
      )}
      <span>{message.text}</span>
    </div>
  )
}
 
export default StatusMessage