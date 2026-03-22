jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
  getConnection: jest.fn(),
}));

const db = require('../../src/config/db');
const eventController = require('../../src/controllers/event.controller');

function mockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function mockConnection(queryMock) {
  return {
    beginTransaction: jest.fn().mockResolvedValue(undefined),
    query: queryMock,
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    release: jest.fn(),
  };
}

describe('event.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createEvent should create pending event', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 11 }]);

    const req = {
      user: { userId: 1 },
      body: {
        title: 'Event',
        description: 'Desc',
        eventDate: '2026-04-01T10:00:00Z',
        location: 'Main Hall',
        maxParticipants: 20,
      },
    };
    const res = mockRes();
    const next = jest.fn();

    await eventController.createEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  test('createEvent should map validation error to 400', async () => {
    const req = {
      user: { userId: 1 },
      body: {
        title: '',
        description: 'Desc',
        eventDate: 'bad',
        location: '',
        maxParticipants: -1,
      },
    };
    const res = mockRes();
    const next = jest.fn();

    await eventController.createEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test('listApprovedEvents should return rows', async () => {
    db.query.mockResolvedValueOnce([[{ eventId: 1, title: 'Approved Event' }]]);

    const req = {};
    const res = mockRes();
    const next = jest.fn();

    await eventController.listApprovedEvents(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ eventId: 1, title: 'Approved Event' }],
    });
  });

  test('listMyRegistrations should return rows', async () => {
    db.query.mockResolvedValueOnce([[{ registrationId: 1, eventId: 10 }]]);

    const req = { user: { userId: 4 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.listMyRegistrations(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ registrationId: 1, eventId: 10 }],
    });
  });

  test('registerForEvent should return 404 when event does not exist', async () => {
    const queryMock = jest.fn().mockResolvedValueOnce([[]]);
    const conn = mockConnection(queryMock);
    db.getConnection.mockResolvedValueOnce(conn);

    const req = { params: { eventId: '100' }, user: { userId: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.registerForEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(conn.rollback).toHaveBeenCalled();
    expect(conn.release).toHaveBeenCalled();
  });

  test('registerForEvent should reject already registered user', async () => {
    const queryMock = jest
      .fn()
      .mockResolvedValueOnce([[
        {
          event_id: 1,
          title: 'Event',
          max_participants: 10,
          approval_status: 'APPROVED',
          event_status: 'OPEN',
        },
      ]])
      .mockResolvedValueOnce([[{ reg_id: 1, status: 'REGISTERED' }]]);

    const conn = mockConnection(queryMock);
    db.getConnection.mockResolvedValueOnce(conn);

    const req = { params: { eventId: '1' }, user: { userId: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.registerForEvent(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(409);
    expect(conn.rollback).toHaveBeenCalled();
  });

  test('registerForEvent should register successfully', async () => {
    const queryMock = jest
      .fn()
      .mockResolvedValueOnce([[
        {
          event_id: 1,
          title: 'Event',
          max_participants: 10,
          approval_status: 'APPROVED',
          event_status: 'OPEN',
        },
      ]])
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ registeredCount: 1 }]])
      .mockResolvedValueOnce([{}]);

    const conn = mockConnection(queryMock);
    db.getConnection.mockResolvedValueOnce(conn);

    const req = { params: { eventId: '1' }, user: { userId: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.registerForEvent(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(conn.commit).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('cancelRegistration should return 404 when not registered', async () => {
    const queryMock = jest.fn().mockResolvedValueOnce([[]]);
    const conn = mockConnection(queryMock);
    db.getConnection.mockResolvedValueOnce(conn);

    const req = { params: { eventId: '1' }, user: { userId: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.cancelRegistration(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(conn.rollback).toHaveBeenCalled();
  });

  test('cancelRegistration should cancel successfully', async () => {
    const queryMock = jest
      .fn()
      .mockResolvedValueOnce([[{ reg_id: 5, status: 'REGISTERED' }]])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[
        {
          event_id: 1,
          max_participants: 10,
          event_status: 'OPEN',
        },
      ]])
      .mockResolvedValueOnce([[{ registeredCount: 2 }]])
      .mockResolvedValueOnce([{}]);

    const conn = mockConnection(queryMock);
    db.getConnection.mockResolvedValueOnce(conn);

    const req = { params: { eventId: '1' }, user: { userId: 2 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.cancelRegistration(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(conn.commit).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('checkInAttendee should check in registered user', async () => {
    const queryMock = jest
      .fn()
      .mockResolvedValueOnce([[{ event_id: 1, approval_status: 'APPROVED' }]])
      .mockResolvedValueOnce([[{ reg_id: 10, status: 'REGISTERED' }]])
      .mockResolvedValueOnce([{}]);
    const conn = mockConnection(queryMock);
    db.getConnection.mockResolvedValueOnce(conn);

    const req = { params: { eventId: '1' }, body: { userId: 5 }, user: { userId: 3 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.checkInAttendee(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(conn.commit).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test('submitFeedback should create feedback successfully', async () => {
    db.query
      .mockResolvedValueOnce([[{ event_id: 1 }]])
      .mockResolvedValueOnce([[{ reg_id: 10, status: 'REGISTERED', check_status: true }]])
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{}]);

    const req = { params: { eventId: '1' }, body: { rating: 4, comment: 'ดีมาก' }, user: { userId: 5 } };
    const res = mockRes();
    const next = jest.fn();

    await eventController.submitFeedback(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(next).not.toHaveBeenCalled();
  });
});
