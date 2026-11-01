import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import userService from '../services/userService'

export default function ProfileEditPage({ onBack }) {
  const initial = userService.getUserProfile()
  const [username, setUsername] = useState(initial.username || '')
  const [bio, setBio] = useState(initial.bio || '')
  const [feedback, setFeedback] = useState('')

  const save = (event) => {
    event.preventDefault()
    const result = userService.saveUserProfile({ ...initial, username, bio })
    setFeedback(result.success ? 'Profile updated.' : result.message || 'Unable to save profile.')
  }

  return (
    <section className="profile-page">
      <button type="button" className="detail-back" onClick={onBack}><ArrowLeft size={18} /> Back to Profile</button>
      <div className="masthead">
        <h1 className="display">Edit Profile</h1>
        <p className="lede">Update your public operator name and biography.</p>
      </div>
      <form onSubmit={save} className="profile-form">
        <div className="form-group">
          <label htmlFor="edit-prof-name" className="form-label">Name</label>
          <input id="edit-prof-name" className="form-input" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="edit-prof-bio" className="form-label">Bio</label>
          <textarea id="edit-prof-bio" className="form-textarea" rows={5} value={bio} onChange={(event) => setBio(event.target.value)} />
        </div>
        <button type="submit" className="btn btn--primary"><Save size={16} /> Save changes</button>
        {feedback && <p className="form-success">{feedback}</p>}
      </form>
    </section>
  )
}
