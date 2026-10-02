import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { townshipService } from '../services/townshipService';
import { regionService } from '../services/regionService';

const Townships = () => {
  const [townships, setTownships] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTownship, setEditingTownship] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameMm: '',
    region: '',
    description: '',
  });

  const fetchTownships = async () => {
    try {
      setLoading(true);
      const response = await townshipService.getTownships();
      if (response.status) {
        setTownships(response.data);
      }
    } catch (err) {
      setError('Failed to fetch townships');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await regionService.getRegions();
      if (response.status) {
        setRegions(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch regions');
    }
  };

  useEffect(() => {
    fetchTownships();
    fetchRegions();
  }, []);

  const handleEdit = (township) => {
    setEditingTownship(township);
    setFormData({
      name: township.name,
      nameMm: township.nameMm || '',
      region: township.region?.id || '',
      description: township.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this township?')) return;
    
    try {
      const response = await townshipService.deleteTownship(id);
      if (response.status) {
        fetchTownships();
      }
    } catch (err) {
      setError('Failed to delete township');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTownship) {
        const response = await townshipService.updateTownship(editingTownship.id, formData);
        if (response.status) {
          setShowModal(false);
          fetchTownships();
        }
      } else {
        const response = await townshipService.createTownship(formData);
        if (response.status) {
          setShowModal(false);
          fetchTownships();
        }
      }
    } catch (err) {
      setError('Failed to save township');
    }
  };

  const handleCreate = () => {
    setEditingTownship(null);
    setFormData({
      name: '',
      nameMm: '',
      region: '',
      description: '',
    });
    setShowModal(true);
  };

  const getRegionName = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    return region ? region.name : 'Unknown';
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="townships-page">
        <div className="page-header">
          <h1>Townships Management</h1>
          <button onClick={handleCreate} className="btn-primary">
            Add Township
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Name (Myanmar)</th>
              <th>Region</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {townships.map((township) => (
              <tr key={township.id}>
                <td>{township.name}</td>
                <td>{township.nameMm || '-'}</td>
                <td>{township.region?.name || getRegionName(township.region)}</td>
                <td>{township.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(township)} className="btn-small btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(township.id)} className="btn-small btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingTownship ? 'Edit Township' : 'Add Township'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name (Myanmar)</label>
                  <input
                    type="text"
                    value={formData.nameMm}
                    onChange={(e) => setFormData({ ...formData, nameMm: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    required
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name} ({region.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Townships;
