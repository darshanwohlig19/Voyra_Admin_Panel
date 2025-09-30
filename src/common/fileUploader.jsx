// 'use client';

// import { useState, useCallback } from 'react';
// import { Upload, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';

// export default function FileUpload({
// 	onFileUpload,
// 	acceptedFileTypes = 'image/*',
// 	maxFileSize = 5 * 1024 * 1024, // 5MB
// 	cardClassName = '',
// 	uploadButtonText = 'Choose File',
// 	dragAndDropText = 'Drag and drop your file here or',
// 	supportsText = 'Supports: JPG, PNG, GIF (Max 5MB)',
// }) {
// 	const [file, setFile] = useState(null);
// 	const [preview, setPreview] = useState(null);
// 	const [isDragging, setIsDragging] = useState(false);

// 	const handleDrag = useCallback((e) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
// 	}, []);

// 	const handleDrop = useCallback((e) => {
// 		e.preventDefault();
// 		e.stopPropagation();
// 		setIsDragging(false);

// 		const files = Array.from(e.dataTransfer.files);
// 		if (files[0]) {
// 			handleFile(files[0]);
// 		}
// 	}, []);

// 	const handleFile = (file) => {
// 		if (!file.type.startsWith('image/')) {
// 			alert('Please upload an image file');
// 			return;
// 		}

// 		if (file.size > maxFileSize) {
// 			alert(`File size exceeds the maximum limit of ${maxFileSize / 1024 / 1024}MB`);
// 			return;
// 		}

// 		setFile(file);
// 		const reader = new FileReader();
// 		reader.onloadend = () => {
// 			setPreview(reader.result);
// 		};
// 		reader.readAsDataURL(file);
// 		if (onFileUpload) {
// 			onFileUpload(file);
// 		}
// 	};

// 	const handleFileInput = (e) => {
// 		const file = e.target.files?.[0];
// 		if (file) {
// 			handleFile(file);
// 		}
// 	};

// 	const removeFile = () => {
// 		setFile(null);
// 		setPreview(null);
// 		if (onFileUpload) {
// 			onFileUpload(null);
// 		}
// 	};

// 	return (
// 		<div className="w-full max-w-md mx-auto p-4">
// 			<Card className={`p-8 ${isDragging ? 'bg-muted' : ''} ${cardClassName}`}>
// 				<div
// 					onDragEnter={handleDrag}
// 					onDragLeave={handleDrag}
// 					onDragOver={handleDrag}
// 					onDrop={handleDrop}
// 					className="border-2 border-dashed rounded-lg p-6 text-center"
// 				>
// 					{preview ? (
// 						<div className="space-y-4">
// 							<div className="relative w-full aspect-video">
// 								<img
// 									src={preview}
// 									alt="Preview"
// 									className="rounded-lg w-40 h-28 rounded-xl object-contain w-full h-full"
// 								/>
// 								<Button
// 									variant="destructive"
// 									size="icon"
// 									className="absolute top-2 right-2"
// 									onClick={removeFile}
// 								>
// 									<X className="h-4 w-4" />
// 								</Button>
// 							</div>
// 							<p className="text-sm text-muted-foreground">{file?.name}</p>
// 						</div>
// 					) : (
// 						<div className="space-y-4">
// 							<div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
// 								<Upload className="h-6 w-6" />
// 							</div>
// 							<div className="space-y-2">
// 								<p className="text-sm font-medium">{dragAndDropText}</p>
// 								<label htmlFor="file-upload">
// 									<Button
// 										variant="secondary"
// 										className="cursor-pointer"
// 										onClick={() => document.getElementById('file-upload')?.click()}
// 									>
// 										{uploadButtonText}
// 									</Button>
// 								</label>
// 								<input
// 									id="file-upload"
// 									type="file"
// 									className="hidden"
// 									accept={acceptedFileTypes}
// 									onChange={handleFileInput}
// 								/>
// 							</div>
// 							<p className="text-xs text-muted-foreground">{supportsText}</p>
// 						</div>
// 					)}
// 				</div>
// 			</Card>
// 		</div>
// 	);
// }
