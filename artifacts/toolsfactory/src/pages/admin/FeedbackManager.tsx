import React from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useListFeedback, useDeleteFeedback, useUpdateFeedback } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, CheckCircle2, Star } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function FeedbackManager() {
  const { data: feedbackData, isLoading } = useListFeedback();
  const deleteMut = useDeleteFeedback();
  const updateMut = useUpdateFeedback();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this feedback?')) return;
    await deleteMut.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
    toast({ title: 'Feedback deleted' });
  };

  const handleResolve = async (id: number) => {
    await updateMut.mutateAsync({ id, data: { status: 'resolved' } });
    queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
    toast({ title: 'Marked as resolved' });
  };

  return (
    <AdminLayout title="Feedback Manager">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold">Feedback Manager</h2>
          <p className="text-muted-foreground mt-1">
            {feedbackData?.total || 0} total reviews · Review and moderate user feedback
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading feedback...</TableCell></TableRow>
            ) : feedbackData?.feedback?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No feedback yet. Once users rate tools, it will appear here.</TableCell></TableRow>
            ) : feedbackData?.feedback?.map(fb => (
              <TableRow key={fb.id}>
                <TableCell className="font-medium">
                  {fb.toolName}
                  <div className="text-xs text-muted-foreground">/tools/{fb.toolSlug}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                    ))}
                    <span className="text-sm font-medium ml-1">{fb.rating}/5</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-muted-foreground line-clamp-2">{fb.comment || <span className="italic opacity-60">No comment</span>}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={fb.status === 'resolved' ? 'secondary' : 'outline'} className={fb.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'text-amber-600 border-amber-300 bg-amber-50'}>
                    {fb.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {fb.status === 'pending' && (
                      <Button variant="ghost" size="icon" className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => handleResolve(fb.id)} title="Mark resolved">
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(fb.id)} title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
