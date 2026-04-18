import { apiClient } from '../lib/api-client';
import { Tenant } from '../types/api';

export const getTenants = async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/tenants');
    return response.data;
};

export const createTenant = async (tenantData: Omit<Tenant, 'id'>): Promise<Tenant> => {
    const response = await apiClient.post('/tenants', tenantData);
    return response.data;
};

export const updateTenant = async (tenantId: string, tenantData: Partial<Tenant>): Promise<Tenant> => {
    const response = await apiClient.put(`/tenants/${tenantId}`, tenantData);
    return response.data;
};

export const deleteTenant = async (tenantId: string): Promise<void> => {
    await apiClient.delete(`/tenants/${tenantId}`);
};