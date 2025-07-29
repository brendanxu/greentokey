/**
 * @fileoverview Asset Issuance Wizard Component
 * @description Step-by-step wizard for guiding users through the asset issuance process
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Settings,
  Shield,
  Zap,
  Upload,
  Eye
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Heading, 
  Text, 
  Progress,
  Badge 
} from '@greenlink/ui';
import { cn } from '@/lib/utils';
import type { 
  Asset, 
  AssetFormData, 
  WorkflowStep, 
  StepStatus 
} from '@/types';

// Wizard step configuration
interface WizardStep {
  id: WorkflowStep;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isOptional?: boolean;
  estimatedTime: string;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'asset_details',
    title: '资产基本信息',
    description: '填写资产的基本信息和分类',
    icon: FileText,
    estimatedTime: '5-10分钟',
  },
  {
    id: 'documentation',
    title: '文档上传',
    description: '上传项目文档和认证材料',
    icon: Upload,
    estimatedTime: '10-15分钟',
  },
  {
    id: 'verification',
    title: '资产验证',
    description: '第三方验证和环境影响评估',
    icon: Shield,
    estimatedTime: '1-3个工作日',
  },
  {
    id: 'tokenization',
    title: '代币化配置',
    description: '设置代币参数和智能合约配置',
    icon: Settings,
    estimatedTime: '15-20分钟',
  },
  {
    id: 'compliance_review',
    title: '合规审查',
    description: '法规合规性检查和审批',
    icon: Eye,
    estimatedTime: '2-5个工作日',
  },
  {
    id: 'final_approval',
    title: '最终审批',
    description: '管理层审批和发行授权',
    icon: CheckCircle,
    estimatedTime: '1-2个工作日',
  },
  {
    id: 'deployment',
    title: '部署上线',
    description: '智能合约部署和系统集成',
    icon: Zap,
    estimatedTime: '自动化处理',
  },
];

interface AssetIssuanceWizardProps {
  /** Initial asset data (for editing existing assets) */
  initialData?: Partial<Asset>;
  /** Current step (for resuming workflow) */
  currentStep?: WorkflowStep;
  /** Step completion status */
  stepStatus?: Record<WorkflowStep, StepStatus>;
  /** Callback when step is completed */
  onStepComplete?: (step: WorkflowStep, data: any) => void;
  /** Callback when workflow is cancelled */
  onCancel?: () => void;
  /** Callback when asset is successfully issued */
  onComplete?: (asset: Asset) => void;
  /** Loading state */
  loading?: boolean;
}

