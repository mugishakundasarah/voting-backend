const router = require("express").Router()
const { authenticate } = require("../utils/AuthenticateToken")
const authRoutes = require("./auth.controller")
const candidateRoutes = require("./candidate.controller")

router.use("/auth", authRoutes)
router.use("/candidates",  authenticate ,candidateRoutes)

module.exports = router

