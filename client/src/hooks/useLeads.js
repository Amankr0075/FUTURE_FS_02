import { useState, useEffect, useCallback } from 'react';
import { leadService } from '../services';

export const useLeads = (initialParams = {}) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [params, setParams] = useState({ page: 1, limit: 10, sort: '-createdAt', ...initialParams });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await leadService.getLeads(params);
      setLeads(data.data);
      setPagination({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateParams = (newParams) => setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
  const setPage = (page) => setParams((prev) => ({ ...prev, page }));

  return { leads, loading, error, pagination, params, updateParams, setPage, refetch: fetchLeads };
};
