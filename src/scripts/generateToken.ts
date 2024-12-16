import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
  return token;
};

// Get userId from command line argument
const userId = process.argv[2];

if (!userId) {
  console.error('Please provide a userId as an argument');
  console.log('Usage: npm run generate-token <userId>');
  process.exit(1);
}

try {
  const token = generateToken(userId);
  console.log('\nGenerated Token:');
  console.log('----------------');
  console.log(token);
  console.log('\nUse this token in the Authorization header:');
  console.log('Bearer', token);
  console.log('\nExample curl command:');
  console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3000/api/meetings`);
} catch (error) {
  console.error('Error generating token:', error);
  process.exit(1);
} 