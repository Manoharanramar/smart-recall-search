import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Tag, Calendar, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const KnowledgeManager: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'document',
    tags: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadKnowledgeItems();
  }, []);

  const loadKnowledgeItems = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading knowledge items:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load your knowledge base.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in title and content.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const itemData = {
        title: formData.title,
        content: formData.content,
        content_type: formData.content_type,
        tags,
        user_id: user.id
      };

      let error;
      if (editingItem) {
        const { error: updateError } = await supabase
          .from('knowledge_base')
          .update(itemData)
          .eq('id', editingItem.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('knowledge_base')
          .insert(itemData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: editingItem ? "Item Updated" : "Item Added",
        description: `Successfully ${editingItem ? 'updated' : 'added'} knowledge item.`,
      });

      setFormData({ title: '', content: '', content_type: 'document', tags: '' });
      setIsDialogOpen(false);
      setEditingItem(null);
      loadKnowledgeItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Save Error",
        description: "Failed to save knowledge item.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      content_type: item.content_type,
      tags: item.tags.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: "Knowledge item deleted successfully.",
      });
      loadKnowledgeItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete knowledge item.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', content_type: 'document', tags: '' });
    setEditingItem(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Knowledge Base
            </span>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Knowledge
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Knowledge Item' : 'Add New Knowledge Item'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a descriptive title..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Content Type</label>
                    <Select 
                      value={formData.content_type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                        <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter the content or description..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tags (comma-separated)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g., important, work, project, AI..."
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingItem ? 'Update' : 'Add'} Knowledge Item
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <p className="text-muted-foreground">
            Build your personal knowledge base to enhance search accuracy. Add documents, notes, and important information.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading knowledge base...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No knowledge items yet. Add your first item to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {item.content_type}
                          </Badge>
                          <Calendar className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};