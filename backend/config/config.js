import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease check your .env file in the backend directory.');
}

// Database configuration
export const dbConfig = {
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};

// Server configuration
export const serverConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// JWT configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
  expire: process.env.JWT_EXPIRE || '7d',
};

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  name: 'sessionId',
  rolling: true,
};

// Cloudinary configuration
export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// File upload configuration
export const uploadConfig = {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  cloudinaryFolder: 'event-posters',
};

// Email configuration
export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
};

// Security configuration
export const securityConfig = {
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
};

// CORS configuration
export const corsConfig = {
  allowedOrigins: [
    "https://calander-frontend.vercel.app",
    /^http:\/\/localhost:\d+$/,
    /^https:\/\/localhost:\d+$/,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: [
    "Content-Range", 
    "X-Content-Range",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials"
  ],
  preflightContinue: false,
  maxAge: 86400,
};

// Debug configuration
export const debugConfig = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  isVercel: process.env.VERCEL === '1',
};

// Export all configurations
export default {
  db: dbConfig,
  server: serverConfig,
  jwt: jwtConfig,
  session: sessionConfig,
  cloudinary: cloudinaryConfig,
  upload: uploadConfig,
  email: emailConfig,
  rateLimit: rateLimitConfig,
  security: securityConfig,
  cors: corsConfig,
  debug: debugConfig,
};
