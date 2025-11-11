'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export type ScenarioParameters = {
  targetAudience: string;
  priceAdjustment: number;
  ancillaryDiscount: number;
  status: 'default' | 'editing';
};

export type SimulationScenario = {
  id: string;
  name: string;
  parameters: ScenarioParameters;
};

interface SimulationScenarioFormProps {
  scenario: SimulationScenario;
  onUpdate: (id: string, updatedScenario: SimulationScenario) => void;
  onRemove: (id: string) => void;
}

export function SimulationScenarioForm({ scenario, onUpdate, onRemove }: SimulationScenarioFormProps) {
    const [localScenario, setLocalScenario] = useState(scenario);

    const isEditing = localScenario.parameters.status === 'editing';

    const handleSave = () => {
        onUpdate(scenario.id, { ...localScenario, parameters: { ...localScenario.parameters, status: 'default' } });
    };

    const handleEdit = () => {
        setLocalScenario({ ...localScenario, parameters: { ...localScenario.parameters, status: 'editing' } });
    };

    const handleCancel = () => {
        setLocalScenario(scenario); // Revert changes
        if (scenario.parameters.status !== 'default') {
            onUpdate(scenario.id, { ...scenario, parameters: { ...scenario.parameters, status: 'default' } });
        }
    }
    
    const handleInputChange = (field: keyof ScenarioParameters, value: string | number) => {
        setLocalScenario(prev => ({
            ...prev,
            parameters: { ...prev.parameters, [field]: value }
        }));
    };
    
     const handleNameChange = (value: string) => {
        setLocalScenario(prev => ({ ...prev, name: value }));
    };


  return (
    <Card className={isEditing ? "border-primary" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        {isEditing ? (
             <Input 
                value={localScenario.name} 
                onChange={(e) => handleNameChange(e.target.value)}
                className="text-lg font-semibold border-0 shadow-none focus-visible:ring-0 p-0"
             />
        ) : (
            <CardTitle>{localScenario.name}</CardTitle>
        )}
        
        {scenario.id !== 'base' && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(scenario.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`audience-${scenario.id}`}>Target Audience</Label>
          <Input
            id={`audience-${scenario.id}`}
            value={localScenario.parameters.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor={`price-adj-${scenario.id}`}>Price Adjustment (%)</Label>
          <Input
            id={`price-adj-${scenario.id}`}
            type="number"
            value={localScenario.parameters.priceAdjustment}
            onChange={(e) => handleInputChange('priceAdjustment', parseInt(e.target.value, 10))}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor={`ancillary-disc-${scenario.id}`}>Ancillary Discount (%)</Label>
          <Input
            id={`ancillary-disc-${scenario.id}`}
            type="number"
            value={localScenario.parameters.ancillaryDiscount}
            onChange={(e) => handleInputChange('ancillaryDiscount', parseInt(e.target.value, 10))}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
