/**
 * PoliciesForm Component
 * 
 * Form for configuring hotel policies during the onboarding process
 */

import { useState } from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { PolicyFormData, PolicyRule } from '../types/index';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus, Trash2, Copy, FileText, AlertCircle } from 'lucide-react';
import { policyTemplates } from './policy-templates';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Form validation schema
const policyRuleSchema = z.object({
  title: z.string().min(1, "Rule title is required"),
  description: z.string().min(10, "Rule description must be at least 10 characters"),
});

const policyFormSchema = z.object({
  name: z.string().min(1, "Policy name is required"),
  description: z.string().min(10, "Policy description must be at least 10 characters"),
  rules: z.array(policyRuleSchema).min(1, "At least one rule is required"),
  isActive: z.boolean().default(true),
});

export function PoliciesForm() {
  const { formState, updatePolicy, addPolicy, removePolicy } = useOnboarding();
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(0);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  
  // Form setup for current policy
  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: formState.policies[selectedPolicyIndex] || {
      name: '',
      description: '',
      rules: [],
      isActive: true
    },
    mode: 'onChange'
  });
  
  // When selected policy index changes, update form values
  const handlePolicyChange = (index: number) => {
    // Save current form data for current policy
    const currentFormData = form.getValues();
    updatePolicy(selectedPolicyIndex, currentFormData);
    
    // Switch to new policy
    setSelectedPolicyIndex(index);
    form.reset(formState.policies[index]);
  };
  
  // Handler for form changes
  const handleFormChange = () => {
    const data = form.getValues();
    updatePolicy(selectedPolicyIndex, data);
  };
  
  // Add a new rule to the current policy
  const handleAddRule = () => {
    const currentRules = form.getValues().rules || [];
    const newRule: PolicyRule = {
      title: '',
      description: ''
    };
    
    const updatedRules = [...currentRules, newRule];
    form.setValue('rules', updatedRules);
    handleFormChange();
  };
  
  // Remove a rule from the current policy
  const handleRemoveRule = (ruleIndex: number) => {
    const currentRules = form.getValues().rules || [];
    const updatedRules = currentRules.filter((_, i) => i !== ruleIndex);
    form.setValue('rules', updatedRules);
    handleFormChange();
  };
  
  // Add a new policy
  const handleAddPolicy = () => {
    // Save current policy data
    const currentData = form.getValues();
    updatePolicy(selectedPolicyIndex, currentData);
    
    // Add new policy and switch to it
    addPolicy();
    setSelectedPolicyIndex(formState.policies.length); // Switch to the new policy
    form.reset({
      name: '',
      description: '',
      rules: [],
      isActive: true
    });
  };
  
  // Remove the current policy
  const handleRemovePolicy = () => {
    if (formState.policies.length <= 1) {
      return; // Don't remove the last policy
    }
    
    removePolicy(selectedPolicyIndex);
    
    // Set selected index to the previous policy or 0
    const newIndex = selectedPolicyIndex > 0 ? selectedPolicyIndex - 1 : 0;
    setSelectedPolicyIndex(newIndex);
    
    // Reset form with the new selected policy data
    if (formState.policies.length > 0) {
      form.reset(formState.policies[newIndex]);
    }
  };
  
  // Apply a template to the current policy
  const applyTemplate = (templateIndex: number) => {
    const template = policyTemplates[templateIndex];
    
    form.setValue('name', template.name);
    form.setValue('description', template.description);
    form.setValue('rules', template.rules);
    form.setValue('isActive', true);
    
    handleFormChange();
    setShowTemplateDialog(false);
  };
  
  // Get policy summary for display in tabs
  const getPolicySummary = () => {
    if (!formState.policies.length) return [];
    
    return formState.policies.map((policy, index) => ({
      index,
      name: policy.name || `Policy ${index + 1}`,
      rulesCount: policy.rules.length,
      isActive: policy.isActive
    }));
  };
  
  const policySummary = getPolicySummary();
  
  return (
    <div className="space-y-8">
      {/* Policy Tabs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Your Policies</CardTitle>
            <div className="flex gap-2">
              <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Use Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Policy Templates</DialogTitle>
                    <DialogDescription>
                      Select a template to quickly create standard hospitality policies.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {policyTemplates.map((template, i) => (
                      <Card key={i} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => applyTemplate(i)}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline">{template.rules.length} Rules</Badge>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4 mr-1" />
                            Use
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="default" size="sm" onClick={handleAddPolicy}>
                <Plus className="h-4 w-4 mr-1" />
                Add Policy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="0" 
            value={selectedPolicyIndex.toString()}
            onValueChange={(value) => handlePolicyChange(parseInt(value))}
            className="w-full"
          >
            <TabsList className="mb-4 overflow-x-auto">
              {policySummary.map((policy) => (
                <TabsTrigger key={policy.index} value={policy.index.toString()} className="relative">
                  {policy.name}
                  {!policy.isActive && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {policySummary.map((policy) => (
              <TabsContent key={policy.index} value={policy.index.toString()}>
                <form onChange={handleFormChange} className="space-y-6">
                  {/* Policy Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Cancellation Policy" {...field} />
                            </FormControl>
                            <FormDescription>
                              The title that identifies this policy
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active Status</FormLabel>
                              <FormDescription>
                                Toggles whether this policy is currently in effect
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide a general description of this policy..." 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A concise explanation of the policy's purpose and scope
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Policy Rules */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <CardTitle className="text-lg">Policy Rules</CardTitle>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddRule}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Rule
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {form.watch('rules')?.length ? (
                        <Accordion type="multiple" className="space-y-4">
                          {form.watch('rules').map((rule, ruleIndex) => (
                            <AccordionItem 
                              key={ruleIndex} 
                              value={`rule-${ruleIndex}`}
                              className="border rounded-lg px-2"
                            >
                              <div className="flex items-center justify-between">
                                <AccordionTrigger className="py-2 px-1 hover:no-underline">
                                  <span className="text-left overflow-hidden text-ellipsis">
                                    {rule.title || `Rule ${ruleIndex + 1}`}
                                  </span>
                                </AccordionTrigger>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveRule(ruleIndex);
                                  }}
                                  className="text-destructive hover:text-destructive mr-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <AccordionContent className="px-1 pb-4 pt-2">
                                <div className="space-y-4">
                                  <div>
                                    <FormLabel>Rule Title*</FormLabel>
                                    <Input
                                      placeholder="e.g. Early Check-out Fee"
                                      value={rule.title}
                                      onChange={(e) => {
                                        const updatedRules = [...form.getValues().rules];
                                        updatedRules[ruleIndex].title = e.target.value;
                                        form.setValue('rules', updatedRules);
                                        handleFormChange();
                                      }}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <FormLabel>Rule Description*</FormLabel>
                                    <Textarea
                                      placeholder="Explain the details of this rule..."
                                      value={rule.description}
                                      onChange={(e) => {
                                        const updatedRules = [...form.getValues().rules];
                                        updatedRules[ruleIndex].description = e.target.value;
                                        form.setValue('rules', updatedRules);
                                        handleFormChange();
                                      }}
                                      className="mt-1 resize-none"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <div className="text-center py-6 bg-muted/50 rounded-lg border border-dashed">
                          <p className="text-muted-foreground">No rules added yet</p>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={handleAddRule}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Your First Rule
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Remove Policy */}
                  {formState.policies.length > 1 && (
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleRemovePolicy}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove Policy
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}