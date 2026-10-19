const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const dns = require('node:dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore
}
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Admin = require('./models/Admin');

const sampleProjects = [
  {
    title: 'AI Portfolio & Roadmap Tracker',
    tagline: 'Modern dynamic portfolio tracking real-time project updates',
    description: 'A full-stack portfolio management web app that allows administrators to track ongoing, upcoming, future, and pending projects while providing visitors with a transparent development roadmap.',
    status: 'ongoing',
    category: 'Full Stack',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    progress: 68,
    priority: 'high',
    startDate: new Date('2026-09-01'),
    targetDate: new Date('2026-10-30'),
    githubUrl: 'https://github.com/example/portfolio-updates',
    liveUrl: 'https://project-updates-toa1.onrender.com/',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Integrating user/admin authentication and status filters.',
    featured: true,
  },
  {
    title: 'Smart E-Commerce Multi-Vendor Platform',
    tagline: 'Scalable multivendor marketplace with live payment gateway',
    description: 'High-performance store with Stripe & Razorpay payments, cart synchronization, automated invoice generator, and merchant analytics dashboard.',
    status: 'ongoing',
    category: 'E-Commerce',
    techStack: ['Next.js', 'Express', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    progress: 45,
    priority: 'high',
    startDate: new Date('2026-08-15'),
    targetDate: new Date('2026-11-20'),
    githubUrl: 'https://github.com/example/ecommerce-multivendor',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Currently working on merchant settlement module.',
    featured: true,
  },
  {
    title: 'Real-Time Team Chat & Audio Rooms',
    tagline: 'Instant messaging and audio huddles built for remote engineers',
    description: 'Slack-alternative designed for developer teams featuring markdown code snippets, audio rooms, and GitHub pull request alerts.',
    status: 'upcoming',
    category: 'Web App',
    techStack: ['React', 'Socket.io', 'WebRTC', 'Node.js', 'MongoDB'],
    progress: 15,
    priority: 'medium',
    startDate: new Date('2026-11-01'),
    targetDate: new Date('2026-12-30'),
    githubUrl: 'https://github.com/example/team-chat',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'UI wireframes approved. Setting up WebRTC signaling server.',
    featured: false,
  },
  {
    title: 'Autonomous DevOps & Cloud Deployer',
    tagline: 'AI-assisted CI/CD and container orchestration assistant',
    description: 'A platform that monitors git pushes, runs automated unit and integration tests, containerizes via Docker, and auto-provisions AWS/DigitalOcean droplets.',
    status: 'future',
    category: 'DevOps / Cloud',
    techStack: ['Go', 'Docker', 'Kubernetes', 'Node.js', 'React'],
    progress: 5,
    priority: 'low',
    startDate: new Date('2027-01-10'),
    targetDate: new Date('2027-04-30'),
    githubUrl: '',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Researching Kubernetes client-go library vs custom operator.',
    featured: false,
  },
  {
    title: 'Payment Gateway Integration Service',
    tagline: 'Multi-provider payment microservice with automatic failover',
    description: 'Centralized payment gateway routing engine with automated webhook retries, refund management, and fraud detection algorithms.',
    status: 'pending',
    category: 'Backend / API',
    techStack: ['Node.js', 'Express', 'Redis', 'MongoDB'],
    progress: 30,
    priority: 'urgent',
    startDate: new Date('2026-07-01'),
    targetDate: new Date('2026-10-15'),
    githubUrl: 'https://github.com/example/payment-microservice',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Paused pending merchant KYC verification and banking partner approval.',
    featured: false,
  },
  {
    title: 'Cloud Document Scanner & OCR Engine',
    tagline: 'Extracts invoices and receipts using computer vision',
    description: 'A microservice currently on hold due to third-party OCR API license renewals and compliance audits.',
    status: 'pending',
    category: 'AI / OCR',
    techStack: ['Python', 'FastAPI', 'Node.js', 'React'],
    progress: 40,
    priority: 'medium',
    startDate: new Date('2026-06-10'),
    targetDate: new Date('2026-11-01'),
    githubUrl: '',
    liveUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Pending client data compliance certification.',
    featured: false,
  },
  {
    title: 'Enterprise CRM & Analytics Suite',
    tagline: 'Complete client relations and sales pipeline manager',
    description: 'A fully shipped customer relationship system with custom sales funnels, email automation, contact scoring, and visual report generation.',
    status: 'completed',
    category: 'Full Stack',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Chart.js'],
    progress: 100,
    priority: 'high',
    startDate: new Date('2026-03-01'),
    targetDate: new Date('2026-07-20'),
    githubUrl: 'https://github.com/example/enterprise-crm',
    liveUrl: 'https://crm-demo.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Launched to production. Active maintenance mode.',
    featured: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_tracker';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding: ${mongoUri}`);

    // Clean existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects.');

    // Insert sample projects
    await Project.insertMany(sampleProjects);
    console.log(`Seeded ${sampleProjects.length} sample projects successfully!`);

    // Ensure default admin exists
    const email = (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase().trim();
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = await Admin.create({
        email,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        name: 'Portfolio Admin',
        role: 'admin',
      });
      console.log(`Default admin created: ${email} (Password: admin123)`);
    } else {
      console.log(`Admin account exists: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
