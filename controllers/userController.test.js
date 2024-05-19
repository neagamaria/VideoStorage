const userController = require('./userController');
const User = require('../models/User');

// simulate database 
jest.mock('../models/User');

describe('createUser', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any mocked calls
  });
  
  test('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '0756432122',
        password: 'johnPassword1',
        birthDate: '1977-01-27'
      };
      const createdUser = { id: 1, ...userData };
      const req = { body: userData };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();

      const fixedDate = new Date();
      User.create.mockResolvedValue(createdUser);

      await userController.createUser(req, res, next);

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '0756432122',
        password: 'johnPassword1',
        birthDate: '1977-01-27',
        createdAt: fixedDate,
        updatedAt: fixedDate
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdUser);
      expect(next).not.toHaveBeenCalled();
    });
  
    test('should call next with error if database query fails', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '0756432122',
        password: 'johnPassword1',
        birthDate: '1977-01-27'
      };
      const req = { body: userData };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();
      const error = new Error('Database error');
      User.create.mockRejectedValue(error);
  
      await userController.createUser(req, res, next);
  
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining(userData));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });