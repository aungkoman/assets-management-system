import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { regionService } from '../services/regionService';

const Regions = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameMm: '',
    code: '',
    description: '',
  });

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await regionService.getRegions();
      if (response.status) {
        setRegions(response.data);
      }
    } catch (err) {
      setError('Failed to fetch regions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleEdit = (region) => {
    setEditingRegion(region);
    setFormData({
      name: region.name,
      nameMm: region.nameMm,
      code: region.code,
      description: region.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this region?')) return;
    
    try {
      const response = await regionService.deleteRegion(id);
      if (response.status) {
        fetchRegions();
      }
    } catch (err) {
      setError('Failed to delete region');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRegion) {
        const response = await regionService.updateRegion(editingRegion.id, formData);
        if (response.status) {
          setShowModal(false);
          fetchRegions();
        }
      } else {
        const response = await regionService.createRegion(formData);
        if (response.status) {
          setShowModal(false);
          fetchRegions();
        }
      }
    } catch (err) {
      setError('Failed to save region');
    }
  };

  const handleCreate = () => {
    setEditingRegion(null);
    setFormData({
      name: '',
      nameMm: '',
      code: '',
      description: '',
    });
    setShowModal(true);
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="regions-page">
        <div className="page-header">
          <h1>Regions Management</h1>
          <button onClick={handleCreate} className="btn-primary">
            Add Region
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Name (Myanmar)</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.id}>
                <td>{region.code}</td>
                <td>{region.name}</td>
                <td>{region.nameMm}</td>
                <td>{region.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(region)} className="btn-small btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(region.id)} className="btn-small btn-delete">
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
              <h2>{editingRegion ? 'Edit Region' : 'Add Region'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
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
                    required
                  />
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

export default Regions;
