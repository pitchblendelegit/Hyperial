// src/api.js
const API_URL = 'http://localhost:5000/admin'; // sesuaikan dengan URL server Anda

export const getAllMaterials = async () => {
    const response = await fetch(`${API_URL}/allMaterials`);
    return response.json();
};

export const getMaterialById = async (id) => {
    const response = await fetch(`${API_URL}/getMaterial/${id}`);
    return response.json();
};

export const addNewMaterial = async (material) => {
    const response = await fetch(`${API_URL}/newMaterial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(material)
    });
    return response.json();
};

export const updateMaterial = async (id, material) => {
    const response = await fetch(`${API_URL}/editMaterial/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(material)
    });
    return response.json();
};

export const deleteMaterial = async (id) => {
    const response = await fetch(`${API_URL}/deleteMaterial/${id}`, {
        method: 'DELETE'
    });
    return response.json();
};