export const AssetIssuanceWizard: React.FC<AssetIssuanceWizardProps> = ({
  initialData,
  currentStep = 'asset_details',
  stepStatus = {},
  onStepComplete,
  onCancel,
  onComplete,
  loading = false,
}) => {
  const [activeStep, setActiveStep] = useState<WorkflowStep>(currentStep);
  const [formData, setFormData] = useState<Partial<AssetFormData>>(
    initialData ? convertAssetToFormData(initialData) : {}
  );
  const [completedSteps, setCompletedSteps] = useState<Set<WorkflowStep>>(
    new Set(Object.entries(stepStatus)
      .filter(([_, status]) => status === 'completed')
      .map(([step, _]) => step as WorkflowStep))
  );

  // Get current step index
  const currentStepIndex = wizardSteps.findIndex(step => step.id === activeStep);
  const progressPercentage = ((currentStepIndex + 1) / wizardSteps.length) * 100;

  // Check if a step can be accessed
  const canAccessStep = useCallback((stepId: WorkflowStep): boolean => {
    const stepIndex = wizardSteps.findIndex(step => step.id === stepId);
    const currentIndex = wizardSteps.findIndex(step => step.id === activeStep);
    
    // Can access current step and any completed step
    if (stepIndex <= currentIndex || completedSteps.has(stepId)) {
      return true;
    }
    
    // Can access next step if current step is completed
    if (stepIndex === currentIndex + 1 && completedSteps.has(activeStep)) {
      return true;
    }
    
    return false;
  }, [activeStep, completedSteps]);

  // Get step status for display
  const getStepStatus = (stepId: WorkflowStep): StepStatus => {
    if (stepStatus[stepId]) {
      return stepStatus[stepId];
    }
    
    if (completedSteps.has(stepId)) {
      return 'completed';
    }
    
    if (stepId === activeStep) {
      return 'in_progress';
    }
    
    return 'pending';
  };

  // Handle step navigation
  const handleStepClick = (stepId: WorkflowStep) => {
    if (canAccessStep(stepId)) {
      setActiveStep(stepId);
    }
  };

  const handleNext = () => {
    const currentIndex = wizardSteps.findIndex(step => step.id === activeStep);
    if (currentIndex < wizardSteps.length - 1) {
      const nextStep = wizardSteps[currentIndex + 1];
      setActiveStep(nextStep.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = wizardSteps.findIndex(step => step.id === activeStep);
    if (currentIndex > 0) {
      const prevStep = wizardSteps[currentIndex - 1];
      setActiveStep(prevStep.id);
    }
  };

  const handleStepSubmit = async (stepData: any) => {
    try {
      // Update form data
      setFormData(prev => ({ ...prev, ...stepData }));
      
      // Mark step as completed
      setCompletedSteps(prev => new Set([...prev, activeStep]));
      
      // Notify parent component
      await onStepComplete?.(activeStep, stepData);
      
      // Auto-advance to next step if not the last step
      if (currentStepIndex < wizardSteps.length - 1) {
        handleNext();
      } else {
        // Final step - complete the issuance
        await onComplete?.(formData as Asset);
      }
    } catch (error) {
      console.error('Failed to submit step:', error);
      // Handle error - show notification, etc.
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Text variant="label" className="text-sm font-medium">
            发行进度
          </Text>
          <Text variant="caption" className="text-text-secondary">
            {currentStepIndex + 1} / {wizardSteps.length}
          </Text>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {wizardSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isActive = step.id === activeStep;
          const canAccess = canAccessStep(step.id);
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Connection line */}
              {index < wizardSteps.length - 1 && (
                <div 
                  className={cn(
                    "absolute top-4 left-8 w-full h-0.5 -z-10",
                    status === 'completed' ? 'bg-issuer-500' : 'bg-border-primary'
                  )}
                />
              )}
              
              {/* Step circle */}
              <button
                onClick={() => handleStepClick(step.id)}
                disabled={!canAccess}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all mb-2",
                  "focus:outline-none focus:ring-2 focus:ring-issuer-500 focus:ring-offset-2",
                  {
                    // Completed step
                    'bg-issuer-500 border-issuer-500 text-white': status === 'completed',
                    // Active step  
                    'bg-white border-issuer-500 text-issuer-500': isActive && status !== 'completed',
                    // Pending step
                    'bg-white border-border-primary text-text-secondary': status === 'pending',
                    // In progress
                    'bg-issuer-50 border-issuer-500 text-issuer-600': status === 'in_progress',
                    // Disabled
                    'opacity-50 cursor-not-allowed': !canAccess,
                    // Enabled
                    'hover:scale-110 cursor-pointer': canAccess,
                  }
                )}
              >
                {status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </button>

              {/* Step title */}
              <div className="text-center max-w-20">
                <Text 
                  variant="caption" 
                  className={cn(
                    "text-xs font-medium",
                    isActive ? 'text-issuer-600' : 'text-text-secondary'
                  )}
                >
                  {step.title}
                </Text>
                {step.isOptional && (
                  <Badge variant="secondary" size="sm" className="mt-1">
                    可选
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render step content
  const renderStepContent = () => {
    const currentStepData = wizardSteps.find(step => step.id === activeStep);
    
    if (!currentStepData) {
      return <div>Unknown step</div>;
    }

    return (
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <currentStepData.icon className="h-6 w-6 text-issuer-500" />
            <Heading level="h2" className="text-xl font-semibold">
              {currentStepData.title}
            </Heading>
          </div>
          <Text variant="body" className="text-text-secondary">
            {currentStepData.description}
          </Text>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="secondary" size="sm">
              预计耗时: {currentStepData.estimatedTime}
            </Badge>
            {currentStepData.isOptional && (
              <Badge variant="outline" size="sm">
                可选步骤
              </Badge>
            )}
          </div>
        </div>

        {/* Step-specific content would be rendered here */}
        <div className="mb-6">
          {renderStepSpecificContent(activeStep)}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border-primary">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0 || loading}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            上一步
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              取消
            </Button>
            
            <Button
              variant="primary"
              onClick={() => handleStepSubmit({})} // This would be replaced with actual form data
              disabled={loading}
              rightIcon={
                currentStepIndex === wizardSteps.length - 1 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )
              }
              loading={loading}
            >
              {currentStepIndex === wizardSteps.length - 1 ? '完成发行' : '下一步'}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Placeholder for step-specific content
  const renderStepSpecificContent = (step: WorkflowStep) => {
    switch (step) {
      case 'asset_details':
        return (
          <div className="space-y-4">
            <Text>资产基本信息表单将在这里显示</Text>
            {/* AssetDetailsForm component will be implemented */}
          </div>
        );
      
      case 'documentation':
        return (
          <div className="space-y-4">
            <Text>文档上传界面将在这里显示</Text>
            {/* DocumentUploadForm component will be implemented */}
          </div>
        );
      
      case 'verification':
        return (
          <div className="space-y-4">
            <Text>资产验证状态和进度将在这里显示</Text>
            {/* VerificationStatus component will be implemented */}
          </div>
        );
      
      case 'tokenization':
        return (
          <div className="space-y-4">
            <Text>代币化配置表单将在这里显示</Text>
            {/* TokenizationConfig component will be implemented */}
          </div>
        );
      
      case 'compliance_review':
        return (
          <div className="space-y-4">
            <Text>合规审查状态将在这里显示</Text>
            {/* ComplianceReview component will be implemented */}
          </div>
        );
      
      case 'final_approval':
        return (
          <div className="space-y-4">
            <Text>最终审批状态将在这里显示</Text>
            {/* FinalApproval component will be implemented */}
          </div>
        );
      
      case 'deployment':
        return (
          <div className="space-y-4">
            <Text>部署进度将在这里显示</Text>
            {/* DeploymentProgress component will be implemented */}
          </div>
        );
      
      default:
        return <div>未知步骤</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Heading level="h1" className="text-2xl font-bold mb-2">
          资产发行向导
        </Heading>
        <Text variant="body" className="text-text-secondary">
          按照步骤完成绿色资产的代币化发行流程
        </Text>
      </div>

      {renderStepIndicator()}
      {renderStepContent()}
    </div>
  );
};

// Utility function to convert Asset to AssetFormData
function convertAssetToFormData(asset: Partial<Asset>): Partial<AssetFormData> {
  return {
    basicInfo: asset.name ? {
      name: asset.name,
      description: asset.description || '',
      category: asset.category || 'carbon_credits',
      subcategory: asset.subcategory || '',
    } : undefined,
    location: asset.location,
    specifications: asset.specifications,
    environmental: asset.environmentalData,
    tokenization: asset.tokenization,
    documents: [], // Files would need to be handled separately
  };
}

export default AssetIssuanceWizard;