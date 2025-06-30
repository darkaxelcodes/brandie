import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserPlus, 
  Mail, 
  Plus, 
  X, 
  Edit, 
  Trash, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../contexts/ToastContext'

export const Teams: React.FC = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [showUpdateAlert, setShowUpdateAlert] = useState(false)

  // Dummy data for now
  const teams = [
    {
      id: '1',
      name: 'Marketing Team',
      members: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor' }
      ]
    },
    {
      id: '2',
      name: 'Design Team',
      members: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer' }
      ]
    }
  ]

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return
    
    // In a real implementation, this would create a team in the database
    showToast('success', `Team "${newTeamName}" created successfully`)
    setShowCreateModal(false)
    setNewTeamName('')
  }

  const handleInviteUser = () => {
    if (!inviteEmail.trim() || !selectedTeam) return
    
    // In a real implementation, this would send an invitation
    showToast('success', `Invitation sent to ${inviteEmail}`)
    setShowInviteModal(false)
    setInviteEmail('')
  }

  const handleCheckForUpdates = () => {
    // Only show one notification - either the toast or the alert
    setShowUpdateAlert(true)
    
    // Hide the alert after 5 seconds
    setTimeout(() => {
      setShowUpdateAlert(false)
    }, 5000)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Teams
            </h1>
            <p className="text-gray-600">
              Collaborate with team members on your brand projects
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </Button>
        </div>
      </motion.div>

      {/* Teams List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-600">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{team.members.length} members</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTeam(team)
                    setShowInviteModal(true)
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite Members</span>
                </Button>
              </div>
              
              <div className="p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                <div className="space-y-3">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          
          {/* Create Team Card */}
          <Card className="p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create a New Team</h3>
            <p className="text-gray-500 mb-4">
              Collaborate with others on your brand projects
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Team</span>
            </Button>
          </Card>
        </div>
      </motion.div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teams Feature Coming Soon</h3>
              <p className="text-gray-600 mb-4">
                We're currently developing the teams feature to enable collaboration on brand projects.
                This page shows a preview of the upcoming functionality.
              </p>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handleCheckForUpdates}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Check for Updates</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Update Alert */}
      {showUpdateAlert && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5" />
            <span>Teams and Collaboration feature coming soon!</span>
            <button 
              onClick={() => setShowUpdateAlert(false)}
              className="ml-2 text-white hover:text-blue-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Team"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Create a team to collaborate with others on your brand projects.
          </p>
          
          <Input
            label="Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Enter team name..."
          />
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim()}
              className="flex-1"
            >
              Create Team
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={`Invite to ${selectedTeam?.name || 'Team'}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Invite team members by email. They'll receive an invitation to join your team.
          </p>
          
          <Input
            label="Email Address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            icon={<Mail className="w-4 h-4" />}
          />
          
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteUser}
              disabled={!inviteEmail.trim()}
              className="flex-1"
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}