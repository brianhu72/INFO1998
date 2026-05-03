require('dotenv').config();

const express = require('express');
const cors = require('cors');

const opportunitiesRouter = require('./routes/opportunities');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
