/**
 * @fileoverview Document Manager Component
 * @description Comprehensive document management system for asset issuance
 * @version 1.0.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  File, 
  Trash2, 
  Download, 
  Eye, 
  Edit, 
  Check, 
  X, 
  AlertTriangle,
  FileText,
  Image,
  Video,
  Archive,
  Shield,
  Clock,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Heading, 
  Text, 
  Badge, 
  Input,
  Select,
  Progress,
  Dropdown,
  IconButton,
  Checkbox,
  Dialog
} from '@greenlink/ui';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import type { 
  AssetDocument, 
  DocumentType, 
  DocumentCategory, 
  DocumentStatus,
  ApprovalStatus 
} from '@/types';

interface DocumentManagerProps {
  /** Asset ID for document association */
  assetId: string;
  /** Existing documents */
  documents?: AssetDocument[];
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed file types */
  allowedTypes?: string[];
  /** Read-only mode */
  readOnly?: boolean;
  /** Callback when documents change */
  onDocumentsChange?: (documents: AssetDocument[]) => void;
  /** Callback when document is uploaded */
  onDocumentUpload?: (file: File, metadata: DocumentMetadata) => Promise<AssetDocument>;
  /** Callback when document is deleted */
  onDocumentDelete?: (documentId: string) => Promise<void>;
  /** Callback when document is downloaded */
  onDocumentDownload?: (document: AssetDocument) => void;
  /** Callback when document is viewed */
  onDocumentView?: (document: AssetDocument) => void;
}

interface DocumentMetadata {
  type: DocumentType;
  category: DocumentCategory;
  title: string;
  description?: string;
  tags: string[];
  isConfidential: boolean;
  expiryDate?: Date;
}

const documentTypes: Array<{ value: DocumentType; label: string; icon: React.ComponentType<any> }> = [
  { value: 'legal', label: '法律文件', icon: Shield },
  { value: 'technical', label: '技术文档', icon: FileText },
  { value: 'financial', label: '财务文件', icon: FileText },
  { value: 'environmental', label: '环境文档', icon: FileText },
  { value: 'compliance', label: '合规文件', icon: Shield },
  { value: 'certification', label: '认证证书', icon: Shield },
  { value: 'contract', label: '合同协议', icon: FileText },
  { value: 'report', label: '报告文件', icon: FileText },
  { value: 'image', label: '图片文件', icon: Image },
  { value: 'video', label: '视频文件', icon: Video },
  { value: 'other', label: '其他文件', icon: File },
];

