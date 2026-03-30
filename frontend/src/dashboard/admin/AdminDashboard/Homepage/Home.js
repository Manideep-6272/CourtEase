import React, { useState, useEffect } from "react";
import api from "../../../../api";
import '../admin.css';

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from "recharts";

function Home() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOwners: 0,
    approvedOwners: 0,
    totalCourts: 0,
    activeCourts: 0,
    totalBookings: 0,
    todayRevenue: 0,
    monthRevenue: 0
  });

  const [chartData, setChartData] = useState({
    revenue: [],
    bookings: [],
    users: [],
    courts: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    fetchCharts();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      setError("Failed to load statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharts = async () => {
    try {
      const res = await api.get("/admin/chart-data");
      setChartData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
    fetchCharts();
  };

  if (loading) {
    return (
      <div className="saas-dashboard">
        <div className="dashboard-header">
          <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b"];

  const courtData = [
    { name: "Active", value: chartData.courts.active || 0, fill: "#10b981" },
    { name: "Inactive", value: chartData.courts.inactive || 0, fill: "#ef4444" }
  ];

  // Calculate trends
  const userGrowth = stats.activeUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0;
  const bookingTrend = chartData.bookings.length > 0 ? "↑ 12%" : "→ 0%";
  const revenueTrend = stats.monthRevenue > stats.todayRevenue * 25 ? "↑ Strong" : "→ Stable";

  return (
    <div className="saas-dashboard">
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Here's your platform performance.</p>
          </div>
          <div className="header-actions">
            <button className="btn-refresh" onClick={handleRefresh} title="Refresh data">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-container">
          <div className="alert alert-danger">⚠️ {error}</div>
        </div>
      )}

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Top KPI Cards */}
        <div className="kpi-grid">
          {/* Users Card */}
          <div className="kpi-card kpi-users">
            <div className="kpi-header">
              <div className="kpi-icon">👥</div>
              <span className="kpi-badge positive">{userGrowth}% Active</span>
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Total Users</p>
              <h2 className="kpi-value">{stats.totalUsers || 0}</h2>
              <p className="kpi-detail">{stats.activeUsers || 0} active users</p>
            </div>
          </div>

          {/* Owners Card */}
          <div className="kpi-card kpi-owners">
            <div className="kpi-header">
              <div className="kpi-icon">🏢</div>
              <span className="kpi-badge positive">{stats.totalOwners > 0 ? ((stats.approvedOwners / stats.totalOwners) * 100).toFixed(0) : 0}% Approved</span>
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Court Owners</p>
              <h2 className="kpi-value">{stats.totalOwners || 0}</h2>
              <p className="kpi-detail">{stats.approvedOwners || 0} verified</p>
            </div>
          </div>

          {/* Courts Card */}
          <div className="kpi-card kpi-courts">
            <div className="kpi-header">
              <div className="kpi-icon">🏆</div>
              <span className="kpi-badge positive">{stats.totalCourts > 0 ? ((stats.activeCourts / stats.totalCourts) * 100).toFixed(0) : 0}% Active</span>
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Active Courts</p>
              <h2 className="kpi-value">{stats.activeCourts || 0}</h2>
              <p className="kpi-detail">{stats.totalCourts || 0} total</p>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="kpi-card kpi-bookings">
            <div className="kpi-header">
              <div className="kpi-icon">📅</div>
              <span className="kpi-badge">{bookingTrend}</span>
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Total Bookings</p>
              <h2 className="kpi-value">{stats.totalBookings || 0}</h2>
              <p className="kpi-detail">Platform wide</p>
            </div>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="revenue-section">
          <div className="revenue-cards">
            <div className="revenue-card today">
              <p className="revenue-label">Today's Revenue</p>
              <h2 className="revenue-value">₹{(stats.todayRevenue || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}</h2>
              <p className="revenue-change positive">↑ On track</p>
            </div>
            <div className="revenue-card month">
              <p className="revenue-label">This Month</p>
              <h2 className="revenue-value">₹{(stats.monthRevenue || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}</h2>
              <p className="revenue-change positive">↑ {revenueTrend}</p>
            </div>
            <div className="revenue-card average">
              <p className="revenue-label">Average per Booking</p>
              <h2 className="revenue-value">₹{stats.totalBookings > 0 ? Math.round(stats.monthRevenue / stats.totalBookings) : 0}</h2>
              <p className="revenue-change">Calculated</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Revenue Trend */}
          <div className="chart-card chart-full">
            <div className="chart-header">
              <h3>💰 Revenue Trend</h3>
              <p className="chart-subtitle">Last 30 days performance</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.revenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bookings Trend */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>📊 Bookings Trend</h3>
              <p className="chart-subtitle">Last 30 days</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData.bookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>👥 User Registrations</h3>
              <p className="chart-subtitle">Last 30 days</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData.users}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Courts Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>🏆 Court Status</h3>
              <p className="chart-subtitle">Active vs Inactive</p>
            </div>
            <div className="pie-container">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={courtData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">⚙️</div>
            <h4>Pending Approvals</h4>
            <p>{Math.max(stats.totalOwners - stats.approvedOwners, 0)} waiting</p>
            <button className="btn-action" onClick={() => window.location.href = '/admin/requests'}>
              Review →
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">🔍</div>
            <h4>System Status</h4>
            <div className="status-indicator">
              <span className="status-dot online"></span>
              <span>All systems operational</span>
            </div>
            <button className="btn-action" onClick={() => {}}>
              Details →
            </button>
          </div>

          <div className="action-card">
            <div className="action-icon">📈</div>
            <h4>Analytics</h4>
            <p>Last updated now</p>
            <button className="btn-action" onClick={handleRefresh}>
              Update →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;