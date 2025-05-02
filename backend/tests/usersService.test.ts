import { describe, it, expect, beforeEach, jest, afterEach } from 'jest';
import { UsersService } from '../services/usersService';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => {
  const mockClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
      admin: {
        createUser: jest.fn(),
        updateUserById: jest.fn(),
        deleteUser: jest.fn()
      }
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    range: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  };

  return {
    createClient: jest.fn().mockReturnValue(mockClient)
  };
});

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    usersService = new UsersService();
    mockClient = require('@supabase/supabase-js').createClient();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Setup mock responses
      const mockAuthData = {
        user: { id: 'test-user-id' }
      };
      mockClient.auth.admin.createUser.mockResolvedValue({ data: mockAuthData, error: null });
      
      const mockUserData = [{ id: 'test-user-id', email: 'test@example.com' }];
      mockClient.insert.mockResolvedValue({ data: mockUserData, error: null });

      // Call the method
      const result = await usersService.create({
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      });

      // Verify results
      expect(mockClient.auth.admin.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        }
      });
      
      expect(mockClient.insert).toHaveBeenCalled();
      expect(result).toEqual(mockUserData[0]);
    });

    it('should handle auth error when creating a user', async () => {
      // Setup mock responses
      mockClient.auth.admin.createUser.mockResolvedValue({ 
        data: null, 
        error: { message: 'Email already in use' } 
      });

      // Call the method and expect an error
      await expect(usersService.create({
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      })).rejects.toEqual({ message: 'Email already in use' });
    });
  });

  describe('getById', () => {
    it('should get a user by ID successfully', async () => {
      // Setup mock response
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      mockClient.single.mockResolvedValue({ data: mockUser, error: null });

      // Call the method
      const result = await usersService.getById('test-id');

      // Verify results
      expect(mockClient.select).toHaveBeenCalled();
      expect(mockClient.eq).toHaveBeenCalledWith('id', 'test-id');
      expect(mockClient.single).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      // Setup mock response for not found
      mockClient.single.mockResolvedValue({ 
        data: null, 
        error: { code: 'PGRST116' } 
      });

      // Call the method
      const result = await usersService.getById('non-existent-id');

      // Verify results
      expect(result).toBeNull();
    });
  });

  describe('list', () => {
    it('should list users with filters and pagination', async () => {
      // Setup mock response
      const mockUsers = [
        { id: 'user-1', email: 'user1@example.com' },
        { id: 'user-2', email: 'user2@example.com' }
      ];
      mockClient.range.mockResolvedValue({ 
        data: mockUsers, 
        error: null,
        count: 2
      });

      // Call the method
      const result = await usersService.list({ email: 'example.com' }, 1, 10);

      // Verify results
      expect(mockClient.select).toHaveBeenCalled();
      expect(mockClient.range).toHaveBeenCalledWith(0, 9);
      expect(result).toEqual({ data: mockUsers, count: 2 });
    });
  });

  describe('updateById', () => {
    it('should update a user successfully', async () => {
      // Setup mock responses
      const mockUpdateData = [{ id: 'user-id', email: 'updated@example.com' }];
      mockClient.update.mockResolvedValue({ data: mockUpdateData, error: null });

      // Call the method
      const result = await usersService.updateById('user-id', { 
        firstName: 'Updated', 
        lastName: 'Name' 
      });

      // Verify results
      expect(mockClient.update).toHaveBeenCalled();
      expect(result).toEqual(mockUpdateData[0]);
    });
  });

  describe('deleteById', () => {
    it('should delete a user successfully', async () => {
      // Setup mock responses
      mockClient.auth.admin.deleteUser.mockResolvedValue({ error: null });
      mockClient.delete.mockResolvedValue({ error: null });

      // Call the method
      await usersService.deleteById('user-id');

      // Verify results
      expect(mockClient.auth.admin.deleteUser).toHaveBeenCalledWith('user-id');
      expect(mockClient.delete).toHaveBeenCalled();
    });
  });

  // Add more tests for other methods...
});