"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Search,
  Filter,
  User as UserIcon,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import Alert from "@/components/Alert";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/auth/getUsers");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const usersArray = Array.isArray(data) ? data : data.users || [];
      const formattedUsers = usersArray.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        joinDate: u.created_at,
        bookingsCount: u.total_rentals || 0,
        status: u.status || "active",
        lastLogin: u.lastLogin || u.created_at,
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.error("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/updateUser/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === id ? { ...u, ...updatedFields } : u))
      );
      Alert.success("Success", "User updated successfully");
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error("Error updating user:", error.message);
      Alert.error("Error", error.message || "Failed to update user");
      return false;
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/auth/deleteUser/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u.id !== id));
      Alert.success("Deleted", "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      Alert.error("Error", error.message);
    }
  };

  const openEditModal = (userItem) => {
    setModalUser(userItem);
    setEditFormData({
      name: userItem.name,
      email: userItem.email,
      phone: userItem.phone,
      role: userItem.role,
      status: userItem.status,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    if (!modalUser) return;

    const updatedFields = { ...editFormData };
    const hasChanges = Object.keys(updatedFields).some(
      (key) => updatedFields[key] !== modalUser[key]
    );
    if (!hasChanges) {
      Alert.info("Info", "No changes were made");
      setIsModalOpen(false);
      return;
    }
    handleUpdateUser(modalUser.id, updatedFields);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        );
      
    }
  };

  const getRoleBadge = (role) =>
    role === "admin" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        <Shield size={12} className="mr-1" /> Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <UserIcon size={12} className="mr-1" /> User
      </span>
    );

  if (!user || user.role !== "admin") return null;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-0 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage all user accounts and permissions</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

           {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-600">Admins</div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role & Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((userItem) => (
                      <tr key={userItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                            <div className="text-sm text-gray-500">ID: {userItem.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{userItem.email}</div>
                          <div className="text-sm text-gray-500">{userItem.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-y-2">
                          {getRoleBadge(userItem.role)}
                          {getStatusBadge(userItem.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex flex-col space-y-1">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-1" />
                              Joined: {formatDate(userItem.joinDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(userItem)}
                            className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded"
                          >
                            <Edit size={18} />
                          </button>
                          {/* <button
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try a different search term" : "No users in the system"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit {modalUser.name}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
