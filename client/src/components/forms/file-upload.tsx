import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  label: string;
  onChange: (files: File[]) => void;
  value: File[];
  maxFiles?: number;
  accept?: string;
  required?: boolean;
  error?: string | null;
  className?: string;
  hint?: string;
}

export function FileUpload({
  id,
  label,
  onChange,
  value = [],
  maxFiles = 5,
  accept = "image/*",
  required = false,
  error = null,
  className,
  hint,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: File[] = [];
    const remainingSlots = maxFiles - value.length;
    
    // Convert FileList to array and limit to remaining slots
    Array.from(fileList).slice(0, remainingSlots).forEach(file => {
      // Only add files with accepted mime types
      if (accept === "*" || accept.includes("*") || accept.includes(file.type)) {
        newFiles.push(file);
      }
    });
    
    if (newFiles.length > 0) {
      onChange([...value, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>

      <div
        onDragEnter={handleDrag}
        className={cn(
          "border-2 border-dashed rounded-md p-4 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-neutral-200 dark:border-neutral-700",
          error ? "border-destructive" : ""
        )}
      >
        <div 
          className="flex flex-col items-center justify-center py-4"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <i className="ri-upload-cloud-line text-3xl text-neutral-400 mb-2"></i>
          <p className="text-sm text-neutral-500 mb-1">
            Drag and drop files here, or{" "}
            <button
              type="button"
              className="text-primary hover:text-primary-600 font-medium"
              onClick={openFileDialog}
            >
              browse
            </button>
          </p>
          <p className="text-xs text-neutral-400">
            {accept === "image/*" 
              ? "Accepts all image formats" 
              : `Accepted formats: ${accept}`}
            {maxFiles > 0 && ` (Max ${maxFiles} files)`}
          </p>
          <input
            ref={fileInputRef}
            id={id}
            name={id}
            type="file"
            multiple={maxFiles !== 1}
            accept={accept}
            onChange={handleChange}
            className="hidden"
            required={required && value.length === 0}
          />
        </div>

        {value.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {value.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-file-line text-3xl text-neutral-400"></i>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
                <p className="text-xs text-neutral-500 truncate mt-1">{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {(hint || error) && (
        <div className="mt-1">
          {error ? (
            <p className="text-xs text-destructive animate-shake">{error}</p>
          ) : hint ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}