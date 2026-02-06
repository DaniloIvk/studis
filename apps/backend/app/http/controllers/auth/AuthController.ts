import database from '../../../core/database/database';
import Controller, { ControllerContract } from '../../../core/http/Controller';
import bcrypt from 'bcrypt';
import  UserResource  from '../../resources/UserResource';

class AuthController extends Controller {
  /**
   * POST /api/auth/login
   * Login user and create session
   */
  public async login({ request, response }: ControllerContract) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await database.user.findUnique({
        where: { email }
      });

      if (!user) {
        return response.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return response.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Create session
      request.session.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName ?? null,

        role: user.role
      };

      // Return user data (without password)
      return response.json({
        data: UserResource.make(user)
      });
    } catch (error) {
      console.error('Login error:', error);
      return response.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Destroy session
   */
  public async logout({ request, response }: ControllerContract) {
    try {
      request.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err);
          return response.status(500).json({
            error: 'Failed to logout'
          });
        }
        response.clearCookie('connect.sid');
        return response.status(204).send();
      });
    } catch (error) {
      console.error('Logout error:', error);
      return response.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  public async me({ request, response }: ControllerContract) {
    try {
      const sessionUser = request.session.user;

      if (!sessionUser) {
        return response.status(401).json({
          error: 'Not authenticated'
        });
      }

      // Fetch fresh user data from database
      const user = await database.user.findUnique({
        where: { id: sessionUser.id }
      });

      if (!user) {
        return response.status(401).json({
          error: 'User not found'
        });
      }

      return response.json({
        data: UserResource.make(user)
      });
    } catch (error) {
      console.error('Get current user error:', error);
      return response.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * PATCH /api/auth/me
   * Update current user profile
   */
  public async updateProfile({ request, response }: ControllerContract) {
    try {
      const sessionUser = request.session.user;

      if (!sessionUser) {
        return response.status(401).json({
          error: 'Not authenticated'
        });
      }

      const { firstName, lastName, phoneNumber, address, currentPassword, newPassword } = request.body;

      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return response.status(400).json({
            error: 'Current password is required to set new password'
          });
        }

        const user = await database.user.findUnique({
          where: { id: sessionUser.id }
        });

        if (!user) {
          return response.status(401).json({
            error: 'User not found'
          });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
          return response.status(401).json({
            error: 'Current password is incorrect'
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await database.user.update({
          where: { id: sessionUser.id },
          data: {
            firstName,
            lastName,
            phoneNumber,
            address,
            password: hashedPassword
          }
        });

        // Update session
        sessionUser.firstName = updatedUser.firstName ?? '';
        sessionUser.lastName = updatedUser.lastName ?? '';

        return response.json({
          data: UserResource.make(updatedUser)
        });
      }

      // Update without password change
      const updatedUser = await database.user.update({
        where: { id: sessionUser.id },
        data: {
          firstName,
          lastName,
          phoneNumber,
          address
        }
      });

      // Update session
      sessionUser.firstName = updatedUser.firstName ?? '';
      sessionUser.lastName  = updatedUser.lastName  ?? '';

      return response.json({
        data: UserResource.make(updatedUser)
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return response.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

export default AuthController;