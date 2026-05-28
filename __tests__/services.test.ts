import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { connectDB } from '@/lib/db';
import { ChatService } from '@/services/chat.service';
import { AuditService } from '@/services/audit.service';
import { User } from '@/models/User';
import { Project } from '@/models/Project';
import { Conversation } from '@/models/Conversation';
import { AuditEvent } from '@/models/AuditEvent';
import { Message } from '@/models/Message';

describe('ChatService', () => {
  let projectId: string;
  let userId: string;
  let conversationId: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await Message.deleteMany({});
    await AuditEvent.deleteMany({});
    await Conversation.deleteMany({});
  });

  it('should create a conversation and log audit event', async () => {
    const user = await User.findOne({ role: 'admin' });
    const project = await Project.findOne();

    if (!user || !project) {
      throw new Error('Demo user or project not found');
    }

    userId = user._id.toString();
    projectId = project._id.toString();

    const conversation = await ChatService.createConversation(
      userId,
      projectId,
      project._id.toString()
    );

    conversationId = conversation._id.toString();

    expect(conversation).toBeDefined();
    expect(conversation.userId.toString()).toBe(userId);
    expect(conversation.projectId.toString()).toBe(projectId);

    const auditEvents = await AuditEvent.find({
      action: 'chat.conversation_created',
      resourceId: conversationId,
    });

    expect(auditEvents.length).toBeGreaterThan(0);
  });

  it('should send message and create audit logs', async () => {
    const result = await ChatService.sendMessage({
      conversationId,
      projectId,
      userId,
      content: 'Hello, world!',
    });

    expect(result.message).toBeDefined();
    expect(result.message.content).toBe('Hello, world!');

    const auditEvents = await AuditEvent.find({
      action: 'chat.message_sent',
    });

    expect(auditEvents.length).toBeGreaterThan(0);
  });

  it('should retrieve conversation messages', async () => {
    const messages = await ChatService.getConversationMessages(conversationId, userId, projectId);

    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
  });
});

describe('AuditService', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await AuditEvent.deleteMany({});
  });

  it('should log audit events', async () => {
    const project = await Project.findOne();
    if (!project) throw new Error('Project not found');

    const event = await AuditService.logEvent({
      projectId: project._id.toString(),
      actorRole: 'user',
      action: 'test.event_logged',
      resourceType: 'test',
      details: { testKey: 'testValue' },
    });

    expect(event).toBeDefined();
    expect(event.action).toBe('test.event_logged');
  });

  it('should retrieve recent events', async () => {
    const project = await Project.findOne();
    if (!project) throw new Error('Project not found');

    const events = await AuditService.getRecentEvents(project._id.toString(), 10);

    expect(Array.isArray(events)).toBe(true);
  });
});
