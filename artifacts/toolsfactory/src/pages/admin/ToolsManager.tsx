import React from 'react';
import { Link } from 'wouter';
import { AdminLayout } from '@/components/AdminLayout';
import { useListTools, useDeleteTool, useUpdateTool } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, EyeOff, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function ToolsManager() {
  const { data, isLoading } = useListTools();
  const deleteMut = useDeleteTool();
  const updateMut = useUpdateTool();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      await deleteMut.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      toast({ title: 'Tool deleted' });
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    await updateMut.mutateAsync({ id, data: { status: newStatus } });
    queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
    toast({ title: `Tool ${newStatus}` });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Tools Manager</h2>
          <p className="text-muted-foreground mt-1">Create, edit, and manage your platform's tools.</p>
        </div>
        <Button asChild>
          <Link href="/admin/tools/new"><Plus className="w-4 h-4 mr-2" /> Build New Tool</Link>
        </Button>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tool Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading tools...</TableCell></TableRow>
            ) : data?.tools?.map(tool => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">
                  {tool.name}
                  <div className="text-xs text-muted-foreground font-normal">/{tool.slug}</div>
                </TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{tool.category}</Badge></TableCell>
                <TableCell>{tool.viewCount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {tool.averageRating.toFixed(1)} <span className="text-xs text-muted-foreground">({tool.ratingCount})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tool.status === 'active' ? 'default' : 'secondary'} className={tool.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                    {tool.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(tool.id, tool.status)} title={tool.status === 'active' ? 'Disable' : 'Enable'}>
                      {tool.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/tools/${tool.id}/edit`}><Edit className="w-4 h-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(tool.id)}>
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
