const { addUser } = require('../controllers/userController');
const User = require('../models/users');

jest.mock('../models/users');

describe('addUser controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Ibrahim',
        email: 'ibrahim@test.com',
        phone: '1234567890'
      },
      file: {
        filename: 'profile.png'
      },
      session: {}
    };

    res = {
      redirect: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('should create a new user successfully', async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    User.mockImplementation(() => ({
      save: saveMock
    }));

    await addUser(req, res);

    expect(User).toHaveBeenCalledWith({
      name: 'Ibrahim',
      email: 'ibrahim@test.com',
      phone: '1234567890',
      image: 'profile.png'
    });

    expect(saveMock).toHaveBeenCalledTimes(1);

    expect(req.session.message).toEqual({
      type: 'success',
      message: 'User added successfully'
    });

    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('should use default image when no file is uploaded', async () => {
    req.file = undefined;

    const saveMock = jest.fn().mockResolvedValue(true);

    User.mockImplementation(() => ({
      save: saveMock
    }));

    await addUser(req, res);

    expect(User).toHaveBeenCalledWith({
      name: 'Ibrahim',
      email: 'ibrahim@test.com',
      phone: '1234567890',
      image: 'user_unknown.png'
    });

    expect(req.session.message).toEqual({
      type: 'success',
      message: 'User added successfully'
    });

    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('should handle database save errors', async () => {
    const saveMock = jest.fn().mockRejectedValue(new Error('Database error'));

    User.mockImplementation(() => ({
      save: saveMock
    }));

    await addUser(req, res);

    expect(req.session.message).toEqual({
      type: 'danger',
      message: 'Database error'
    });

    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('should still redirect even when save fails', async () => {
    const saveMock = jest.fn().mockRejectedValue(new Error('Save failed'));

    User.mockImplementation(() => ({
      save: saveMock
    }));

    await addUser(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/');
  });
});