import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Shield, Users, FileSpreadsheet, UserX, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const AdminPanel = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    setActionLoading(userId);
    try {
      const endpoint = isBlocked ? 'unblock' : 'block';
      await api.patch(`/admin/users/${userId}/${endpoint}`);
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || `Failed to ${isBlocked ? 'unblock' : 'block'} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setActionLoading(selectedUser.id);
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      toast.success('User deleted successfully');
      fetchData();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="h-10 w-10 mr-3 text-blue-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600">Manage users and view platform analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-total-users">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <span className="text-3xl font-bold">{stats?.total_users || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-total-uploads">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileSpreadsheet className="h-8 w-8 text-green-600 mr-3" />
                <span className="text-3xl font-bold">{stats?.total_uploads || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-total-admins">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600 mr-3" />
                <span className="text-3xl font-bold">{stats?.total_admins || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-blocked-users">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Blocked Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserX className="h-8 w-8 text-red-600 mr-3" />
                <span className="text-3xl font-bold">{stats?.total_blocked_users || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="users-list-card">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No users found</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    data-testid={`user-item-${u.id}`}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{u.name}</h3>
                          {u.role === 'admin' && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                              Admin
                            </span>
                          )}
                          {u.is_blocked && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined {new Date(u.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {u.id !== user?.id && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockUser(u.id, u.is_blocked)}
                          disabled={actionLoading === u.id}
                          data-testid={`${u.is_blocked ? 'unblock' : 'block'}-user-${u.id}`}
                        >
                          {u.is_blocked ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Block
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(u)}
                          disabled={actionLoading === u.id}
                          data-testid={`delete-user-${u.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="delete-user-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedUser?.name}</strong>'s account and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-dialog-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              data-testid="delete-dialog-confirm"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPanel;
