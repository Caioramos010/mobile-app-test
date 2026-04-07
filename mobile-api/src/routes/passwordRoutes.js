const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  getPasswords,
  savePassword,
  deletePassword,
  generatePasswordRoute,
} = require('../controllers/passwordController');

router.use(authMiddleware);

router.get('/generate', generatePasswordRoute);   // Gera senha aleatória
router.get('/', getPasswords);                    // Lista senhas salvas
router.post('/', savePassword);                   // Salva senha
router.delete('/:id', deletePassword);            // Deleta senha

module.exports = router;