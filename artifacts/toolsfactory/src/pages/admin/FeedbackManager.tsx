import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useListFeedback, useDeleteFeedback, useUpdateFeedback } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Trash2, Check } from 'lucide-react';

export default function FeedbackManager() {
  const { data: feedbackData, refetch } = useListFeedback();
  const deleteFb = useDeleteFeedback();
  const updateFb = useUpdateFeedback();

  const handleDelete = async (id: number) => {
    await deleteFb.mutateAsync({ pathParams: { id } });
    refetch();
  };

  const handleResolve = async (id: number) => {
    await updateFb.mutateAsync({ pathParams: { id }, body: { status: 'resolved' } });
    refetch();
  };

  return (
    <AdminLayout title="Feedback Manager">
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tool</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Comment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {feedbackData?.feedback?.map(fb => (
                <tr key={fb.id}>
                  <td className="px-6 py-4 text-sm">{fb.toolName}</td>
                  <td className="px-6 py-4 text-sm">⭐ {fb.rating}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground truncate">{fb.comment || '-'}</td>
                  <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{fb.status}</span></td>
                  <td className="px-6 py-4 text-sm">{new Date(fb.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {fb.status === 'pending' && (
                      <Button size="sm" variant="outline" onClick={() => handleResolve(fb.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(fb.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
