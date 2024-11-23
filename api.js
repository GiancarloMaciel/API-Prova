const express = require('express');
const app = express();

app.use(express.json());

// Simulando banco de dados
let users = [];
let products = [];
let userId = 1;
let productId = 1;

// Funções de validação
function validateUser(user) {
  const errors = [];
  if (!user.name || user.name.length < 3 || user.name.length > 150) {
    errors.push("'Nome' deve conter entre 3 e 150 caracteres");
  }
  if (!/^\d{11}$/.test(user.cpf)) {
    errors.push("'Cpf' deve conter apenas números e ter 11 dígitos");
  }
  if (!user.email || user.email.length < 3 || user.email.length > 100 || !user.email.includes('@') || !user.email.includes('.')) {
    errors.push("'Email' inválido");
  }
  return errors;
}

function validateProduct(product) {
  const errors = [];
  if (!product.name || product.name.length < 3 || product.name.length > 100) {
    errors.push("'Nome' deve conter entre 3 e 100 caracteres");
  }
  if (product.price === undefined || product.price <= 0) {
    errors.push("'Preço' deve ser maior que 0");
  }
  return errors;
}

// Endpoints para usuários
app.get('/users', (req, res) => res.json(users));

app.post('/users', (req, res) => {
  const user = req.body;
  const errors = validateUser(user);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  user.id = userId++;
  users.push(user);
  res.json({ message: "Usuário cadastrado com sucesso" });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) return res.json(user);
  res.status(404).json({ message: "Usuário não encontrado" });
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
  const updatedUser = req.body;
  const errors = validateUser(updatedUser);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  Object.assign(user, updatedUser);
  res.json({ message: "Usuário atualizado com sucesso" });
});

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Usuário não encontrado" });
  users.splice(index, 1);
  res.json({ message: "Usuário removido com sucesso" });
});

// Endpoints para produtos
app.get('/products', (req, res) => res.json(products));

app.post('/products', (req, res) => {
  const product = req.body;
  const errors = validateProduct(product);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  product.id = productId++;
  products.push(product);
  res.json({ message: "Produto cadastrado com sucesso" });
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) return res.json(product);
  res.status(404).json({ message: "Produto não encontrado" });
});

app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Produto não encontrado" });
  const updatedProduct = req.body;
  const errors = validateProduct(updatedProduct);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  Object.assign(product, updatedProduct);
  res.json({ message: "Produto atualizado com sucesso" });
});

app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Produto não encontrado" });
  products.splice(index, 1);
  res.json({ message: "Produto removido com sucesso" });
});

// Inicializando servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse em: http://localhost:${PORT}`); // Exibe o link completo para o acesso
});
