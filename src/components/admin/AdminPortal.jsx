import React, { useState } from "react";
import "../../styles/AdminPortal.css";
import RegistrationForm from "./RegistrationForm";

const AdminPortal = () => {
  const [currentPage, setCurrentPage] = useState("userManagement");
  const [showAddUser, setShowAddUser] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [users, setUsers] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("Client");

  // User management view handler
  const handleBackToUserManagement = () => {
    setShowAddUser(false);
  };

  // Add new user handler
  const handleAddUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  // Render sidebar component
  const renderSidebar = () => {
    return (
      <div className="sidebar">
        <h2 className="sidebar-header">ADMINISTRATION</h2>
        <ul className="sidebar-menu">
          <li
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => {
              setCurrentPage("dashboard");
              setShowAddUser(false);
            }}
          >
            Dashboard
          </li>
          <li
            className={currentPage === "userManagement" ? "active" : ""}
            onClick={() => {
              setCurrentPage("userManagement");
              setShowAddUser(false);
            }}
          >
            User Management
          </li>
          <li
            className={currentPage === "serviceCategories" ? "active" : ""}
            onClick={() => {
              setCurrentPage("serviceCategories");
              setShowAddUser(false);
            }}
          >
            Service Categories
          </li>
          <li
            className={currentPage === "providerVerification" ? "active" : ""}
            onClick={() => {
              setCurrentPage("providerVerification");
              setShowAddUser(false);
            }}
          >
            Provider Verification
          </li>
          <li
            className={currentPage === "reports" ? "active" : ""}
            onClick={() => {
              setCurrentPage("reports");
              setShowAddUser(false);
            }}
          >
            Reports
          </li>
          <li
            className={currentPage === "settings" ? "active" : ""}
            onClick={() => {
              setCurrentPage("settings");
              setShowAddUser(false);
            }}
          >
            Settings
          </li>
        </ul>
      </div>
    );
  };

  // User Type Selection Form
  const renderUserTypeSelection = () => {
    return (
      <div className="content-container">
        <h1>Create New User</h1>
        <div className="user-type-container">
          <h2>User Type</h2>
          <div className="user-type-buttons">
            <button
              className={selectedUserType === "Client" ? "active" : ""}
              onClick={() => setSelectedUserType("Client")}
            >
              Client
            </button>
            <button
              className={
                selectedUserType === "Service Provider" ? "active" : ""
              }
              onClick={() => setSelectedUserType("Service Provider")}
            >
              Service Provider
            </button>
            <button
              className={selectedUserType === "Administrator" ? "active" : ""}
              onClick={() => setSelectedUserType("Administrator")}
            >
              Administrator
            </button>
          </div>
          <RegistrationForm
            userType={selectedUserType.toLowerCase().replace(" ", "-")}
            onSubmit={handleAddUser}
            onCancel={handleBackToUserManagement}
            isAdminCreating={true}
          />
        </div>
      </div>
    );
  };

  // User Management view
  const renderUserManagement = () => {
    if (showAddUser) {
      return renderUserTypeSelection();
    }

    return (
      <div className="content-container">
        <h1>User Management</h1>
        <div className="user-management-controls">
          <div className="search-container">
            <input type="text" placeholder="Search users..." />
          </div>
          <button
            className="add-user-button"
            onClick={() => setShowAddUser(true)}
          >
            + Add User
          </button>
        </div>

        <div className="filter-tabs">
          <button
            className={filterStatus === "All Users" ? "active" : ""}
            onClick={() => setFilterStatus("All Users")}
          >
            All Users
          </button>
          <button
            className={filterStatus === "Pending" ? "active" : ""}
            onClick={() => setFilterStatus("Pending")}
          >
            Pending
          </button>
          <button
            className={filterStatus === "Active" ? "active" : ""}
            onClick={() => setFilterStatus("Active")}
          >
            Active
          </button>
          <button
            className={filterStatus === "Inactive" ? "active" : ""}
            onClick={() => setFilterStatus("Inactive")}
          >
            Inactive
          </button>
        </div>

        <div className="user-table">
          <div className="table-header">
            <div className="header-cell">Name</div>
            <div className="header-cell">Email</div>
            <div className="header-cell">Type</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>
          <div className="table-body">
            {users.length > 0 ? (
              users
                .filter((user) => {
                  if (filterStatus === "All Users") return true;
                  return user.status === filterStatus;
                })
                .map((user) => (
                  <div key={user.id} className="table-row">
                    <div className="table-cell">{`${user.firstName} ${user.lastName}`}</div>
                    <div className="table-cell">{user.email}</div>
                    <div className="table-cell">{user.userType}</div>
                    <div className="table-cell">
                      <span
                        className={`status-badge ${user.status.toLowerCase()}`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="table-cell">
                      <button className="action-button edit">Edit</button>
                      <button className="action-button delete">Delete</button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="empty-state">
                <p>No users found. Click "Add User" to create a new user.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-portal">
      <header className="app-header">
        <div className="brand-container">
          <h1 className="brand-name">ServiceHub</h1>
          <span className="portal-name">Admin Portal</span>
        </div>
        <div className="user-info">
          <span>Admin User</span>
          <div className="user-avatar">A</div>
        </div>
      </header>

      <div className="main-container">
        {renderSidebar()}
        <div className="content">
          {currentPage === "userManagement" && renderUserManagement()}
          {/* Add additional content sections for other pages as needed */}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
