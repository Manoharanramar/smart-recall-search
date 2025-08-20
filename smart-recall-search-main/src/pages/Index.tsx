import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthWrapper } from '@/components/AuthWrapper';
import { SearchInterface } from '@/components/SearchInterface';
import { KnowledgeManager } from '@/components/KnowledgeManager';
import { Search, FileText, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <AuthWrapper>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Smart Recall Search Engine
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find information using incomplete details like "blue icon, last week, something about AI". 
            Our AI understands fragments and reconstructs the missing pieces to deliver accurate results.
          </p>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Smart Search
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-8">
            <SearchInterface />
          </TabsContent>
          
          <TabsContent value="knowledge" className="mt-8">
            <KnowledgeManager />
          </TabsContent>
        </Tabs>
      </div>
    </AuthWrapper>
  );
};

export default Index;
