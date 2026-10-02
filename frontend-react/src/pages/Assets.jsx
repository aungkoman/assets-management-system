import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { assetService } from '../services/assetService';
import { locationService } from '../services/locationService';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: 'Other',
    status: 'Active',
    location: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    serialNumber: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchAssets = async (page = 1) => {
    try {
      setLoading(true);
      const response = await assetService.getAssets({ page, limit: 10 });
      if (response.status) {
        setAssets(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationService.getLocations();
      if (response.status) {
        setLocations(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch locations');
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchLocations();
  }, []);

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      code: asset.code,
      description: asset.description || '',
      category: asset.category,
      status: asset.status,
      location: asset.location?.id || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      purchasePrice: asset.purchasePrice || '',
      currentValue: asset.currentValue || '',
      serialNumber: asset.serialNumber || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      const response = await assetService.deleteAsset(id);
      if (response.status) {
        fetchAssets(pagination.currentPage);
      }
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        currentValue: parseFloat(formData.currentValue) || 0,
        purchaseDate: formData.purchaseDate || null,
      };

      if (editingAsset) {
        const response = await assetService.updateAsset(editingAsset.id, data);
        if (response.status) {
          setShowModal(false);
          fetchAssets(pagination.currentPage);
        }
      } else {
        const response = await assetService.createAsset(data);
        if (response.status) {
          setShowModal(false);
          fetchAssets(pagination.currentPage);
        }
      }
    } catch (err) {
      setError('Failed to save asset');
    }
  };

  const handleCreate = () => {
    setEditingAsset(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      category: 'Other',
      status: 'Active',
      location: '',
      purchaseDate: '',
      purchasePrice: '',
      currentValue: '',
      serialNumber: '',
    });
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    fetchAssets(page);
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Inactive': return '#6b7280';
      case 'Maintenance': return '#f59e0b';
      case 'Retired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="assets-page">
        <div className="page-header">
          <h1>Assets Management</h1>
          <button onClick={handleCreate} className="btn-primary">
            Add Asset
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Location</th>
              <th>Purchase Price</th>
              <th>Current Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.code}</td>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>
                  <span 
                    style={{ 
                      color: 'white',
                      backgroundColor: getStatusColor(asset.status),
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}
                  >
                    {asset.status}
                  </span>
                </td>
                <td>{asset.location?.name || getLocationName(asset.location)}</td>
                <td>${asset.purchasePrice?.toLocaleString() || 0}</td>
                <td>${asset.currentValue?.toLocaleString() || 0}</td>
                <td>
                  <button onClick={() => handleEdit(asset)} className="btn-small btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(asset.id)} className="btn-small btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="btn-small"
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="btn-small"
            >
              Next
            </button>
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingAsset ? 'Edit Asset' : 'Add Asset'}</h2>
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
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.category} - {location.name}
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
                <div className="form-group">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Purchase Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Current Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
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

export default Assets;
