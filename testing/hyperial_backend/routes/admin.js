const express = require('express');
const WarehouseMaterial = require('../models/WarehouseMaterial.js');
const router = express.Router();

// Mendapatkan semua warehouse materials
router.get('/allMaterials', async (req, res) => {
    try {
        const materials = await WarehouseMaterial.findAll();
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mendapatkan warehouse material berdasarkan ID
router.get('/getMaterial/:id', async (req, res) => {
    try {
        const material = await WarehouseMaterial.findByPk(req.params.id);
        if (material) {
            res.json(material);
        } else {
            res.status(404).json({ error: 'Material not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Menambahkan warehouse material baru
router.post('/newMaterial', async (req, res) => {
    try {
        const newMaterial = await WarehouseMaterial.create(req.body);
        res.status(201).json(newMaterial);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mengupdate warehouse material
router.put('/editMaterial/:id', async (req, res) => {
    try {
        const material = await WarehouseMaterial.findByPk(req.params.id);
        if (material) {
            await material.update(req.body);
            res.json(material);
        } else {
            res.status(404).json({ error: 'Material not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Menghapus warehouse material
router.delete('/deleteMaterial/:id', async (req, res) => {
    try {
        const material = await WarehouseMaterial.findByPk(req.params.id);
        if (material) {
            await material.destroy();
            res.json({ message: 'Material deleted' });
        } else {
            res.status(404).json({ error: 'Material not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

return router;