const documentCategories: Array<{ value: DocumentCategory; label: string }> = [
  { value: 'project_description', label: '项目描述' },
  { value: 'environmental_impact', label: '环境影响' },
  { value: 'financial_projections', label: '财务预测' },
  { value: 'legal_agreements', label: '法律协议' },
  { value: 'certifications', label: '认证证书' },
  { value: 'technical_specifications', label: '技术规格' },
  { value: 'monitoring_reports', label: '监测报告' },
  { value: 'audit_reports', label: '审计报告' },
  { value: 'compliance_documents', label: '合规文档' },
  { value: 'due_diligence', label: '尽职调查' },
  { value: 'marketing_materials', label: '营销材料' },
];

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  assetId,
  documents = [],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
  ],
  readOnly = false,
  onDocumentsChange,
  onDocumentUpload,
  onDocumentDelete,
  onDocumentDownload,
  onDocumentView,
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File drop zone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (readOnly) return;

    for (const file of acceptedFiles) {
      if (file.size > maxFileSize) {
        console.error(`File ${file.name} is too large`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        console.error(`File type ${file.type} is not allowed`);
        continue;
      }

      // Show upload modal for metadata
      setIsUploadModalOpen(true);
      // In a real implementation, this would open a modal for each file
    }
  }, [maxFileSize, allowedTypes, readOnly]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: readOnly,
    multiple: true,
  });

  // Filter and sort documents
  const filteredAndSortedDocuments = React.useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [documents, searchQuery, filterType, filterStatus, sortBy, sortOrder]);

  // Handle document selection
  const handleDocumentSelect = (documentId: string, selected: boolean) => {
    const newSelection = new Set(selectedDocuments);
    if (selected) {
      newSelection.add(documentId);
    } else {
      newSelection.delete(documentId);
    }
    setSelectedDocuments(newSelection);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDocuments(new Set(filteredAndSortedDocuments.map(doc => doc.id)));
    } else {
      setSelectedDocuments(new Set());
    }
  };

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (readOnly) return;
    
    for (const documentId of selectedDocuments) {
      try {
        await onDocumentDelete?.(documentId);
      } catch (error) {
        console.error(`Failed to delete document ${documentId}:`, error);
      }
    }
    setSelectedDocuments(new Set());
  };

  // Get file icon based on type
  const getFileIcon = (document: AssetDocument) => {
    const typeConfig = documentTypes.find(t => t.value === document.type);
    const Icon = typeConfig?.icon || File;
    return <Icon className="h-8 w-8 text-text-secondary" />;
  };

  // Get status badge
  const getStatusBadge = (status: DocumentStatus) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: '草稿' },
      review: { variant: 'warning' as const, label: '审核中' },
      approved: { variant: 'success' as const, label: '已批准' },
      rejected: { variant: 'error' as const, label: '已拒绝' },
      archived: { variant: 'secondary' as const, label: '已归档' },
      expired: { variant: 'error' as const, label: '已过期' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    );
  };

  // Get approval status badge
  const getApprovalBadge = (approvalStatus: ApprovalStatus) => {
    const config = {
      pending: { variant: 'warning' as const, label: '待审批', icon: Clock },
      approved: { variant: 'success' as const, label: '已批准', icon: Check },
      rejected: { variant: 'error' as const, label: '已拒绝', icon: X },
      expired: { variant: 'error' as const, label: '已过期', icon: AlertTriangle },
    };
    
    const statusConfig = config[approvalStatus];
    const Icon = statusConfig.icon;
    
    return (
      <Badge variant={statusConfig.variant} size="sm" className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{statusConfig.label}</span>
      </Badge>
    );
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Render upload area
  const renderUploadArea = () => {
    if (readOnly) return null;

    return (
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone",
          isDragActive && "upload-zone-active",
          "cursor-pointer"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3">
          <Upload className="h-12 w-12 text-text-secondary" />
          <div className="text-center">
            <Text variant="body" className="font-medium">
              拖拽文件到此处或点击上传
            </Text>
            <Text variant="caption" className="text-text-secondary mt-1">
              支持 PDF, Word, Excel, 图片和视频文件，最大 {formatFileSize(maxFileSize)}
            </Text>
          </div>
          <Button variant="secondary" size="sm">
            选择文件
          </Button>
        </div>
      </div>
    );
  };

  // Render toolbar
  const renderToolbar = () => (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="搜索文档..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftElement={<Search className="h-4 w-4 text-text-secondary" />}
          className="w-full sm:w-64"
        />
        
        <Select
          options={[
            { value: 'all', label: '所有类型' },
            ...documentTypes.map(type => ({ value: type.value, label: type.label }))
          ]}
          value={filterType}
          onChange={(value) => setFilterType(value as DocumentType | 'all')}
          placeholder="文档类型"
        />
        
        <Select
          options={[
            { value: 'all', label: '所有状态' },
            { value: 'draft', label: '草稿' },
            { value: 'review', label: '审核中' },
            { value: 'approved', label: '已批准' },
            { value: 'rejected', label: '已拒绝' },
            { value: 'archived', label: '已归档' },
            { value: 'expired', label: '已过期' },
          ]}
          value={filterStatus}
          onChange={(value) => setFilterStatus(value as DocumentStatus | 'all')}
          placeholder="状态"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {selectedDocuments.size > 0 && (
          <>
            <Text variant="caption" className="text-text-secondary">
              已选择 {selectedDocuments.size} 个文档
            </Text>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBulkDelete}
              disabled={readOnly}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              批量删除
            </Button>
          </>
        )}
        
        {!readOnly && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="h-4 w-4" />}
          >
            上传文档
          </Button>
        )}
      </div>
    </div>
  );

  // Render document list
  const renderDocumentList = () => (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-4 p-3 bg-background-secondary rounded-lg text-sm font-medium text-text-secondary">
        <Checkbox
          checked={selectedDocuments.size === filteredAndSortedDocuments.length && filteredAndSortedDocuments.length > 0}
          indeterminate={selectedDocuments.size > 0 && selectedDocuments.size < filteredAndSortedDocuments.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <div className="flex-1 grid grid-cols-12 gap-4">
          <div className="col-span-4">文档名称</div>
          <div className="col-span-2">类型</div>
          <div className="col-span-2">状态</div>
          <div className="col-span-2">大小</div>
          <div className="col-span-2">更新时间</div>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Document rows */}
      {filteredAndSortedDocuments.map((document) => (
        <Card key={document.id} className="p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedDocuments.has(document.id)}
              onChange={(e) => handleDocumentSelect(document.id, e.target.checked)}
            />
            
            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
              {/* Document name and icon */}
              <div className="col-span-4 flex items-center space-x-3">
                {getFileIcon(document)}
                <div className="min-w-0">
                  <Text variant="label" className="font-medium truncate">
                    {document.title}
                  </Text>
                  <Text variant="caption" className="text-text-secondary truncate">
                    {document.fileName}
                  </Text>
                  {document.isConfidential && (
                    <Badge variant="warning" size="xs" className="mt-1">
                      机密
                    </Badge>
                  )}
                </div>
              </div>

              {/* Type */}
              <div className="col-span-2">
                <Badge variant="secondary" size="sm">
                  {documentTypes.find(t => t.value === document.type)?.label || document.type}
                </Badge>
              </div>

              {/* Status */}
              <div className="col-span-2 space-y-1">
                {getStatusBadge(document.status)}
                {getApprovalBadge(document.approvalStatus)}
              </div>

              {/* Size */}
              <div className="col-span-2">
                <Text variant="caption" className="text-text-secondary">
                  {formatFileSize(document.fileSize)}
                </Text>
              </div>

              {/* Updated time */}
              <div className="col-span-2">
                <Text variant="caption" className="text-text-secondary">
                  {new Date(document.updatedAt).toLocaleDateString('zh-CN')}
                </Text>
              </div>
            </div>

            {/* Actions */}
            <Dropdown
              trigger={
                <IconButton variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </IconButton>
              }
              items={[
                {
                  key: 'view',
                  type: 'item',
                  label: '查看',
                  icon: <Eye className="h-4 w-4" />,
                  onClick: () => onDocumentView?.(document),
                },
                {
                  key: 'download',
                  type: 'item',
                  label: '下载',
                  icon: <Download className="h-4 w-4" />,
                  onClick: () => onDocumentDownload?.(document),
                },
                {
                  key: 'edit',
                  type: 'item',
                  label: '编辑',
                  icon: <Edit className="h-4 w-4" />,
                  disabled: readOnly || document.status === 'approved',
                },
                {
                  key: 'delete',
                  type: 'item',
                  label: '删除',
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => onDocumentDelete?.(document.id),
                  disabled: readOnly,
                  destructive: true,
                },
              ]}
            />
          </div>
        </Card>
      ))}

      {filteredAndSortedDocuments.length === 0 && (
        <div className="text-center py-12">
          <File className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <Text variant="body" className="text-text-secondary">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
              ? '没有找到匹配的文档' 
              : '还没有上传任何文档'
            }
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level="h2" className="text-xl font-semibold">
          文档管理
        </Heading>
        <Badge variant="secondary">
          {documents.length} 个文档
        </Badge>
      </div>

      {!readOnly && renderUploadArea()}
      {renderToolbar()}
      {renderDocumentList()}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={(e) => {
          if (e.target.files) {
            onDrop(Array.from(e.target.files));
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default DocumentManager;