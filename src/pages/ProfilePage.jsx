import { useState } from 'react'
import {
  Shield,
  Copy,
  Check,
  Heart,
  FileText,
  Camera,
  Play,
  Edit3,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import userService from '../services/userService'
import { useFavorites } from '../hooks/useFavorites'
import About from './About'
import Contact from './Contact'
import {
  deleteDraft,
  formatDraftTime,
  getAllDraftIds,
  loadDraft,
} from '../utils/draftStorage'
import { getArchivedGuns, permanentlyDeleteGun, restoreGun } from '../utils/archiveStorage'

/**
 * ProfilePage — User identity and Armory settings.
 * Manages operator profile, identifier, favorites stats, and draft storage.
 */
export default function ProfilePage({ onReplaySplash, onEditProfile, onNavigateCreate, onNavigateEdit }) {
  const [profile] = useState(() => userService.getUserProfile())
  const [avatar, setAvatar] = useState(profile.avatar || null)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')

  const { favorites } = useFavorites()
  const [drafts, setDrafts] = useState(() => getAllDraftIds().map((id) => ({ id, data: loadDraft(id) })))
  const [archived, setArchived] = useState(getArchivedGuns)

  const handleCopyId = () => {
    if (profile.userId) {
      navigator.clipboard.writeText(profile.userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setFeedback('Avatar image must be under 2MB.')
      setTimeout(() => setFeedback(''), 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setAvatar(base64)
      userService.updateAvatar(base64)
      setFeedback('Avatar updated.')
      setTimeout(() => setFeedback(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const refreshWorkspace = () => {
    setDrafts(getAllDraftIds().map((id) => ({ id, data: loadDraft(id) })))
    setArchived(getArchivedGuns())
  }

  return (
    <div className="profile-page">
      <section className="masthead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="display">Operator Profile</h1>
          <p className="lede">
            Operator credentials, procurement statistics, and armorer details.
          </p>
        </div>
        {onReplaySplash && (
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={onReplaySplash}
            title="Replay introductory splash animation"
          >
            <Play size={14} /> Replay Intro
          </button>
        )}
      </section>

      {feedback && (
        <div className="toast toast--success">
          <Check size={18} /> {feedback}
        </div>
      )}

      {/* Operator Card */}
      <div className="profile-card">
        <div className="profile-card-top">
          <div className="avatar-wrap">
            {avatar ? (
              <img src={avatar} alt={profile.username} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <Shield size={36} stroke="var(--brass)" />
              </div>
            )}
            <label htmlFor="avatar-file-input" className="avatar-upload-btn" title="Upload avatar">
              <Camera size={14} />
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-file-input"
              />
            </label>
          </div>

          <div className="profile-identity">
            <h2 className="display">{profile.username || 'Shooter'}</h2>
            <div className="profile-id-row">
              <span className="mono-badge">{profile.userId}</span>
              <button
                type="button"
                className="icon-btn"
                onClick={handleCopyId}
                title="Copy User ID to clipboard"
              >
                {copied ? <Check size={14} color="var(--brass)" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats">
          <div className="stat-item">
            <Heart size={20} className="stat-icon" stroke="var(--brass)" />
            <div className="stat-val">{favorites.length}</div>
            <div className="stat-label">Procurement Favorites</div>
          </div>
          <div className="stat-item">
            <FileText size={20} className="stat-icon" stroke="var(--steel)" />
            <div className="stat-val">{drafts.length}</div>
            <div className="stat-label">Saved Offline Drafts</div>
          </div>
        </div>
      </div>

      <section className="profile-section">
        <div className="list-head"><h2>Profile details</h2><button type="button" className="btn btn--outline btn--sm" onClick={onEditProfile}><Edit3 size={15} /> Edit name &amp; bio</button></div>
        <p>{profile.bio || 'No bio added yet.'}</p>
      </section>

      <section className="profile-section">
        <div className="list-head"><h2>Saved drafts ({drafts.length})</h2><button type="button" className="btn btn--primary btn--sm" onClick={onNavigateCreate}>New draft</button></div>
        {drafts.length === 0 ? <p className="detail-empty">No saved drafts.</p> : (
          <ul className="workspace-list">{drafts.map(({ id, data }) => (
            <li key={id}><div><strong>{data?.name || `Draft ${id}`}</strong><small>{formatDraftTime(data?.savedAt)}</small></div><div className="card-actions">
              <button type="button" className="btn btn--outline btn--sm" onClick={() => id === 'create' ? onNavigateCreate() : onNavigateEdit({ id, ...data })}>Restore</button>
              <button type="button" className="icon-btn" onClick={() => { deleteDraft(id); refreshWorkspace() }} aria-label="Delete draft"><Trash2 size={16} /></button>
            </div></li>
          ))}</ul>
        )}
      </section>

      <section className="profile-section">
        <div className="list-head"><h2>Archived hardware ({archived.length})</h2><button type="button" className="btn btn--outline btn--sm" onClick={refreshWorkspace}><RotateCcw size={15} /> Refresh</button></div>
        {archived.length === 0 ? <p className="detail-empty">No archived hardware.</p> : (
          <ul className="workspace-list">{archived.map((gun) => (
            <li key={gun.id}><div><strong>{gun.name}</strong><small>Archived {new Date(gun.archivedAt).toLocaleDateString()}</small></div><div className="card-actions">
              <button type="button" className="btn btn--outline btn--sm" onClick={() => { restoreGun(gun.id); refreshWorkspace() }}>Restore</button>
              <button type="button" className="btn btn--danger btn--sm" onClick={() => { permanentlyDeleteGun(gun.id); refreshWorkspace() }}>Delete permanently</button>
            </div></li>
          ))}</ul>
        )}
      </section>

      <section className="profile-section"><About /></section>
      <section className="profile-section"><Contact /></section>
    </div>
  )
}
