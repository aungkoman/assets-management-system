import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { locationService } from '../services/locationService';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Building',
    townshipId: '',
    parent: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationService.getLocations();
      if (response.status) {
        setLocations(response.data);
      }
    } catch (err) {
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || '',
      category: location.category,
      townshipId: location.townshipId || '',
      parent: location.parent || '',
      address: location.address || {
        street: '',
        city: '',
        zipCode: '',
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    
    try {
      const response = await locationService.deleteLocation(id);
      if (response.status) {
        fetchLocations();
      }
    } catch (err) {
      setError('Failed to delete location');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        parent: formData.parent || null,
        townshipId: formData.townshipId || null,
      };
      
      if (editingLocation) {
        const response = await locationService.updateLocation(editingLocation.id, data);
        if (response.status) {
          setShowModal(false);
          fetchLocations();
        }
      } else {
        const response = await locationService.createLocation(data);
        if (response.status) {
          setShowModal(false);
          fetchLocations();
        }
      }
    } catch (err) {
      setError('Failed to save location');
    }
  };

  const handleCreate = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      description: '',
      category: 'Building',
      townshipId: '',
      parent: '',
      address: {
        street: '',
        city: '',
        zipCode: '',
      },
    });
    setShowModal(true);
  };

  const getBuildingLocations = () => {
    return locations.filter(loc => loc.category === 'Building' && !loc.parent);
  };

  const getChildLocations = (parentId) => {
    return locations.filter(loc => loc.parent === parentId);
  };

  const renderLocationTree = (parentId = null, level = 0) => {
    const childLocations = parentId 
      ? getChildLocations(parentId)
      : getBuildingLocations();

    if (childLocations.length === 0) return null;

    return childLocations.map(location => (
      <div key={location.id} className="location-tree-item" style={{ marginLeft: level * 20 }}>
        <div className="location-row">
          <span className="location-category">{location.category}</span>
          <span className="location-name">{location.name}</span>
          <span className="location-description">{location.description || ''}</span>
          <div className="location-actions">
            <button onClick={() => handleEdit(location)} className="btn-small btn-edit">
              Edit
            </button>
            <button onClick={() => handleDelete(location.id)} className="btn-small btn-delete">
              Delete
            </button>
          </div>
        </div>
        {renderLocationTree(location.id, level + 1)}
      </div>
    ));
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="locations-page">
        <div className="page-header">
          <h1>Locations Management</h1>
          <button onClick={handleCreate} className="btn-primary">
            Add Location
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        
        <div className="locations-tree">
          {renderLocationTree()}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingLocation ? 'Edit Location' : 'Add Location'}</h2>
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
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Building">Building</option>
                    <option value="Floor">Floor</option>
                    <option value="Room">Room</option>
                    <option value="Rack">Rack</option>
                    <option value="Desk">Desk</option>
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
                  <label>Parent Location (optional)</label>
                  <select
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  >
                    <option value="">None (Top Level)</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.category} - {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, zipCode: e.target.value }
                    })}
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

export default Locations;
