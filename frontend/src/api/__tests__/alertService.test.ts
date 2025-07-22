import { alertService } from '../alertService';
import { Alert, AlertCreateRequest, AlertListFilters } from '../../types/verticalFarm';

// Mock the base service
jest.mock('../baseService');

describe('AlertService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAlert: Alert = {
    id: 1,
    container_id: 1,
    description: 'Test alert',
    severity: 'medium',
    active: true,
    created_at: '2023-01-01T00:00:00Z',
    related_object: { sensor_id: 123 }
  };

  const mockAlertRequest: AlertCreateRequest = {
    container_id: 1,
    description: 'Test alert',
    severity: 'medium',
    active: true,
    related_object: { sensor_id: 123 }
  };

  describe('getAlerts', () => {
    test('should return list of alerts', async () => {
      const mockGet = jest.spyOn(alertService as any, 'get');
      mockGet.mockResolvedValue([mockAlert]);

      const result = await alertService.getAlerts();

      expect(mockGet).toHaveBeenCalledWith('/alerts/');
      expect(result).toEqual([mockAlert]);
    });

    test('should handle filters', async () => {
      const mockGet = jest.spyOn(alertService as any, 'get');
      const mockBuildQueryString = jest.spyOn(alertService as any, 'buildQueryString');
      mockBuildQueryString.mockReturnValue('?container_id=1&active=true');
      mockGet.mockResolvedValue([mockAlert]);

      const filters: AlertListFilters = { container_id: 1, active: true };
      const result = await alertService.getAlerts(filters);

      expect(mockBuildQueryString).toHaveBeenCalledWith(filters);
      expect(mockGet).toHaveBeenCalledWith('/alerts/?container_id=1&active=true');
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('createAlert', () => {
    test('should create new alert', async () => {
      const mockPost = jest.spyOn(alertService as any, 'post');
      mockPost.mockResolvedValue(mockAlert);

      const result = await alertService.createAlert(mockAlertRequest);

      expect(mockPost).toHaveBeenCalledWith('/alerts/', mockAlertRequest);
      expect(result).toEqual(mockAlert);
    });
  });

  describe('getAlertById', () => {
    test('should return specific alert', async () => {
      const mockGet = jest.spyOn(alertService as any, 'get');
      mockGet.mockResolvedValue(mockAlert);

      const result = await alertService.getAlertById(1);

      expect(mockGet).toHaveBeenCalledWith('/alerts/1');
      expect(result).toEqual(mockAlert);
    });
  });

  describe('getAlertsByContainer', () => {
    test('should return alerts for specific container', async () => {
      const mockGetAlerts = jest.spyOn(alertService, 'getAlerts');
      mockGetAlerts.mockResolvedValue([mockAlert]);

      const result = await alertService.getAlertsByContainer(1);

      expect(mockGetAlerts).toHaveBeenCalledWith({ container_id: 1 });
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('getActiveAlerts', () => {
    test('should return active alerts only', async () => {
      const mockGetAlerts = jest.spyOn(alertService, 'getAlerts');
      mockGetAlerts.mockResolvedValue([mockAlert]);

      const result = await alertService.getActiveAlerts();

      expect(mockGetAlerts).toHaveBeenCalledWith({ active: true });
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('getAlertsBySeverity', () => {
    test('should return alerts by severity', async () => {
      const mockGetAlerts = jest.spyOn(alertService, 'getAlerts');
      mockGetAlerts.mockResolvedValue([mockAlert]);

      const result = await alertService.getAlertsBySeverity('high');

      expect(mockGetAlerts).toHaveBeenCalledWith({ severity: 'high' });
      expect(result).toEqual([mockAlert]);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const mockGet = jest.spyOn(alertService as any, 'get');
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(alertService.getAlerts()).rejects.toThrow('Network error');
    });

    test('should handle validation errors', async () => {
      const mockPost = jest.spyOn(alertService as any, 'post');
      const error = { message: 'Invalid severity level', status: 400 };
      mockPost.mockRejectedValue(error);

      await expect(alertService.createAlert(mockAlertRequest)).rejects.toEqual(error);
    });
  });
});