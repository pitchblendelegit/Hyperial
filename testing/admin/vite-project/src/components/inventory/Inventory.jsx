// src/components/Inventory.jsx
import React, { useEffect, useState } from 'react';
import { getAllMaterials, addNewMaterial, updateMaterial, deleteMaterial } from './inventoryAPI.js';
import './Inventory.css';

const Inventory = () => {
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({ MaterialName: '', Description: '', Unit: '', Quantity: '', Location: '' });
    const [editMaterial, setEditMaterial] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        const materials = await getAllMaterials();
        setMaterials(materials);
    };

    const handleAddMaterial = async () => {
        await addNewMaterial(newMaterial);
        fetchMaterials();
    };

    const handleUpdateMaterial = async () => {
        await updateMaterial(editMaterial.WarehouseMaterialID, editMaterial);
        fetchMaterials();
        setEditMaterial(null);
    };

    const handleDeleteMaterial = async (id) => {
        await deleteMaterial(id);
        fetchMaterials();
    };

    return (
        <div className="inventory-container">
            <h1>Inventory</h1>
            <div className="add-material">
                <h2>Add New Material</h2>
                <input type="text" placeholder="Material Name" value={newMaterial.MaterialName} onChange={(e) => setNewMaterial({ ...newMaterial, MaterialName: e.target.value })} />
                <input type="text" placeholder="Description" value={newMaterial.Description} onChange={(e) => setNewMaterial({ ...newMaterial, Description: e.target.value })} />
                <input type="text" placeholder="Unit" value={newMaterial.Unit} onChange={(e) => setNewMaterial({ ...newMaterial, Unit: e.target.value })} />
                <input type="number" placeholder="Quantity" value={newMaterial.Quantity} onChange={(e) => setNewMaterial({ ...newMaterial, Quantity: e.target.value })} />
                <input type="text" placeholder="Location" value={newMaterial.Location} onChange={(e) => setNewMaterial({ ...newMaterial, Location: e.target.value })} />
                <button onClick={handleAddMaterial}>Add Material</button>
            </div>
            <div className="materials-list">
                <h2>Materials List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Unit</th>
                            <th>Quantity</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map(material => (
                            <tr key={material.WarehouseMaterialID}>
                                <td>{material.WarehouseMaterialID}</td>
                                <td>{material.MaterialName}</td>
                                <td>{material.Description}</td>
                                <td>{material.Unit}</td>
                                <td>{material.Quantity}</td>
                                <td>{material.Location}</td>
                                <td>
                                    <button onClick={() => setEditMaterial(material)}>Edit</button>
                                    <button onClick={() => handleDeleteMaterial(material.WarehouseMaterialID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editMaterial && (
                    <div className="edit-material">
                        <h2>Edit Material</h2>
                        <input type="text" placeholder="Material Name" value={editMaterial.MaterialName} onChange={(e) => setEditMaterial({ ...editMaterial, MaterialName: e.target.value })} />
                        <input type="text" placeholder="Description" value={editMaterial.Description} onChange={(e) => setEditMaterial({ ...editMaterial, Description: e.target.value })} />
                        <input type="text" placeholder="Unit" value={editMaterial.Unit} onChange={(e) => setEditMaterial({ ...editMaterial, Unit: e.target.value })} />
                        <input type="number" placeholder="Quantity" value={editMaterial.Quantity} onChange={(e) => setEditMaterial({ ...editMaterial, Quantity: e.target.value })} />
                        <input type="text" placeholder="Location" value={editMaterial.Location} onChange={(e) => setEditMaterial({ ...editMaterial, Location: e.target.value })} />
                        <button onClick={handleUpdateMaterial}>Update Material</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Inventory;
