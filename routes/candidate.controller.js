const Candidate = require("../models/Candidate");
const { candidateValidationSchema } = require("../utils/Validation");
const express = require('express');
const router = express.Router();

// API endpoint to create a new candidate
router.post('/', async (req, res) => {
    const candidateData = req.body;
  
    try {
      // Validate the candidate data using Joi
      const { error } = candidateValidationSchema.validate(candidateData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      // Check if a candidate with the same national ID already exists
      const existingCandidate = await Candidate.findOne({ nationalId: candidateData.nationalId });
      if (existingCandidate) {
        return res.status(409).json({ error: 'Candidate with the same national ID already exists' });
      }
  
      // Save the candidate data
      const candidate = new Candidate(candidateData);
      const savedCandidate = await candidate.save();
  
      return res.status(201).json(savedCandidate);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save candidate' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const candidates = await Candidate.find();
      return res.status(200).json(candidates);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  })

module.exports = router 