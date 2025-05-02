import React, { useEffect, useState } from 'react';
import { PropertyOwner } from '../../backend/services/PropertyOwnerService';

export function PropertyOwnerList() {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOwners() {
      try {
        const response = await fetch('/api/property-owners');
        const result = await response.json();
        
        if (result.success) {
          setOwners(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch property owners');
      } finally {
        setLoading(false);
      }
    }

    fetchOwners();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Property Owners</h2>
      <div className="grid gap-4">
        {owners.map((owner) => (
          <div key={owner.id} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold">{owner.full_name}</h3>
            <p className="text-gray-600">{owner.email}</p>
            <p className="text-sm text-gray-500">Role: {owner.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 