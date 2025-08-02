const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
require('dotenv').config();

const defaultUsers = [
  {
    email: 'user1@fake.com',
    password: 'password123',
    role: 'user'
  },
  {
    email: 'user2@fake.com',
    password: 'password123',
    role: 'user'
  },
  {
    email: 'user3@fake.com',
    password: 'password123',
    role: 'user'
  },
  {
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    email: 'agent@help.com',
    password: 'agent123',
    role: 'support'
  }
];

const sampleTickets = [
  {
    title: 'Website Login Issue',
    description: 'I cannot log in to the website. Getting an error message when I try to access my account.',
    priority: 'high',
    status: 'open',
    category: 'technical',
    tags: ['login', 'authentication', 'website']
  },
  {
    title: 'Payment Processing Error',
    description: 'When I try to make a payment, the system shows an error and doesn\'t complete the transaction.',
    priority: 'urgent',
    status: 'in-progress',
    category: 'billing',
    tags: ['payment', 'billing', 'transaction']
  },
  {
    title: 'Mobile App Crashes',
    description: 'The mobile app crashes every time I try to open the dashboard. This happens on both iOS and Android.',
    priority: 'high',
    status: 'open',
    category: 'bug',
    tags: ['mobile', 'app', 'crash', 'ios', 'android']
  },
  {
    title: 'Feature Request: Dark Mode',
    description: 'It would be great to have a dark mode option for the application. This would help reduce eye strain during night usage.',
    priority: 'low',
    status: 'open',
    category: 'feature-request',
    tags: ['ui', 'dark-mode', 'accessibility']
  },
  {
    title: 'Email Notifications Not Working',
    description: 'I\'m not receiving email notifications for ticket updates. I\'ve checked my spam folder and email settings.',
    priority: 'medium',
    status: 'resolved',
    category: 'technical',
    tags: ['email', 'notifications', 'settings']
  },
  {
    title: 'Account Settings Update',
    description: 'I need to update my account information but the settings page is not loading properly.',
    priority: 'medium',
    status: 'closed',
    category: 'general',
    tags: ['account', 'settings', 'profile']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quick-desk');
    console.log('Connected to MongoDB');

    // Clear existing users and tickets
    await User.deleteMany({});
    await Ticket.deleteMany({});
    console.log('Cleared existing users and tickets');

    // Create default users
    const createdUsers = await User.create(defaultUsers);
    console.log(`Created ${createdUsers.length} default users:`);
    
    createdUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

    // Create sample tickets for user1
    const user1 = createdUsers.find(user => user.email === 'user1@fake.com');
    if (user1) {
      const ticketsWithUser = sampleTickets.map(ticket => ({
        ...ticket,
        createdBy: user1._id
      }));
      
      const createdTickets = await Ticket.create(ticketsWithUser);
      console.log(`Created ${createdTickets.length} sample tickets for ${user1.email}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 