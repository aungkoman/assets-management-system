import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { userService } from '../services/userService';
import { locationService } from '../services/locationService';
import { regionService } from '../services/regionService';
import { assetService } from '../services/assetService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    locations: 0,
    regions: 0,
    assets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, locationsRes, regionsRes, assetsRes] = await Promise.all([
          userService.getUsers({ limit: 1 }),
          locationService.getLocations(),
          regionService.getRegions(),
          assetService.getAssets({ limit: 1 }),
        ]);

        setStats({
          users: usersRes.pagination?.totalItems || 0,
          locations: locationsRes.data?.length || 0,
          regions: regionsRes.data?.length || 0,
          assets: assetsRes.pagination?.totalItems || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        {loading ? (
          <div>Loading statistics...</div>
        ) : (
          <div className="dashboard-cards">
            <div className="card stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.users}</p>
              <p className="stat-label">Registered users</p>
            </div>
            <div className="card stat-card">
              <h3>Total Locations</h3>
              <p className="stat-number">{stats.locations}</p>
              <p className="stat-label">Buildings, floors, rooms</p>
            </div>
            <div className="card stat-card">
              <h3>Total Regions</h3>
              <p className="stat-number">{stats.regions}</p>
              <p className="stat-label">Geographic regions</p>
            </div>
            <div className="card stat-card">
              <h3>Total Assets</h3>
              <p className="stat-number">{stats.assets}</p>
              <p className="stat-label">Tracked assets</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
