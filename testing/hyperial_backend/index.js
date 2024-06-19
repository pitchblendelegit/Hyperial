const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const pkg = require('body-parser');
const sequelize = require('./config/database.js'); // Impor instance sequelize
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authen.js');
const vendorRoutes = require('./routes/vendors.js');
const adminRoutes = require('./routes/admin.js');
const orderRoutes = require('./routes/order.js')

const { json: bodyParserJson } = pkg;
const JWT_SECRET = 'your_secret_key_here';
const app = express();
const port = 5000;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3306'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParserJson());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Use routes
app.use('/authen', authRoutes);
app.use('/vendors', vendorRoutes);
app.use('/admin', adminRoutes);
app.use('/order', orderRoutes);

app.get('/', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.json({ valid: false });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.json({ valid: false });
    }
    req.user = user;
    res.json({ valid: true, role: user.Role });
  });
});

app.get('/logout', (req, res) => {
  res.clearCookie('authorization'); // Menghapus cookie dengan nama 'authorization'
  res.status(200).json("success");
});

// Sync database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  // Jalankan server
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
});
