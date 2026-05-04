import mongoose from 'mongoose';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { ProductInstance } from '../models/ProductInstance';
import { AdminDashboardConfig } from '../models/AdminDashboardConfig';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-saas-platform';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await ProductInstance.deleteMany({});
    await AdminDashboardConfig.deleteMany({});

    const userId = new mongoose.Types.ObjectId('000000000000000000000001');
    const projectId = new mongoose.Types.ObjectId('000000000000000000000002');
    const productInstanceId = new mongoose.Types.ObjectId('000000000000000000000003');

    console.log('Creating demo project...');
    const project = await Project.create({
      _id: projectId,
      name: 'Demo SaaS Project',
      slug: 'demo-saas',
      description: 'Multi-tenant AI platform demo',
      enabledIntegrations: {
        shopify: true,
        crm: true,
      },
    });

    console.log('Creating demo user...');
    const user = await User.create({
      _id: userId,
      email: 'admin@demo.com',
      name: 'Demo Admin',
      projectIds: [projectId],
      role: 'admin',
    });

    console.log('Creating product instance...');
    const productInstance = await ProductInstance.create({
      _id: productInstanceId,
      projectId: projectId,
      name: 'Main AI Assistant',
      aiConfig: {
        systemPrompt:
          'You are a helpful AI assistant for a multi-tenant SaaS platform. You have access to Shopify and CRM integrations. When users ask about products, orders, leads, or customers, use the integration data provided to give accurate, helpful responses.',
        temperature: 0.7,
        maxTokens: 2000,
      },
    });

    console.log('Creating admin dashboard config...');
    const dashboardConfig = await AdminDashboardConfig.create({
      projectId: projectId,
      layout: {
        widgets: [
          {
            id: 'stat-total-users',
            type: 'stat-card',
            title: 'Total Users',
            config: {
              statKey: 'totalUsers',
              description: 'Registered users',
            },
            order: 1,
          },
          {
            id: 'stat-conversations',
            type: 'stat-card',
            title: 'Conversations',
            config: {
              statKey: 'totalConversations',
              description: 'Total chat sessions',
            },
            order: 2,
          },
          {
            id: 'stat-messages',
            type: 'stat-card',
            title: 'Messages',
            config: {
              statKey: 'totalMessages',
              description: 'Total messages sent',
            },
            order: 3,
          },
          {
            id: 'stat-active-today',
            type: 'stat-card',
            title: 'Active Today',
            config: {
              statKey: 'activeToday',
              description: 'Messages today',
            },
            order: 4,
          },
          {
            id: 'integrations',
            type: 'integration-status',
            title: 'Integrations',
            config: {},
            order: 5,
          },
          {
            id: 'activity-feed',
            type: 'activity-feed',
            title: 'Recent Activity',
            config: {},
            order: 6,
          },
        ],
      },
    });

    console.log('\n✅ Seed completed successfully!');
    console.log('\nCreated:');
    console.log(`  - User: ${user.email} (${user.role})`);
    console.log(`  - Project: ${project.name} (${project.slug})`);
    console.log(`  - Product Instance: ${productInstance.name}`);
    console.log(`  - Dashboard Config: ${dashboardConfig.layout.widgets.length} widgets`);
    console.log('\nIntegrations enabled:');
    console.log(`  - Shopify: ${project.enabledIntegrations.shopify ? '✓' : '✗'}`);
    console.log(`  - CRM: ${project.enabledIntegrations.crm ? '✓' : '✗'}`);
    console.log('\nDemo IDs:');
    console.log(`  - User ID: ${userId}`);
    console.log(`  - Project ID: ${projectId}`);
    console.log(`  - Product Instance ID: ${productInstanceId}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
