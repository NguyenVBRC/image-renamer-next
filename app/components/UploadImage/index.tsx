"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Sparkles, Download, Loader2 } from "lucide-react";
import styles from "./UploadImage.module.css";

interface AnalysisResult {
  description: string;
  suggestedName: string;
  confidence: number;
}

const UploadImage = ({ className }: { className?: string }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError("");
    } else {
      setError("Please select a valid image file");
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError("");

    try {
      // Convert image to base64
      const base64 = await fileToBase64(selectedFile);

      // Call our API route
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image: base64,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result: AnalysisResult = await response.json();

      setAnalysisResult(result);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const downloadRenamedFile = () => {
    if (!selectedFile || !analysisResult) return;

    const fileExtension = selectedFile.name.split(".").pop();
    const newFileName = analysisResult.suggestedName.endsWith(`.${fileExtension}`)
      ? analysisResult.suggestedName
      : `${analysisResult.suggestedName.split(".")[0]}.${fileExtension}`;

    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = newFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetApp = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setAnalysisResult(null);
    setError("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className={className}>
      {/* Upload Section */}
      {!selectedFile && (
        <div className={styles.card}>
          <div className={styles.uploadArea}>
            <div className={styles.uploadContent}>
              <Upload className={styles.uploadIcon} />
              <h3 className={styles.uploadTitle}>Upload Your Image</h3>
              <p className={styles.uploadDescription}>Choose an image file (PNG, JPG, WebP) to get started</p>
              <label className={styles.uploadButton}>
                Select Image
                <input type="file" accept="image/*" onChange={handleFileSelect} className={styles.fileInput} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview and Analysis */}
      {selectedFile && (
        <div className={styles.card}>
          <div className={styles.previewGrid}>
            {/* Image Preview */}
            <div>
              <h3 className={styles.sectionTitle}>
                <ImageIcon className={styles.sectionIcon} />
                Original Image
              </h3>
              <div className={styles.imagePreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
              </div>
              <div className={styles.fileInfo}>
                <p>
                  <strong>Original filename:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>File size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Analysis Section */}
            <div className={styles.analysisSection}>
              <h3 className={styles.sectionTitle}>
                <Sparkles className={styles.sectionIcon} />
                AI Analysis
              </h3>

              {!analysisResult && !isAnalyzing && (
                <div className={styles.analysisPrompt}>
                  <p>Ready to analyze your image and generate a better filename</p>
                  <button onClick={analyzeImage} className={styles.analyzeButton}>
                    Analyze with AI
                  </button>
                  <button onClick={resetApp} className={`${styles.resetButton} ${styles.cancelButton}`}>
                    Cancel
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className={styles.loadingState}>
                  <Loader2 className={styles.loadingIcon} />
                  <p className={styles.loadingText}>Analyzing image with AI...</p>
                </div>
              )}

              {analysisResult && (
                <div>
                  <div className={styles.analysisComplete}>
                    <h4>Analysis Complete!</h4>
                    <p className={styles.analysisDescription}>{analysisResult.description}</p>
                    <div className={styles.confidenceBar}>
                      <div className={styles.confidenceTrack}>
                        <div
                          className={styles.confidenceFill}
                          style={{ width: `${analysisResult.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span>{Math.round(analysisResult.confidence * 100)}%</span>
                    </div>
                  </div>

                  <div className={styles.filenameSuggestion}>
                    <h4>Suggested Filename:</h4>
                    <p className={styles.suggestedFilename}>{analysisResult.suggestedName}</p>
                  </div>

                  <div className={styles.actionButtons}>
                    <button onClick={downloadRenamedFile} className={styles.downloadButton}>
                      <Download className={styles.buttonIcon} />
                      Download Renamed
                    </button>
                    <button onClick={resetApp} className={styles.resetButton}>
                      New Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default UploadImage;
