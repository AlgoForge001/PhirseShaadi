import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, UserCheck, Crown, Shield, Activity, 
  TrendingUp, TrendingDown, MapPin, PieChart as PieIcon, 
  BarChart as BarIcon, Calendar, ArrowRight, LogOut,
  LayoutDashboard, Users as UsersIcon, ShieldCheck, User
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar, ResponsiveContainer as RespCont
} from 'recharts';
import api from "../utils/api";
import "./AdminDashboard.css";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#14B8A6'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [religionData, setReligionData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        statsRes, dailyRes, religionRes, 
        cityRes, revenueRes, planRes, activityRes
      ] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/stats/daily-registrations"),
        api.get("/admin/stats/religion-distribution"),
        api.get("/admin/stats/city-distribution"),
        api.get("/admin/stats/monthly-revenue"),
        api.get("/admin/stats/plan-distribution"),
        api.get("/admin/activity")
      ]);

      setStats(statsRes.data.data);
      setDailyData(dailyRes.data.data);
      setReligionData(religionRes.data.data);
      setCityData(cityRes.data.data);
      setRevenueData(revenueRes.data.data);
      setPlanData(planRes.data.data);
      setActivity(activityRes.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      if (err.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat('en-IN').format(val);
  };

  if (loading) return (
    <div className="admin-loading-screen">
      <div className="spinner"></div>
      <p>Loading Analytics...</p>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* GLOBAL NAV */}
      <nav className="global-nav">
        <div className="global-nav-content">
          <div className="admin-logo">
            <Shield size={16} color="#ffffff" fill="#ffffff" />
            <span>Shaadi Admin</span>
          </div>
          <div className="global-nav-links">
            <button 
              className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${activeView === 'users' ? 'active' : ''}`}
              onClick={() => navigate('/admin-users')} // Placeholder or state change
            >
              Users
            </button>
            <button className="nav-link" onClick={handleLogout}>
              <LogOut size={14} style={{ marginRight: 4 }} />
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* SUB NAV FROSTED */}
      <div className="sub-nav-frosted">
        <div className="sub-nav-content">
          <h1 className="sub-nav-title">Dashboard & Analytics</h1>
          <div className="sub-nav-actions">
            <div className="date-filter-pill">
              <Calendar size={14} />
              <span>This Month</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      <main className="admin-main">
        {/* SECTION 1 — TOP STATS ROW */}
        <div className="stats-grid">
          <StatCard 
            title="Total Users" 
            value={formatNumber(stats?.totalUsers)} 
            icon={<UsersIcon size={20} color="#3B82F6" />}
            trend="+12% vs yesterday"
            trendUp={true}
            color="blue"
          />
          <StatCard 
            title="New Today" 
            value={formatNumber(stats?.newToday)} 
            icon={<TrendingUp size={20} color="#10B981" />}
            color="green"
          />
          <StatCard 
            title="Premium Users" 
            value={formatNumber(stats?.premiumUsers)} 
            icon={<Crown size={20} color="#F59E0B" />}
            subValue={`${stats?.conversionRate} Conversion`}
            color="gold"
          />
          <StatCard 
            title="Verified Users" 
            value={formatNumber(stats?.verifiedUsers)} 
            icon={<ShieldCheck size={20} color="#8B5CF6" />}
            color="purple"
          />
          <StatCard 
            title="Active Today" 
            value={formatNumber(stats?.activeToday)} 
            icon={<Activity size={20} color="#14B8A6" />}
            color="teal"
          />
          <StatCard 
            title="Revenue (Month)" 
            value={formatCurrency(stats?.revenueThisMonth)} 
            icon={<TrendingUp size={20} color="#10B981" />}
            color="green"
          />
        </div>

        {/* SECTION 2 — CHARTS ROW */}
        <div className="charts-grid">
          <ChartCard title="Daily Registrations (30 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Religion Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={religionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="religion"
                >
                  {religionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* SECTION 3 — SECOND CHARTS ROW */}
        <div className="charts-grid">
          <ChartCard title="Top 10 Cities">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="city" type="category" width={80} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#14B8A6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Revenue (12 Months)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" hide />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="dashboard-footer-grid">
          {/* SECTION 4 — PLAN DISTRIBUTION */}
          <div className="table-card">
            <div className="card-header">
              <h3 className="card-title">Plan Distribution</h3>
            </div>
            <table className="distribution-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Users</th>
                  <th>Revenue</th>
                  <th>% Share</th>
                </tr>
              </thead>
              <tbody>
                {planData.map((plan, idx) => (
                  <tr key={idx}>
                    <td>{plan.plan}</td>
                    <td>{plan.count}</td>
                    <td>{formatCurrency(plan.revenue)}</td>
                    <td>
                      <div className="progress-cell">
                        <span>0%</span>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SECTION 5 — RECENT ACTIVITY FEED */}
          <div className="activity-card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="activity-feed">
              {activity.map((item, idx) => (
                <div className="activity-item" key={idx}>
                  <div className={`activity-icon-wrap ${item.type}`}>
                    {item.type === 'registration' ? <User size={14} /> : <Shield size={14} />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-msg">{item.message}</p>
                    <span className="activity-time">{new Date(item.date).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp, color, subValue }) => (
  <div className={`stat-card border-${color}`}>
    <div className="stat-card-header">
      <span className="stat-card-title">{title}</span>
      {icon}
    </div>
    <div className="stat-card-value">{value}</div>
    {trend && (
      <div className={`stat-card-trend ${trendUp ? 'up' : 'down'}`}>
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{trend}</span>
      </div>
    )}
    {subValue && <div className="stat-card-subtext">{subValue}</div>}
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="chart-card">
    <h3 className="chart-card-title">{title}</h3>
    <div className="chart-container">
      {children}
    </div>
  </div>
);

const ChevronDown = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default AdminDashboard;
